package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"path/filepath"

	"github.com/C0d3-5t3w/forFun/cmd/api/helper"
	"github.com/C0d3-5t3w/forFun/cmd/api/message"
	"github.com/C0d3-5t3w/forFun/internal/config"
	"github.com/C0d3-5t3w/forFun/internal/storage"
	"github.com/google/uuid"
)

var chatStore *storage.ChatStore

func InitAPI() error {

	err := config.Load(filepath.Join("pkg", "config", "config.yaml"))
	if err != nil {
		return fmt.Errorf("failed to load configuration: %w", err)
	}

	cfg := config.Get()
	chatStore, err = storage.NewChatStore(cfg.Storage.Path)
	if err != nil {
		return fmt.Errorf("failed to initialize chat storage: %w", err)
	}

	return nil
}

func SetupRoutes() {
	http.HandleFunc("/api/messages", handleMessages)
}

func handleMessages(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Cache-Control")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	cfg := config.Get()

	switch r.Method {
	case "GET":
		messages := chatStore.GetAllMessages()
		if err := helper.JSONResponse(w, http.StatusOK, messages); err != nil {
			log.Printf("Error sending JSON response: %v", err)
		}

	case "POST":

		var msg struct {
			Content  string `json:"content"`
			Username string `json:"username"`
		}

		if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
			log.Printf("Error decoding request: %v", err)
			helper.ErrorResponse(w, http.StatusBadRequest, "Invalid request format")
			return
		}

		if msg.Content == "" {
			helper.ErrorResponse(w, http.StatusBadRequest, "Message content cannot be empty")
			return
		}

		if len(msg.Content) > cfg.Chat.MaxLength {
			helper.ErrorResponse(w, http.StatusBadRequest,
				fmt.Sprintf("Message too long (max %d characters)", cfg.Chat.MaxLength))
			return
		}

		if msg.Username == "" {
			msg.Username = "Anonymous"
		}

		newMsg := message.NewMessage(
			uuid.New().String(),
			msg.Content,
			msg.Username,
		)

		if err := chatStore.AddMessage(newMsg); err != nil {
			log.Printf("Error saving message: %v", err)
			helper.ErrorResponse(w, http.StatusInternalServerError, "Failed to save message")
			return
		}

		if err := helper.JSONResponse(w, http.StatusCreated, newMsg); err != nil {
			log.Printf("Error sending JSON response: %v", err)
		}

	default:
		helper.ErrorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}
