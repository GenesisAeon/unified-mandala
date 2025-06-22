package api

import (
    "encoding/json"
    "net/http"

    "github.com/GenesisAeon/unifiedmandala-go/pkg/models"
)

// GetMetaScores ruft MetaScores über die REST-API ab.
func GetMetaScores(apiURL string) ([]models.MetaScore, error) {
    resp, err := http.Get(apiURL + "/api/meta-scores")
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    var scores []models.MetaScore
    err = json.NewDecoder(resp.Body).Decode(&scores)
    return scores, err
}
