package client

import (
	"context"
	"net"
	"testing"

	"google.golang.org/grpc"
)

type testSvc struct{}

func TestNewGRPCConnection(t *testing.T) {
	lis, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	s := grpc.NewServer()
	go s.Serve(lis)
	defer s.Stop()

	conn, err := NewGRPCConnection(lis.Addr().String())
	if err != nil {
		t.Fatalf("connect: %v", err)
	}
	conn.Close()
}

func TestFetchMetaScoresGRPCError(t *testing.T) {
	ctx := context.Background()
	conn, err := grpc.DialContext(ctx, "127.0.0.1:1", grpc.WithInsecure())
	if err == nil {
		defer conn.Close()
	}
	_, err = FetchMetaScoresGRPC(ctx, conn)
	if err == nil {
		t.Fatal("expected error")
	}
}
