# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AskGramperly is an Angular 19 web application with AWS CDK infrastructure-as-code for deployment to S3. The application is a humorous "slow search engine" that makes users wait 5-15 seconds before showing real search results via the Brave Search API. The application uses standalone components (no NgModules).

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
  - Single interactive component that handles question input and displays results
  - Custom CSS clock animation during loading (no external spinner library)
  - Displays random loading messages and GIFs during intentional 5-15 second delays
  - Calls real Brave Search API via backend Lambda to fetch actual search results
  - **Standalone component** using `inject()` function for dependency injection

- **Search service**: `src/app/services/search.service.ts`
  - Injectable service that calls the backend Search API
  - Returns typed SearchResult objects (title, url, description)

- **App structure**: Modern standalone architecture
  - `main.ts` - Uses `bootstrapApplication()` instead of module bootstrap
  - `app.config.ts` - Application configuration with providers
  - No NgModules - all components are standalone

- **Routing**: Routes configured in `app.config.ts` using `provideRouter()`
- **Styling**: SCSS-based styling (`styles.scss`, component-specific SCSS files)

### Infrastructure (AWS CDK)

Located in `aws-cdk/` directory with separate package.json and dependencies.

- **CDK Version**: v2.176.0 (modern consolidated package)
- **Main stack**: `CdkStack.ts` - Defines the CDK app and instantiates all infrastructure
- **Website deployment**: `AskGramperlyWebSite.ts` - Creates and configures:
  - S3 bucket (`askgramperly.com`) with website hosting enabled
  - Bucket policy for public read access (modern approach)
  - Automatic deployment of `dist/ask-gramperly/` contents to S3
  - Uses `index.html` for both index and error documents (SPA routing)
  - Auto-delete objects enabled for easier stack cleanup
  - **Note**: Removal policy is set to DESTROY (not production-safe)
- **Search API**: `SearchApi.ts` - Creates and configures:
  - Lambda function (`lambda/search.ts`) that proxies requests to Brave Search API
  - API Gateway REST API with `/search` endpoint (GET with query param `?q=`)
  - Secrets Manager integration for storing Brave API key
  - CORS configured for all origins
  - Rate limiting: 10 requests/second, burst of 20

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
- **searchApiUrl**: Must be updated in both environment files after first CDK deployment outputs the API Gateway URL

## First-Time Setup

Before the first deployment, you must create the Brave Search API key secret in AWS Secrets Manager:

1. Sign up for a Brave Search API key at https://api-dashboard.search.brave.com/app/plans (free tier: 2,000 queries/month)
2. Create the secret in AWS:
   ```bash
   aws secretsmanager create-secret \
     --name askgramperly/brave-api-key \
     --secret-string "YOUR_BRAVE_API_KEY_HERE"
   ```
3. Deploy the CDK stack:
   ```bash
   cd aws-cdk && npm run cdkdeploy
   ```
4. Copy the `SearchApiUrl` output from the deployment
5. Update both `src/environments/environment.ts` and `src/environments/environment.prod.ts` with the API URL
6. Redeploy to include the updated environment:
   ```bash
   cd aws-cdk && npm run cdkdeploy
   ```
