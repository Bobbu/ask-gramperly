# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AskGramperly is an Angular 19 web application with AWS CDK infrastructure-as-code for deployment to S3. The application is a humorous single-page app that simulates asking "Gramperly" questions with random loading animations and messages. The application uses standalone components (no NgModules).

## Development Commands

### Angular Application

- **Start dev server**: `npm start` or `ng serve` (runs on http://localhost:4200/)
- **Build for production**: `ng build` (outputs to `dist/ask-gramperly/`)
  - Note: The `--prod` flag is deprecated in Angular 12+, production is now the default
- **Build for development**: `ng build --configuration development` or `npm run build`
- **Watch mode**: `npm run watch` (rebuilds on file changes)
- **Run tests**: `npm test` or `ng test` (runs Karma tests)
- **Lint code**: `ng lint` (runs ESLint)

### AWS CDK Deployment

All CDK commands must be run from the `aws-cdk/` directory.

- **Build CDK**: `cd aws-cdk && npm run build` (compiles TypeScript to JavaScript)
- **Deploy infrastructure and application**: `cd aws-cdk && npm run cdkdeploy`
  - This runs the full deployment pipeline:
    1. Builds CDK TypeScript code
    2. Builds Angular app in production mode (`ng build`)
    3. Deploys infrastructure and uploads assets to S3 via `cdk deploy`
- **Synthesize CloudFormation**: `cd aws-cdk && cdk synth`
- **View diff**: `cd aws-cdk && cdk diff`
- **Destroy stack**: `cd aws-cdk && cdk destroy` (removes all infrastructure)

## Architecture

### Frontend Structure

- **Main component**: `src/app/ask-gramperly/ask-gramperly.component.ts`
  - Single interactive component that handles question input
  - Uses `ngx-spinner` v18 for loading animations
  - Displays random loading messages and GIFs during simulated processing
  - Currently a mock implementation (doesn't actually search, just shows random delays)
  - **Standalone component** using `inject()` function for dependency injection

- **App structure**: Modern standalone architecture
  - `main.ts` - Uses `bootstrapApplication()` instead of module bootstrap
  - `app.config.ts` - Application configuration with providers
  - No NgModules - all components are standalone

- **Routing**: Routes configured in `app.config.ts` using `provideRouter()`
- **Styling**: SCSS-based styling (`styles.scss`, component-specific SCSS files)

### Infrastructure (AWS CDK)

Located in `aws-cdk/` directory with separate package.json and dependencies.

- **CDK Version**: v2.176.0 (modern consolidated package)
- **Main stack**: `CdkStack.ts` - Defines the CDK app and instantiates the website deployment
- **Website deployment**: `AskGramperlyWebSite.ts` - Creates and configures:
  - S3 bucket (`askgramperly.com`) with website hosting enabled
  - Bucket policy for public read access (modern approach)
  - Automatic deployment of `dist/ask-gramperly/` contents to S3
  - Uses `index.html` for both index and error documents (SPA routing)
  - Auto-delete objects enabled for easier stack cleanup
  - **Note**: Removal policy is set to DESTROY (not production-safe)

### Configuration

- **TypeScript**: Version 5.8.3 (both Angular and CDK)
- **Angular**: Version 19.2.15
- **Angular CDK**: Version 19.x
- **AWS CDK**: Version 2.176.0 (modern consolidated package)
- **Linting**: ESLint (@angular-eslint v20.6.0)
- **Build output**: `dist/ask-gramperly/` (used by CDK for S3 deployment)
- **Node.js**: Compatible with Node.js v22+ (no legacy OpenSSL provider needed)

## Deployment Philosophy

This project follows a **Continuous Deployment** approach where all infrastructure changes should be made through CDK code, never manually in the AWS Console. The `cdkdeploy` script rebuilds everything from scratch to ensure reproducibility.

## Code Quality Requirements

- Run `ng lint` before committing to ensure zero warnings
- ESLint is configured with Angular-specific rules including:
  - Prefer standalone components over NgModules
  - Use `inject()` function instead of constructor injection
  - Accessibility requirements (alt text for images, etc.)
  - TypeScript strict type checking (no `any` types)
  - No empty lifecycle methods

## Environment Configuration

- **Development**: `src/environments/environment.ts` (`production: false`)
- **Production**: `src/environments/environment.prod.ts` (`production: true`)
- Angular automatically swaps these during production builds via file replacements in `angular.json`
