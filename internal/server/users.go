package server

import (
	"auth-server/internal/database"
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type userRegisterRequest struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type userLoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type userResponse struct {
	SessionToken string `json:"sessionToken"`
	ExpiresAt    string `json:"expiresAt"`
}

func (s *Server) handleUserRegister(w http.ResponseWriter, r *http.Request) {
	var req userRegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Invalid request format",
		})
		return
	}

	app := r.Context().Value("application").(*database.Application)

	// Check if user already exists
	existingUser, err := s.db.GetUserByEmail(app.ID, req.Email)
	if err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Error checking for existing user",
		})
		return
	}

	if existingUser != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "User with this email already exists",
		})
		return
	}

	// Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Failed to hash password",
		})
		return
	}

	// Create user
	user := &database.User{
		ID:            uuid.New().String(),
		ApplicationID: app.ID,
		Email:         req.Email,
		FirstName:     req.FirstName,
		LastName:      req.LastName,
		PasswordHash:  string(hash),
	}

	if err := s.db.CreateUser(user); err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Failed to create user",
		})
		return
	}

	// Create session
	expiresAt := time.Now().Add(24 * time.Hour)
	session := &database.Session{
		ID:            uuid.New().String(),
		UserID:        user.ID,
		ApplicationID: app.ID,
		Token:         uuid.New().String(),
		ExpiresAt:     expiresAt,
	}

	if err := s.db.CreateSession(session); err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Failed to create session",
		})
		return
	}

	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data: userResponse{
			SessionToken: session.Token,
			ExpiresAt:    expiresAt.Format(time.RFC3339),
		},
	})
}

func (s *Server) handleUserLogin(w http.ResponseWriter, r *http.Request) {
	var req userLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Invalid request format",
		})
		return
	}

	app := r.Context().Value("application").(*database.Application)

	// Find user
	user, err := s.db.GetUserByEmail(app.ID, req.Email)
	if err != nil || user == nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Invalid credentials",
		})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Invalid credentials",
		})
		return
	}

	// Create session
	expiresAt := time.Now().Add(24 * time.Hour)
	session := &database.Session{
		ID:            uuid.New().String(),
		UserID:        user.ID,
		ApplicationID: app.ID,
		Token:         uuid.New().String(),
		ExpiresAt:     expiresAt,
	}

	if err := s.db.CreateSession(session); err != nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Failed to create session",
		})
		return
	}

	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data: userResponse{
			SessionToken: session.Token,
			ExpiresAt:    expiresAt.Format(time.RFC3339),
		},
	})
}

func (s *Server) handleGetUserDetails(w http.ResponseWriter, r *http.Request) {
	sessionToken := r.Header.Get("X-Session-Token")
	if sessionToken == "" {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Session token required",
		})
		return
	}

	// Get session by token
	session, err := s.db.GetSessionByToken(sessionToken)
	if err != nil || session == nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Invalid session",
		})
		return
	}

	// Check if session is expired
	if session.ExpiresAt.Before(time.Now()) {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "Session expired",
		})
		return
	}

	// Get user by ID
	user, err := s.db.GetUserByID(session.UserID)
	if err != nil || user == nil {
		json.NewEncoder(w).Encode(APIResponse{
			Success: false,
			Error:   "User not found",
		})
		return
	}

	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data:    user,
	})
}
