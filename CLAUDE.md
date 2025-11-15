# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AskGramperly is an Angular 10 web application with AWS CDK infrastructure-as-code for deployment to S3. The application is a humorous single-page app that simulates asking "Gramperly" questions with random loading animations and messages.

## Development Commands

### Angular Application

- **Start dev server**: `npm start` or `ng serve` (runs on http://localhost:4200/)
- **Build for production**: `ng build --prod` (outputs to `dist/ask-gramperly/`)
- **Build for development**: `ng build` or `npm run build`
- **Watch mode**: `npm run watch` (rebuilds on file changes)
- **Run tests**: `npm test` or `ng test` (runs Karma tests)
- **Lint code**: `ng lint` (runs TSLint)

### AWS CDK Deployment

All CDK commands must be run from the `aws-cdk/` directory.

- **Build CDK**: `cd aws-cdk && npm run build` (compiles TypeScript to JavaScript)
- **Deploy infrastructure and application**: `cd aws-cdk && npm run cdkdeploy`
  - This runs the full deployment pipeline:
    1. Builds CDK TypeScript code
    2. Builds Angular app in production mode (`ng build --prod`)
    3. Deploys infrastructure and uploads assets to S3 via `cdk deploy`
- **Synthesize CloudFormation**: `cd aws-cdk && cdk synth`
- **View diff**: `cd aws-cdk && cdk diff`

## Architecture

### Frontend Structure

- **Main component**: `src/app/ask-gramperly/ask-gramperly.component.ts`
  - Single interactive component that handles question input
  - Uses `ngx-spinner` for loading animations
  - Displays random loading messages and GIFs during simulated processing
  - Currently a mock implementation (doesn't actually search, just shows random delays)

- **Routing**: Basic Angular routing configured in `app-routing.module.ts`
- **Styling**: SCSS-based styling (`styles.scss`, component-specific SCSS files)

### Infrastructure (AWS CDK)

Located in `aws-cdk/` directory with separate package.json and dependencies.

- **Main stack**: `CdkStack.ts` - Defines the CDK app and instantiates the website deployment
- **Website deployment**: `AskGramperlyWebSite.ts` - Creates and configures:
  - S3 bucket (`askgramperly.com`) with website hosting enabled
  - Public read access
  - Automatic deployment of `dist/ask-gramperly/` contents to S3
  - Uses `index.html` for both index and error documents (SPA routing)
  - **Note**: Removal policy is set to DESTROY (not production-safe)

### Configuration

- **TypeScript**: Version 4.0.2 (Angular), 4.0.3 (CDK)
- **Angular**: Version 10.2.4
- **AWS CDK**: Version 1.94.1
- **Linting**: TSLint with strict rules (max line length: 140, single quotes, etc.)
- **Build output**: `dist/ask-gramperly/` (used by CDK for S3 deployment)

## Deployment Philosophy

This project follows a **Continuous Deployment** approach where all infrastructure changes should be made through CDK code, never manually in the AWS Console. The `cdkdeploy` script rebuilds everything from scratch to ensure reproducibility.

## Code Quality Requirements

- Run `ng lint` before committing to ensure zero warnings
- TSLint is configured with strict rules including:
  - Single quotes for strings
  - 140 character line length limit
  - Proper spacing and indentation (spaces, not tabs)
  - Angular-specific rules (component/directive naming, lifecycle hooks, etc.)

## Environment Configuration

- **Development**: `src/environments/environment.ts` (`production: false`)
- **Production**: `src/environments/environment.prod.ts` (`production: true`)
- Angular automatically swaps these during production builds via file replacements in `angular.json`
