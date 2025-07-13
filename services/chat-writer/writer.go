package chatwriter

import (
	"encoding/json"
	"os"
)

type Message struct {
	ID      string `json:"id"`
	Content string `json:"content"`
	Author  string `json:"author"`
	Time    string `json:"time"`
}

// AppendMessage appends a message to messages.json. If eventHook is non-nil,
// the function calls it with the message after writing.
func AppendMessage(filePath string, msg Message, eventHook func(Message)) error {
	f, err := os.OpenFile(filePath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o644)
	if err != nil {
		return err
	}
	defer f.Close()

	enc := json.NewEncoder(f)
	if err := enc.Encode(&msg); err != nil {
		return err
	}

	if eventHook != nil {
		eventHook(msg)
	}
	return nil
}
