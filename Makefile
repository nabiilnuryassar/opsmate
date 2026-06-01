.DEFAULT_GOAL := help
COMPOSE := docker compose

.PHONY: help up down restart logs ps build \
        dev-frontend build-frontend test-frontend \
        artisan migrate fresh seed test-backend tinker boost-update

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-18s %s\n", $$1, $$2}'

## ---- Infra (Docker) ----
up: ## Start postgres, redis, backend, queue worker
	$(COMPOSE) up -d

down: ## Stop the stack
	$(COMPOSE) down

restart: ## Restart the stack
	$(COMPOSE) restart

build: ## Rebuild the backend image
	$(COMPOSE) build backend

logs: ## Tail backend logs
	$(COMPOSE) logs -f backend

ps: ## Show container status
	$(COMPOSE) ps

## ---- Backend (runs in the backend container) ----
artisan: ## Run an arbitrary artisan command: make artisan c="route:list"
	$(COMPOSE) exec backend php artisan $(c)

migrate: ## Run database migrations
	$(COMPOSE) exec backend php artisan migrate

fresh: ## Drop all tables, re-migrate and seed
	$(COMPOSE) exec backend php artisan migrate:fresh --seed

seed: ## Seed the database
	$(COMPOSE) exec backend php artisan db:seed

test-backend: ## Run the backend test suite
	$(COMPOSE) exec backend php artisan test

tinker: ## Open a tinker shell
	$(COMPOSE) exec backend php artisan tinker

boost-update: ## Refresh Laravel Boost guidelines/skills
	$(COMPOSE) exec backend php artisan boost:update

## ---- Frontend (runs natively via Node) ----
dev-frontend: ## Start the Vite dev server
	cd frontend && npm run dev

build-frontend: ## Build the frontend for production
	cd frontend && npm run build

test-frontend: ## Run the frontend test suite
	cd frontend && npm run test
