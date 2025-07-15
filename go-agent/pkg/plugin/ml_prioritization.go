package plugin

type Task struct {
    ID     string
    Features []float64
}

type ScoredTask struct {
    Task
    Score float64
}

// PrioritizeTasks sorts tasks by descending score using a placeholder ML model.
// In a real implementation this would call a LightGBM/XGBoost service.
func PrioritizeTasks(tasks []Task, weights []float64) []ScoredTask {
    scored := make([]ScoredTask, len(tasks))
    for i, t := range tasks {
        var s float64
        for j, f := range t.Features {
            if j < len(weights) {
                s += f * weights[j]
            }
        }
        scored[i] = ScoredTask{Task: t, Score: s}
    }
    // simple bubble sort for few tasks
    for i := 0; i < len(scored)-1; i++ {
        for j := 0; j < len(scored)-i-1; j++ {
            if scored[j].Score < scored[j+1].Score {
                scored[j], scored[j+1] = scored[j+1], scored[j]
            }
        }
    }
    return scored
}
