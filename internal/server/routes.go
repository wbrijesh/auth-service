package server

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"https://*", "http://*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"X-Public-Key",
			"X-Timestamp",
			"X-Signature",
		}, AllowCredentials: true,
		MaxAge: 300,
	}))

	// Developer auth routes
	r.Post("/api/auth/register", s.handleRegister)
	r.Post("/api/auth/login", s.handleLogin)

	// Application user auth routes
	r.Group(func(r chi.Router) {
		r.Use(s.apiKeyAuthMiddleware)

		r.Post("/api/users/register", s.handleUserRegister)
		r.Post("/api/users/login", s.handleUserLogin)
	})

	r.Get("/", s.HelloWorldHandler)
	r.Get("/health", s.healthHandler)

	// Application routes (protected by JWT)
	r.Group(func(r chi.Router) {
		r.Use(s.authMiddleware)

		r.Post("/api/applications", s.handleCreateApplication)
		r.Get("/api/applications", s.handleGetApplications)
		r.Get("/api/applications/{id}", s.handleGetApplication)
		r.Put("/api/applications/{id}", s.handleUpdateApplication)
		r.Delete("/api/applications/{id}", s.handleDeleteApplication)
	})

	return r
}

func (s *Server) HelloWorldHandler(w http.ResponseWriter, r *http.Request) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, _ := json.Marshal(s.db.Health())
	_, _ = w.Write(jsonResp)
}
