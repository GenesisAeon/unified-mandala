.DEFAULT_GOAL := help

help:
    @echo "Usage:"
    @echo "  make build       # build binary"
    @echo "  make test        # run unit tests"
    @echo "  make lint        # run golangci-lint"

build:
    go build -o bin/go-agent ./cmd/go-agent.go

test:
    go test ./...

lint:
    golangci-lint run
