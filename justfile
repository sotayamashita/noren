# Task runner for the showcase template. `just` lists all recipes.
set shell := ["bash", "-euo", "pipefail", "-c"]

# List recipes
default:
    @just --list

# Install dependencies and git hooks
setup:
    pnpm install
    just install-hooks

# Start the dev server
dev:
    pnpm exec next dev

# Production build
build:
    pnpm exec next build

# Start the prd server
start:
    pnpm exec next start

# Type-check without emitting
typecheck:
    pnpm exec tsc --noEmit

# Lint + format check (Ultracite: oxlint + oxfmt)
check:
    pnpm exec ultracite check

# Auto-fix lint + format issues
fix:
    pnpm exec ultracite fix

# Validate the demo timeline (order, duration, cursor targets)
check-demo:
    node tools/demo/check-scene.ts

# Install hk Git hooks using the mise environment
install-hooks:
  mise exec -- hk install --mise
