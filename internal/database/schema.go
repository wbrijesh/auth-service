package database

const schema = `
CREATE TABLE IF NOT EXISTS developers (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`

func (s *service) InitSchema() error {
	_, err := s.db.Exec(schema)
	return err
}
