# Project Guidelines for Claude

## Development Environment
- Always use Docker containers for development
- Run all commands inside the Docker container
- TypeScript for all code files

## Code Style
- Use functional components with hooks in React
- Prefer server components where possible in Next.js 14
- Keep components small and focused
- Use Tailwind CSS for styling

## Testing Commands
Before marking any task as complete, run:
```bash
docker-compose exec app npm run type-check
docker-compose exec app npm run lint
```

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
- Never commit API keys or secrets
- Use environment variables for sensitive data
- Validate all user inputs

## Documentation
- Keep README.md simple and focused on setup
- Document complex logic with inline comments only when necessary
- Update this CLAUDE.md file with new guidelines as needed