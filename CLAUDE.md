# Project Guidelines for Claude

## Development Environment

- Always use Docker containers for development
- Run all commands inside the Docker container
- TypeScript for all code files
- Use pnpm instead of npm for package management
- All source code, comments, and documentation should be written in English

## Code Style

- Use functional components with hooks in React
- Prefer server components where possible in Next.js 14
- Keep components small and focused
- Use Tailwind CSS for styling
- Write all code comments in English
- Use descriptive English variable and function names
- Avoid using 'any' type - always define proper TypeScript types
- Use 'unknown' instead of 'any' when type is truly unknown

## Testing Commands

Before marking any task as complete, run:

```bash
docker-compose exec app pnpm type-check
docker-compose exec app pnpm lint
docker-compose exec app pnpm test
```

## Package Management

- Always use pnpm for installing packages
- Use `pnpm add` for dependencies
- Use `pnpm add -D` for dev dependencies
- Lock file: pnpm-lock.yaml

## File Structure

- Keep the folder structure flat and simple
- Group related components together
- Use the `app` directory for Next.js 14 App Router

## API Design

- Use Next.js Route Handlers for API endpoints
- Keep API routes RESTful and simple
- Handle errors gracefully

## Performance

- Optimize images with Next.js Image component
- Use static data where possible to reduce API calls
- Implement proper caching strategies

## Security

### CRITICAL: Never Commit Credentials

- **ABSOLUTELY NEVER commit API keys, passwords, tokens, private keys, or any credentials to Git**
- This includes:
  - API keys and tokens
  - Passwords and secrets
  - **Private keys (RSA, ECDSA, Ed25519)**
  - SSH keys (id_rsa, id_ecdsa, id_ed25519)
  - SSL/TLS private keys (.key, .pem files)
  - Certificates containing private keys
  - JWT signing keys
  - Any cryptographic secrets
- This applies to code, comments, documentation, or example files
- Even in documentation, use placeholders like `your-api-key-here` or `<PRIVATE_KEY>`
- If you accidentally commit credentials:
  1. Immediately revoke/rotate the exposed credential
  2. Use BFG Repo-Cleaner or git filter-branch to remove from history
  3. Force push to overwrite remote history
  4. Notify all team members to rebase their local copies

### Environment Variables

- Store ALL sensitive data in `.env.local` (automatically gitignored)
- Never create `.env` files without ensuring they're in `.gitignore`
- Use descriptive names for env vars: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Document required env vars in README without revealing actual values

### Additional Security Practices

- Validate all user inputs
- Sanitize data before rendering
- Use HTTPS for all external API calls
- Implement proper CORS policies
- Regular security audits with `npm audit` or `pnpm audit`

## Documentation

- Keep README.md simple and focused on setup
- Document complex logic with inline comments only when necessary
- Update this CLAUDE.md file with new guidelines as needed
- All documentation should be written in English

## Git Workflow

- Make frequent, small commits with clear messages
- Use English for commit messages
- Follow conventional commit format when possible
- Create feature branches using git worktree for parallel development
