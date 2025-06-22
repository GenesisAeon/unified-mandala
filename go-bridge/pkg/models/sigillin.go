package models

// Sigillin repräsentiert ein Sigillin-Objekt aus UnifiedMandala.
type Sigillin struct {
    ID      string `json:"id"`
    Content string `json:"content"`
    Status  string `json:"status"`
}
