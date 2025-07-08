package test

import (
	"context"
	"encoding/json"
	"net/http/httptest"
	"testing"

	simpb "github.com/GenesisAeon/unified-mandala/universe-sim/api"
	"github.com/GenesisAeon/unified-mandala/universe-sim/pkg/core"
	"github.com/GenesisAeon/unified-mandala/universe-sim/pkg/federation"
)

func TestRESTStateEndpoint(t *testing.T) {
	st := core.NewState(1)
	srv := federation.NewServer(st)
	rr := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/state", nil)
	srv.RESTHandler().ServeHTTP(rr, req)
	var out core.State
	if err := json.Unmarshal(rr.Body.Bytes(), &out); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if len(out.Entities) != 1 {
		t.Fatalf("unexpected entities: %v", out.Entities)
	}
}

func TestGRPCGetState(t *testing.T) {
	st := core.NewState(1)
	srv := federation.NewServer(st)
	ctx := context.Background()
	pb, err := srv.GetState(ctx, &simpb.Empty{})
	if err != nil {
		t.Fatalf("grpc error: %v", err)
	}
	if len(pb.Entities) != 1 {
		t.Fatalf("unexpected entities: %v", pb.Entities)
	}
}
