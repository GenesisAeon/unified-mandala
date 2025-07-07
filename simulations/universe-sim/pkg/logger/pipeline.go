package logger

import (
	"bufio"
	"encoding/json"
	"os"
)

func ProcessJSONL(path string, cb func(map[string]interface{})) error {
	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Bytes()
		var v map[string]interface{}
		if err := json.Unmarshal(line, &v); err == nil {
			cb(v)
		}
	}
	return scanner.Err()
}
