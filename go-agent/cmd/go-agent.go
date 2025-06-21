package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"github.com/spf13/cobra"
	"github.com/unified-mandala/go-agent/internal/config"
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
	sched := scheduler.New(cfg.NATSURL, cfg.PollInterval)

	go sched.Start(ctx)

	<-ctx.Done()
}
