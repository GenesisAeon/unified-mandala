package federation

import (
	"context"
	"encoding/json"
	"net"
	"net/http"

	simpb "github.com/GenesisAeon/unified-mandala/universe-sim/api"
	core "github.com/GenesisAeon/unified-mandala/universe-sim/pkg/core"
	"google.golang.org/grpc"
)

// Server implements both gRPC and REST handlers for universe-sim

type Server struct {
	simpb.UnimplementedUniverseSimServer
	State *core.State
}

// NewServer creates a new Server with the provided state
func NewServer(state *core.State) *Server {
	return &Server{State: state}
}

// GetState returns the current simulation state (gRPC)
func (s *Server) GetState(ctx context.Context, _ *simpb.Empty) (*simpb.State, error) {
	pb := toProtoState(s.State)
	return pb, nil
}

func toProtoState(s *core.State) *simpb.State {
	pb := &simpb.State{Entities: make([]*simpb.Entity, len(s.Entities))}
	for i, e := range s.Entities {
		pb.Entities[i] = &simpb.Entity{
			Position: &simpb.Vector{X: e.Position.X, Y: e.Position.Y},
			Velocity: &simpb.Vector{X: e.Velocity.X, Y: e.Velocity.Y},
		}
	}
	return pb
}

// RESTHandler returns an http.Handler serving JSON state at /state
func (s *Server) RESTHandler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/state", func(w http.ResponseWriter, r *http.Request) {
		_ = json.NewEncoder(w).Encode(s.State)
	})
	return mux
}

// ListenAndServeREST starts the REST server on the given address
func (s *Server) ListenAndServeREST(addr string) error {
	return http.ListenAndServe(addr, s.RESTHandler())
}

// ListenAndServeGRPC starts a gRPC server on the given address
func (s *Server) ListenAndServeGRPC(addr string) (net.Listener, *grpc.Server, error) {
	lis, err := net.Listen("tcp", addr)
	if err != nil {
		return nil, nil, err
	}
	gs := grpc.NewServer()
	simpb.RegisterUniverseSimServer(gs, s)
	go gs.Serve(lis)
	return lis, gs, nil
}
