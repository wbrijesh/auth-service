package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"

	"auth-server/internal/database"
)

type Server struct {
	port      int
	db        database.Service
	jwtSecret []byte
	jwt       struct {
		secret []byte
		exp    time.Duration
	}
}

func NewServer() *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))

	srv := &Server{
		port:      port,
		db:        database.New(),
		jwtSecret: []byte(os.Getenv("JWT_SECRET")),
	}

	// Configure JWT
	srv.jwt.secret = []byte(os.Getenv("JWT_SECRET"))
	srv.jwt.exp = 24 * time.Hour

	// Initialize database schema
	if err := srv.db.InitSchema(); err != nil {
		log.Fatalf("failed to initialize database schema: %v", err)
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", srv.port),
		Handler:      srv.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}
