package storage

import (
	"encoding/json"
	"fmt"
	"os"
	"sync"

	"github.com/C0d3-5t3w/forFun/cmd/api/message"
)

type ChatStore struct {
	Messages []message.Message `json:"messages"`
	mu       sync.Mutex
	filePath string
}

func NewChatStore(filePath string) (*ChatStore, error) {
	store := &ChatStore{
		filePath: filePath,
		Messages: []message.Message{},
	}

	if _, err := os.Stat(filePath); os.IsNotExist(err) {

		err = store.saveToFile()
		if err != nil {
			return nil, fmt.Errorf("failed to create storage file: %w", err)
		}
		return store, nil
	}

	err := store.loadFromFile()
	if err != nil {
		return nil, fmt.Errorf("failed to load storage: %w", err)
	}

	return store, nil
}

func (s *ChatStore) AddMessage(msg message.Message) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.Messages = append(s.Messages, msg)

	return s.saveToFile()
}

func (s *ChatStore) GetAllMessages() []message.Message {
	s.mu.Lock()
	defer s.mu.Unlock()

	messagesCopy := make([]message.Message, len(s.Messages))
	copy(messagesCopy, s.Messages)

	return messagesCopy
}

func (s *ChatStore) loadFromFile() error {
	data, err := os.ReadFile(s.filePath)
	if err != nil {
		return err
	}

	return json.Unmarshal(data, s)
}

func (s *ChatStore) saveToFile() error {
	data, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(s.filePath, data, 0644)
}
