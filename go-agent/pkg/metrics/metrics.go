package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"net/http"
)

var (
	TaskDuration = prometheus.NewHistogram(prometheus.HistogramOpts{
		Name: "agent_task_duration_seconds",
		Help: "Duration of task execution",
	})
	QueueLength = prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "agent_queue_length",
		Help: "Length of the task queue",
	})
)

func init() {
	prometheus.MustRegister(TaskDuration, QueueLength)
}

func RecordTaskDuration(sec float64) {
	TaskDuration.Observe(sec)
}

func SetQueueLength(n int) {
	QueueLength.Set(float64(n))
}

func Handler() http.Handler {
	return promhttp.Handler()
}
