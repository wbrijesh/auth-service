package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

type Service interface {
	Health() map[string]string
	Close() error
	InitSchema() error
	CreateDeveloper(dev *Developer) error
	GetDeveloperByEmail(email string) (*Developer, error)
}

type Developer struct {
	ID           string    `json:"id"`
	FirstName    string    `json:"firstName"`
	LastName     string    `json:"lastName"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"createdAt"`
}

type service struct {
	db *sql.DB
}

var (
	dburl      string
	dbInstance *service
)

func init() {
	dburl = fmt.Sprintf("%s?authToken=%s",
		os.Getenv("TURSO_DATABASE_URL"),
		os.Getenv("TURSO_AUTH_TOKEN"))
}

func New() Service {
	if dbInstance != nil {
		return dbInstance
	}

	db, err := sql.Open("libsql", dburl)
	if err != nil {
		log.Fatalf("failed to open db %s: %s", dburl, err)
	}

	dbInstance = &service{
		db: db,
	}
	return dbInstance
}

func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	stats := make(map[string]string)

	err := s.db.PingContext(ctx)
	if err != nil {
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("db down: %v", err)
		return stats
	}

	stats["status"] = "up"
	stats["message"] = "Connected to Turso database"

	// Get database stats
	dbStats := s.db.Stats()
	stats["open_connections"] = strconv.Itoa(dbStats.OpenConnections)
	stats["in_use"] = strconv.Itoa(dbStats.InUse)
	stats["idle"] = strconv.Itoa(dbStats.Idle)

	return stats
}

func (s *service) Close() error {
	log.Printf("Disconnecting from Turso database")
	return s.db.Close()
}

func (s *service) CreateDeveloper(dev *Developer) error {
	_, err := s.db.Exec(
		`INSERT INTO developers (id, first_name, last_name, email, password_hash) 
		 VALUES (?, ?, ?, ?, ?)`,
		dev.ID, dev.FirstName, dev.LastName, dev.Email, dev.PasswordHash)
	return err
}

func (s *service) GetDeveloperByEmail(email string) (*Developer, error) {
	dev := &Developer{}
	err := s.db.QueryRow(
		`SELECT id, first_name, last_name, email, password_hash, created_at 
		 FROM developers WHERE email = ?`, email).
		Scan(&dev.ID, &dev.FirstName, &dev.LastName, &dev.Email, &dev.PasswordHash, &dev.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return dev, err
}
