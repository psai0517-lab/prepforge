# PrepForge UI Guide - Makefile
# Simplifies common development tasks

.PHONY: help install dev build preview clean lint format check

# Default target
help: ## Show this help message
	@echo "PrepForge UI Guide - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""

install: ## Install all dependencies
	pnpm install

dev: ## Start the development server
	pnpm dev

build: ## Build for production
	pnpm build

preview: ## Preview the production build locally
	pnpm preview

clean: ## Remove build artifacts and node_modules
	rm -rf node_modules dist .vite

lint: ## Run TypeScript type checking
	pnpm check

format: ## Format code with Prettier
	pnpm format

check: ## Run all checks (types + format)
	pnpm check
	@echo "All checks passed!"

setup: install ## First-time setup (install deps)
	@echo "Setup complete! Run 'make dev' to start developing."
