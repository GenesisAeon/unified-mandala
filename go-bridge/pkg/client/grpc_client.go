//go:generate protoc --go_out=../../api/proto --go-grpc_out=../../api/proto api/proto/meta.proto
package client

import (
    "context"
    "fmt"

    "google.golang.org/grpc"
    "github.com/GenesisAeon/unifiedmandala-go/api/proto"
)

// NewGRPCConnection dials the gRPC endpoint
func NewGRPCConnection(addr string) (*grpc.ClientConn, error) {
    return grpc.Dial(addr, grpc.WithInsecure())
}

// MetaScoreServiceClient returns a typed client
func MetaScoreServiceClient(conn *grpc.ClientConn) proto.MetaScoreServiceClient {
    return proto.NewMetaScoreServiceClient(conn)
}

// Example request using the client
func FetchMetaScoresGRPC(ctx context.Context, conn *grpc.ClientConn) ([]*proto.MetaScore, error) {
    c := proto.NewMetaScoreServiceClient(conn)
    resp, err := c.ListMetaScores(ctx, &proto.MetaScoreRequest{})
    if err != nil {
        return nil, fmt.Errorf("list: %w", err)
    }
    return resp.Scores, nil
}
