# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Setup: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm run start`
- Lint: `npm run lint`
- TypeCheck: `npm run typecheck`
- Test: `npm run test`
- Test single file: `npm run test -- path/to/test.test.ts`

## Stack & Guidelines
- **Frontend**: Next.js with React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Functions)
- **Chat**: Stream Chat SDK
- **API Integration**: SimplyRETS for property listings, Calendly for scheduling
- **Naming**: PascalCase for components, camelCase for variables/functions
- **File Structure**: Feature-based organization
- **Imports**: Group by external, internal, types, styles
- **Error Handling**: Use try/catch with appropriate error messages
- **Performance**: Avoid unnecessary renders, memoize expensive calculations
- **Typescript**: Use strict typing, define interfaces in src/types
- **Components**: Use 'use client' directive for client components, promote reusability

Focus on integrating IDX/FMR data and implementing a simplified mortgage calculator while using third-party solutions for chat and scheduling.