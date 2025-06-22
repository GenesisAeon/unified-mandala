package api

import (
    "google.golang.org/grpc"

    "github.com/GenesisAeon/unifiedmandala-go/api/proto"
)

// NewMetaScoreClient stellt einen gRPC-Client für den MetaScore-Service bereit.
func NewMetaScoreClient(addr string) (proto.MetaScoreServiceClient, *grpc.ClientConn, error) {
    conn, err := grpc.Dial(addr, grpc.WithInsecure())
    if err != nil {
        return nil, nil, err
    }
    client := proto.NewMetaScoreServiceClient(conn)
    return client, conn, nil
}
