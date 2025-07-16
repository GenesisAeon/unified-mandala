package plugin

import (
    "bytes"
    "encoding/json"
    "net/http"
)

// MLServiceURL is the endpoint of the ML prioritization service.
var MLServiceURL = "http://localhost:9000"

// TaskInput represents a task for prioritization.
type TaskInput struct {
    ID    string `json:"id"`
    Score float64 `json:"score"`
}

// RankTasks returns tasks ordered by priority using the ML service.
func RankTasks(tasks []TaskInput) ([]TaskInput, error) {
    body, err := json.Marshal(tasks)
    if err != nil {
        return nil, err
    }
    resp, err := http.Post(MLServiceURL+"/rank", "application/json", bytes.NewReader(body))
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    var out []TaskInput
    if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
        return nil, err
    }
    return out, nil
}
