package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"github.com/C0d3-5t3w/forFun/cmd/api/helper"
	"github.com/C0d3-5t3w/forFun/cmd/api/message"
	"github.com/C0d3-5t3w/forFun/internal/config"
	"github.com/C0d3-5t3w/forFun/internal/storage"
	"github.com/google/uuid"
)

var chatStore *storage.ChatStore

// InitAPI initializes the chat API
func InitAPI() error {
	// Initialize configuration
	err := config.Load(filepath.Join("pkg", "config", "config.yaml"))
	if err != nil {
		return fmt.Errorf("failed to load configuration: %w", err)
	}

	// Initialize storage
	cfg := config.Get()
	chatStore, err = storage.NewChatStore(cfg.Storage.Path)
	if err != nil {
		return fmt.Errorf("failed to initialize chat storage: %w", err)
	}

	return nil
}

// SetupRoutes sets up the API routes
func SetupRoutes() {
	http.HandleFunc("/api/messages", handleMessages)
}

func handleMessages(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// Handle preflight request
	if r.Method == "OPTIONS" {
		return
	}

	cfg := config.Get()

	switch r.Method {
	case "GET":
		messages := chatStore.GetAllMessages()
		helper.JSONResponse(w, http.StatusOK, messages)

	case "POST":
		// Parse message from request
		var msg struct {
			Content  string `json:"content"`
			Username string `json:"username"`
		}

		if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
			helper.ErrorResponse(w, http.StatusBadRequest, "Invalid request format")
			return
		}

		// Validate message
		if msg.Content == "" {
			helper.ErrorResponse(w, http.StatusBadRequest, "Message content cannot be empty")
			return
		}

		if len(msg.Content) > cfg.Chat.MaxLength {
			helper.ErrorResponse(w, http.StatusBadRequest,
				fmt.Sprintf("Message too long (max %d characters)", cfg.Chat.MaxLength))
			return
		}

		// Set default username if not provided
		if msg.Username == "" {
			msg.Username = "Anonymous"
		}

		// Create and store new message
		newMsg := message.Message{
			ID:        uuid.New().String(),
			Content:   msg.Content,
			Username:  msg.Username,
			Timestamp: time.Now(),
		}

		if err := chatStore.AddMessage(newMsg); err != nil {
			helper.ErrorResponse(w, http.StatusInternalServerError, "Failed to save message")
			return
		}

		helper.JSONResponse(w, http.StatusCreated, newMsg)

	default:
		helper.ErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}
