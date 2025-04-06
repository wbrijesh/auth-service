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
	CreateApplication(app *Application) error
	GetApplicationsByDeveloperID(developerID string) ([]Application, error)
	UpdateApplication(app *Application) error
	DeleteApplication(id string, developerID string) error
	GetApplicationByID(id string, developerID string) (*Application, error)
}

type Developer struct {
	ID           string    `json:"id"`
	FirstName    string    `json:"firstName"`
	LastName     string    `json:"lastName"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"createdAt"`
}

type Application struct {
	ID          string    `json:"id"`
	DeveloperID string    `json:"developerId"`
	Name        string    `json:"name"`
	Domain      string    `json:"domain"`
	PublicKey   string    `json:"publicKey"`
	SecretKey   string    `json:"secretKey"`
	CreatedAt   time.Time `json:"createdAt"`
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

func (s *service) CreateApplication(app *Application) error {
	_, err := s.db.Exec(
		`INSERT INTO applications (id, developer_id, name, domain, public_key, secret_key) 
		 VALUES (?, ?, ?, ?, ?, ?)`,
		app.ID, app.DeveloperID, app.Name, app.Domain, app.PublicKey, app.SecretKey)
	return err
}

func (s *service) GetApplicationsByDeveloperID(developerID string) ([]Application, error) {
	rows, err := s.db.Query(
		`SELECT id, developer_id, name, domain, public_key, secret_key, created_at 
		 FROM applications WHERE developer_id = ?`, developerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var apps []Application
	for rows.Next() {
		var app Application
		err := rows.Scan(
			&app.ID, &app.DeveloperID, &app.Name, &app.Domain,
			&app.PublicKey, &app.SecretKey, &app.CreatedAt)
		if err != nil {
			return nil, err
		}
		apps = append(apps, app)
	}
	return apps, rows.Err()
}

func (s *service) GetApplicationByID(id string, developerID string) (*Application, error) {
	var app Application
	err := s.db.QueryRow(
		`SELECT id, developer_id, name, domain, public_key, secret_key, created_at 
		 FROM applications 
		 WHERE id = ? AND developer_id = ?`,
		id, developerID).
		Scan(&app.ID, &app.DeveloperID, &app.Name, &app.Domain, &app.PublicKey, &app.SecretKey, &app.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &app, nil
}

func (s *service) UpdateApplication(app *Application) error {
	result, err := s.db.Exec(
		`UPDATE applications SET name = ?, domain = ? 
		 WHERE id = ? AND developer_id = ?`,
		app.Name, app.Domain, app.ID, app.DeveloperID)
	if err != nil {
		return err
	}
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (s *service) DeleteApplication(id string, developerID string) error {
	result, err := s.db.Exec(
		"DELETE FROM applications WHERE id = ? AND developer_id = ?",
		id, developerID)
	if err != nil {
		return err
	}
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}
