package message

import (
	"encoding/json"
	"time"
)

// Message represents a chat message
type Message struct {
	ID        string    `json:"id"`
	Content   string    `json:"content"`
	Username  string    `json:"username"`
	Timestamp time.Time `json:"timestamp"`
}

// NewMessage creates a new chat message
func NewMessage(id, content, username string) Message {
	return Message{
		ID:        id,
		Content:   content,
		Username:  username,
		Timestamp: time.Now(),
	}
}

// ToJSON converts a message to JSON format
func (m Message) ToJSON() ([]byte, error) {
	return json.Marshal(m)
}

// FromJSON creates a message from JSON data
func FromJSON(data []byte) (Message, error) {
	var m Message
	err := json.Unmarshal(data, &m)
	return m, err
}
