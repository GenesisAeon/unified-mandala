.DEFAULT_GOAL := help

help:
@echo "Usage:"
@echo "  make build        # build binary"
@echo "  make test         # run unit tests"
@echo "  make lint         # run linter"
@echo "  make proto        # generate Go from proto"

build:
go build -o bin/mandala-cli ./cmd/mandala-cli.go

test:
go test ./... -cover

lint:
golangci-lint run

proto:
bash scripts/gen-api.sh
