package server

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func (s *Server) authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		// Extract the token from the Authorization header
		// Format: "Bearer <token>"
		bearerToken := strings.Split(authHeader, " ")
		if len(bearerToken) != 2 || bearerToken[0] != "Bearer" {
			http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		// Parse and validate the JWT token
		token, err := jwt.Parse(bearerToken[1], func(token *jwt.Token) (interface{}, error) {
			// Validate the signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return s.jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Extract claims and add developer ID to context
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if developerID, ok := claims["sub"].(string); ok {
				ctx := context.WithValue(r.Context(), "developerID", developerID)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}
		}

		http.Error(w, "Invalid token claims", http.StatusUnauthorized)
	})
}

func (s *Server) apiKeyAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		publicKey := r.Header.Get("X-Public-Key")
		signature := r.Header.Get("X-Signature")
		timestamp := r.Header.Get("X-Timestamp")

		if publicKey == "" || signature == "" || timestamp == "" {
			http.Error(w, "Missing authentication headers", http.StatusUnauthorized)
			return
		}

		// Get application by public key
		app, err := s.db.GetApplicationByPublicKey(publicKey)
		if err != nil || app == nil {
			http.Error(w, "Invalid public key", http.StatusUnauthorized)
			return
		}

		// Verify signature
		// payload = timestamp + method + path + body
		body, _ := io.ReadAll(r.Body)
		r.Body = io.NopCloser(bytes.NewBuffer(body))

		payload := timestamp + r.Method + r.URL.Path + string(body)
		expectedSignature := generateHMAC(payload, app.SecretKey)

		if !hmac.Equal([]byte(signature), []byte(expectedSignature)) {
			http.Error(w, "Invalid signature", http.StatusUnauthorized)
			return
		}

		// Add application to context
		ctx := context.WithValue(r.Context(), "application", app)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func generateHMAC(payload, secret string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(payload))
	return hex.EncodeToString(h.Sum(nil))
}

func (s *Server) corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*") // In production, specify exact origins
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Public-Key, X-Timestamp, X-Signature")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
