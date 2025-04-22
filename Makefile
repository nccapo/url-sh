include .env

# Migration variables
MIGRATION_DIR ?= internal/db/migration
MIGRATION_NAME ?= migration
MIGRATION_STEPS ?= 1

## build: Build binary
build:
	@echo "Building..."
	env CGO_ENABLED=0  go build -ldflags="-s -w" -o ./bin/${BINARY_NAME} ./cmd/url-shortener
	@echo "Built!"

## run: builds and runs the application
run: build
	@echo "Starting..."
	@env APP_API_URL=${APP_API_URL} DB_ADDRESS=${DB_ADDRESS} APP_ADDR=${APP_ADDR} ./bin/${BINARY_NAME} &
	@echo "Started!"

##run-dev: run in tde movde
run-dev:
	@echo "Starting..."
	@ APP_API_URL=${APP_API_URL} DB_ADDRESS=${DB_ADDRESS} APP_ADDR=${APP_ADDR} air
	@echo "Started"

## clean: runs go clean and deletes binaries
clean:
	@echo "Cleaning..."
	@go clean
	@rm ${BINARY_NAME}
	@echo "Cleaned!"

## start: an alias to run
start: run

## stop: stops the running application
stop:
	@echo "Stopping..."
	@-pkill -SIGTERM -f "./${BINARY_NAME}"
	@echo "Stopped!"

## restart: stops and starts the application
restart: stop start

## test: runs all tests
test:
	go test -v ./...

## install: installs the all necessary dependency
install:
	@echo "Install dependencies..."
	@go mod tidy || (echo "Failed to run 'go mod tidy'"; exit 1)

## migration: create a new migration file
## Usage: make migration name=create_users_table
migration:
	@if [ "$(name)" = "" ]; then \
		echo "Error: Migration name is required. Usage: make migration name=create_users_table"; \
		exit 1; \
	fi
	@echo "Creating Migration file: $(name)..."
	migrate create -ext sql -dir ${MIGRATION_DIR} -seq $(name)
	@echo "Migration files created. Please edit the up and down SQL files in ${MIGRATION_DIR}"

## migrate_up: migrate up all pending migrations
## Usage: make migrate_up [steps=N] [force=true]
migrate_up:
	@echo "Migrating up the database..."
	@if [ "$(force)" = "true" ]; then \
		migrate -path ${MIGRATION_DIR} -database "${DB_ADDRESS}" -verbose force $(version); \
	else \
		migrate -path ${MIGRATION_DIR} -database "${DB_ADDRESS}" -verbose up $(if $(steps),$(steps),); \
	fi

## migrate_down: migrate down the database
## Usage: make migrate_down [steps=N] [force=true]
migrate_down:
	@echo "Migrating down the database..."
	@if [ "$(force)" = "true" ]; then \
		migrate -path ${MIGRATION_DIR} -database "${DB_ADDRESS}" -verbose force $(version); \
	else \
		migrate -path ${MIGRATION_DIR} -database "${DB_ADDRESS}" -verbose down $(if $(steps),$(steps),); \
	fi

## migrate_status: check migration status
migrate_status:
	@echo "Checking migration status..."
	migrate -path ${MIGRATION_DIR} -database "${DB_ADDRESS}" -verbose version

## migrate_create: create a new migration with timestamp
## Usage: make migrate_create name=create_users_table
migrate_create:
	@if [ "$(name)" = "" ]; then \
		echo "Error: Migration name is required. Usage: make migrate_create name=create_users_table"; \
		exit 1; \
	fi
	@echo "Creating Migration file: $(name)..."
	migrate create -ext sql -dir ${MIGRATION_DIR} -seq $(name)
	@echo "Migration files created. Please edit the up and down SQL files in ${MIGRATION_DIR}"

## seed: seeding database
seed:
	@echo "Seeding db"
	@env DB_ADDRESS=${DB_ADDRESS} APP_ADDR=${APP_ADDR} go run ./cmd/migrate/seed/main.go
	@echo "Seeding finished"

## generate docs
gen-docs:
	@echo "generating docs"
	@swag init  --parseDependency --parseInternal -g ./url-shortener/main.go -d cmd,internal && swag fmt
	@echo "doc generated"

## migrate_fix: fix dirty database by forcing a specific version
## Usage: make migrate_fix version=0
migrate_fix:
	@if [ "$(version)" = "" ]; then \
		echo "Error: Version is required. Usage: make migrate_fix version=0"; \
		exit 1; \
	fi
	@echo "Fixing dirty database by forcing version $(version)..."
	@if [ "$(version)" = "0" ]; then \
		echo "Note: Forcing to version 0 means no migrations are applied."; \
		echo "This is useful when you want to start fresh with migrations."; \
	fi
	migrate -path ${MIGRATION_DIR} -database "${DB_ADDRESS}" force $(version)
	@echo "Database fixed. You can now run migrations again."

## migrate_reset: reset database by applying all down migrations and then up migrations
migrate_reset:
	@echo "Resetting database..."
	@echo "Step 1: Forcing database to version 0..."
	migrate -path ${MIGRATION_DIR} -database "${DB_ADDRESS}" force 0
	@echo "Step 2: Applying all migrations..."
	migrate -path ${MIGRATION_DIR} -database "${DB_ADDRESS}" up
	@echo "Database reset complete."

# Help target
help:
	@echo "Available commands:"
	@echo "  make migration name=<migration_name>    - Create a new migration file"
	@echo "  make migrate_up [steps=N] [force=true]  - Run pending migrations"
	@echo "  make migrate_down [steps=N] [force=true] - Rollback migrations"
	@echo "  make migrate_status                     - Check migration status"
	@echo "  make migrate_create name=<name>         - Create a new migration with timestamp"
	@echo "  make migrate_fix version=<version>      - Fix dirty database by forcing a specific version"
	@echo "  make migrate_reset                      - Reset database by applying all down and up migrations"
	@echo ""
	@echo "Examples:"
	@echo "  make migration name=create_users_table"
	@echo "  make migrate_up steps=2"
	@echo "  make migrate_down force=true version=2"
	@echo "  make migrate_status"
	@echo "  make migrate_create name=add_user_role"
	@echo "  make migrate_fix version=0"
	@echo "  make migrate_reset"

.PHONY: build run run-dev clean start stop restart test install migration migrate_up migrate_down migrate_status migrate_create migrate_fix migrate_reset seed gen-docs help
