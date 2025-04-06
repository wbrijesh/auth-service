package server

import (
	"auth-server/internal/database"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type applicationRequest struct {
	Name   string `json:"name"`
	Domain string `json:"domain"`
}

func generateKey(prefix string, length int) (string, error) {
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return prefix + base64.URLEncoding.EncodeToString(b)[:length], nil
}

func (s *Server) handleCreateApplication(w http.ResponseWriter, r *http.Request) {
	var req applicationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Invalid request format",
		})
		return
	}

	developerID := r.Context().Value("developerID").(string)

	publicKey, err := generateKey("pk_", 32)
	if err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Failed to generate public key",
		})
		return
	}

	secretKey, err := generateKey("sk_", 32)
	if err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Failed to generate secret key",
		})
		return
	}

	app := &database.Application{
		ID:          uuid.New().String(),
		DeveloperID: developerID,
		Name:        req.Name,
		Domain:      req.Domain,
		PublicKey:   publicKey,
		SecretKey:   secretKey,
	}

	if err := s.db.CreateApplication(app); err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Failed to create application",
		})
		return
	}

	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data:    app,
	})
}

func (s *Server) handleGetApplications(w http.ResponseWriter, r *http.Request) {
	developerID := r.Context().Value("developerID").(string)

	apps, err := s.db.GetApplicationsByDeveloperID(developerID)
	if err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Failed to fetch applications",
		})
		return
	}

	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data: map[string]interface{}{
			"applications": apps,
			"count":        len(apps),
		},
	})
}

func (s *Server) handleGetApplication(w http.ResponseWriter, r *http.Request) {
	developerID := r.Context().Value("developerID").(string)
	appID := chi.URLParam(r, "id")

	app, err := s.db.GetApplicationByID(appID, developerID)
	if err != nil {
		status := http.StatusInternalServerError
		errMsg := "Failed to fetch application"
		if err == sql.ErrNoRows {
			status = http.StatusNotFound
			errMsg = "Application not found"
		}
		w.WriteHeader(status)
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   errMsg,
		})
		return
	}

	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data:    app,
	})
}

func (s *Server) handleUpdateApplication(w http.ResponseWriter, r *http.Request) {
	var req applicationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Invalid request format",
		})
		return
	}

	developerID := r.Context().Value("developerID").(string)
	appID := chi.URLParam(r, "id")

	app := &database.Application{
		ID:          appID,
		DeveloperID: developerID,
		Name:        req.Name,
		Domain:      req.Domain,
	}

	if err := s.db.UpdateApplication(app); err != nil {
		errMsg := "Failed to update application"
		if err == sql.ErrNoRows {
			errMsg = "Application not found"
		}
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   errMsg,
		})
		return
	}

	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data:    app,
	})
}

func (s *Server) handleDeleteApplication(w http.ResponseWriter, r *http.Request) {
	developerID := r.Context().Value("developerID").(string)
	appID := chi.URLParam(r, "id")

	if err := s.db.DeleteApplication(appID, developerID); err != nil {
		errMsg := "Failed to delete application"
		if err == sql.ErrNoRows {
			errMsg = "Application not found"
		}
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   errMsg,
		})
		return
	}

	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
	})
}
