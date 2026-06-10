# PrepForge - Makefile
# Common development tasks for the PrepForge project

.PHONY: help setup ui-install ui-dev ui-build ui-preview ui-clean ui-lint ui-format ui-check

# Default target
help: ## Show this help message
	@echo "PrepForge - Available Commands:"
	@echo ""
	@echo "  \033[1mUI Development:\033[0m"
	@grep -E '^ui-[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "  \033[1mGeneral:\033[0m"
	@grep -E '^[^ui-][a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""

# --- General ---

setup: ui-install ## First-time project setup
	@echo "Setup complete! Run 'make ui-dev' to start the UI dev server."

# --- UI Development ---

ui-install: ## Install UI dependencies
	cd ui && pnpm install

ui-dev: ## Start the UI development server
	cd ui && pnpm dev

ui-build: ## Build the UI for production
	cd ui && pnpm build

ui-preview: ## Preview the UI production build locally
	cd ui && pnpm preview

ui-clean: ## Remove UI build artifacts and node_modules
	cd ui && rm -rf node_modules dist .vite

ui-lint: ## Run TypeScript type checking on UI
	cd ui && pnpm check

ui-format: ## Format UI code with Prettier
	cd ui && pnpm format

ui-check: ## Run all UI checks (types + format)
	cd ui && pnpm check
	@echo "All checks passed!"
