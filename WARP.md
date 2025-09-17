# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Gatishakti** is a QR code vendor scanning application with a monorepo structure containing three main components:

- **app/**: Mobile application component (currently contains only README)
- **server/**: Backend server component (minimal setup with pnpm package manager)
- **web/**: Next.js frontend application (primary development focus)

The project appears to be in early development with the web component being the most developed.

## Architecture

### Multi-Component Structure
This is a monorepo with three distinct components that will likely communicate:
- Mobile app for QR code scanning
- Web interface for vendor management/display
- Backend server for data processing and API endpoints

### Web Application (Primary Focus)
- **Framework**: Next.js 15.5.3 with App Router
- **Styling**: Tailwind CSS v4 with custom PostCSS configuration
- **Language**: TypeScript with strict configuration
- **Fonts**: Geist font family (Sans & Mono) from Google Fonts
- **Development**: Uses Turbopack for faster builds

### Technical Stack
- **React**: Version 19.1.0 (latest)
- **Package Manager**: pnpm (specified in server packageManager field)
- **Linting**: ESLint with Next.js and TypeScript configurations
- **Build Tool**: Next.js with Turbopack support

## Development Commands

### Web Application (Primary Development)
Navigate to the `web/` directory for all web-related commands:

```bash
# Development server with Turbopack
pnpm dev

# Production build with Turbopack
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint
```

### Server Component
Navigate to the `server/` directory:

```bash
# Currently no specific commands defined
# Package.json indicates pnpm as package manager
pnpm install  # For dependencies when added
```

### App Component
The mobile app component is currently minimal - only contains a README describing the QR scanning functionality.

## Key Configuration Files

- **web/tsconfig.json**: TypeScript configuration with path mapping (`@/*` → `./src/*`)
- **web/next.config.ts**: Next.js configuration (currently minimal)
- **web/eslint.config.mjs**: ESLint flat config with Next.js rules
- **web/postcss.config.mjs**: PostCSS configuration for Tailwind CSS v4

## Project Structure Patterns

### Web Application Structure
```
web/
├── src/app/           # Next.js App Router pages and layouts
│   ├── layout.tsx     # Root layout with font configuration
│   ├── page.tsx       # Home page component
│   └── globals.css    # Global styles with Tailwind and custom variables
├── public/            # Static assets (SVG icons)
└── [config files]     # TypeScript, ESLint, Next.js configurations
```

### Development Workflow
1. Primary development occurs in the `web/` directory
2. The application uses modern React patterns (React 19, Next.js App Router)
3. Styling follows Tailwind CSS v4 patterns with custom CSS variables
4. TypeScript is configured with strict mode and path aliases

## Important Notes

- The project uses **pnpm** as the package manager (explicitly defined in server/package.json)
- Next.js is configured to use **Turbopack** for both development and build processes
- The web application is set up with dark/light mode support via CSS custom properties
- ESLint configuration uses the new flat config format
- Tailwind CSS v4 is used with the new `@import "tailwindcss"` syntax

## Current State

The repository appears to be in early development:
- Web application has a complete Next.js setup with default content
- Server component has minimal configuration
- Mobile app component exists but contains only documentation

When working with this codebase, focus development efforts on the `web/` directory where the main application logic will reside.