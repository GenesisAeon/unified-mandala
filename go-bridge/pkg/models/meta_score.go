package models

// MetaScore represents a combined score entry
type MetaScore struct {
    EntryID       string             `json:"entryId"`
    CombinedScore float64            `json:"combinedScore"`
    Breakdown     map[string]float64 `json:"breakdown"`
    Conflicts     []string           `json:"conflicts"`
}
