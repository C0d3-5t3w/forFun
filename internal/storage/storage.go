package storage

import (
	"encoding/json"
	"fmt"
	"os"
	"sync"

	"github.com/C0d3-5t3w/forFun/cmd/api/message"
)

// ChatStore represents the storage for chat messages
type ChatStore struct {
	Messages []message.Message `json:"messages"`
	mu       sync.Mutex
	filePath string
}

// NewChatStore creates a new chat store
func NewChatStore(filePath string) (*ChatStore, error) {
	store := &ChatStore{
		filePath: filePath,
		Messages: []message.Message{},
	}

	// Ensure file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		// Create empty file with initial structure
		err = store.saveToFile()
		if err != nil {
			return nil, fmt.Errorf("failed to create storage file: %w", err)
		}
		return store, nil
	}

	// Load existing data
	err := store.loadFromFile()
	if err != nil {
		return nil, fmt.Errorf("failed to load storage: %w", err)
	}

	return store, nil
}

// AddMessage adds a new message to the store
func (s *ChatStore) AddMessage(msg message.Message) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.Messages = append(s.Messages, msg)

	return s.saveToFile()
}

// GetAllMessages returns all messages from the store
func (s *ChatStore) GetAllMessages() []message.Message {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Create a copy to avoid data race
	messagesCopy := make([]message.Message, len(s.Messages))
	copy(messagesCopy, s.Messages)

	return messagesCopy
}

// loadFromFile loads messages from the storage file
func (s *ChatStore) loadFromFile() error {
	data, err := os.ReadFile(s.filePath)
	if err != nil {
		return err
	}

	return json.Unmarshal(data, s)
}

// saveToFile saves messages to the storage file
func (s *ChatStore) saveToFile() error {
	data, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(s.filePath, data, 0644)
}
