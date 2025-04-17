package message

import (
	"encoding/json"
	"time"
)

type Message struct {
	ID        string    `json:"id"`
	Content   string    `json:"content"`
	Username  string    `json:"username"`
	Timestamp time.Time `json:"timestamp"`
}

func NewMessage(id, content, username string) Message {
	return Message{
		ID:        id,
		Content:   content,
		Username:  username,
		Timestamp: time.Now(),
	}
}

func (m Message) ToJSON() ([]byte, error) {
	return json.Marshal(m)
}

func FromJSON(data []byte) (Message, error) {
	var m Message
	err := json.Unmarshal(data, &m)
	return m, err
}
