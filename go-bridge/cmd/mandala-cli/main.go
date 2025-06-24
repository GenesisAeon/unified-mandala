package main

import (
	"context"
	"fmt"
	"os"

	"github.com/GenesisAeon/unifiedmandala-go/pkg/client"
	"github.com/spf13/cobra"
)

func main() {
	root := &cobra.Command{
		Use:   "mandala-cli",
		Short: "UnifiedMandala Go CLI",
	}

	root.PersistentFlags().StringP("api", "a", os.Getenv("MANDALA_API_URL"), "Base URL for UnifiedMandala API")
	root.PersistentFlags().StringP("token", "t", os.Getenv("MANDALA_JWT"), "Bearer JWT token")

	root.AddCommand(metaScoresCmd())
	root.AddCommand(crepWatchCmd())

	if err := root.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func metaScoresCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "meta-scores get",
		Short: "Fetch and display MetaScores",
		RunE: func(cmd *cobra.Command, args []string) error {
			apiURL, _ := cmd.Flags().GetString("api")
			token, _ := cmd.Flags().GetString("token")
			ctx := context.Background()
			cli := client.NewRestClient(apiURL, token)
			scores, err := cli.GetMetaScores(ctx)
			if err != nil {
				return err
			}
			for _, s := range scores {
				fmt.Printf("Entry: %s Score: %.2f\n", s.EntryID, s.CombinedScore)
			}
			return nil
		},
	}
	return cmd
}

func crepWatchCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "crep watch",
		Short: "Stream CREP events via NATS",
		RunE: func(cmd *cobra.Command, args []string) error {
			natsURL := os.Getenv("NATS_URL")
			subject := "crep.events"
			return client.SubscribeCREP(natsURL, subject)
		},
	}
	return cmd
}
