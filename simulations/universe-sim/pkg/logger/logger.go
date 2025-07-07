package logger

import (
	"encoding/json"
	"os"
)

type JSONLLogger struct {
	file *os.File
}

func NewJSONLLogger(path string) (*JSONLLogger, error) {
	f, err := os.OpenFile(path, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		return nil, err
	}
	return &JSONLLogger{file: f}, nil
}

func (l *JSONLLogger) Close() error {
	return l.file.Close()
}

func (l *JSONLLogger) Log(v interface{}) error {
	b, err := json.Marshal(v)
	if err != nil {
		return err
	}
	_, err = l.file.Write(append(b, '\n'))
	return err
}
