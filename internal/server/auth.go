package server

import (
	"auth-server/internal/database"
	"encoding/json"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type registerRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *Server) handleRegister(w http.ResponseWriter, r *http.Request) {
	var req registerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Invalid request format",
		})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Failed to hash password",
		})
		return
	}

	dev := &database.Developer{
		ID:           uuid.New().String(),
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Email:        req.Email,
		PasswordHash: string(hash),
	}

	if err := s.db.CreateDeveloper(dev); err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Failed to create developer",
		})
		return
	}

	token := s.generateJWT(dev)
	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data:    map[string]string{"token": token},
	})
}

func (s *Server) handleLogin(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Invalid request format",
		})
		return
	}

	dev, err := s.db.GetDeveloperByEmail(req.Email)
	if err != nil || dev == nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Invalid credentials",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(dev.PasswordHash), []byte(req.Password)); err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Invalid credentials",
		})
		return
	}

	token := s.generateJWT(dev)
	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data:    map[string]string{"token": token},
	})
}

func (s *Server) generateJWT(dev *database.Developer) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": dev.ID,
		"exp": time.Now().Add(s.jwt.exp).Unix(),
	})

	signedToken, _ := token.SignedString(s.jwt.secret)
	return signedToken
}
