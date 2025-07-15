package main

import (
        "context"
        "log"
        "net/http"
        "os"
        "os/signal"
        "syscall"
        "time"

	"github.com/spf13/cobra"
	"github.com/unified-mandala/go-agent/internal/auth"
	"github.com/unified-mandala/go-agent/internal/config"
	"github.com/unified-mandala/go-agent/pkg/metrics"
	"github.com/unified-mandala/go-agent/pkg/scheduler"
)

func main() {
	rootCmd := &cobra.Command{Use: "go-agent"}
	rootCmd.Run = func(cmd *cobra.Command, args []string) {
		run()
	}
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func run() {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	cfg := config.Load()
        vc, err := auth.NewVaultClient(cfg.Vault)
        if err != nil {
                log.Printf("vault: %v", err)
        }
        auth.StartTokenRotation(ctx, vc, 30*time.Minute)
	sched := scheduler.New(cfg.NATSURL, cfg.PollInterval)

	go sched.Start(ctx)

	http.HandleFunc("/healthz/live", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})
	http.HandleFunc("/healthz/ready", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ready"))
	})
	http.Handle("/metrics", metrics.Handler())

	srv := &http.Server{Addr: ":8080"}
	go srv.ListenAndServe()

	<-ctx.Done()
	srv.Shutdown(context.Background())
}
