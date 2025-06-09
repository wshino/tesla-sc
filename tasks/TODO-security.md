# Security TODOs

## Critical Priority

### 1. Update Next.js to fix vulnerabilities

- [ ] Update Next.js from 14.2.5 to 14.2.25 or later
  - Current: 14.2.5
  - Required: >=14.2.25
  - Vulnerabilities: 1 Critical, 2 High, 3 Moderate
  - Run: `docker-compose exec app pnpm add next@latest`
  - Test thoroughly after update

### 2. Fix other dependency vulnerabilities

- [ ] Update esbuild to fix security issues
  - Check and update to latest version
  - Run: `docker-compose exec app pnpm audit fix`

## High Priority

### 3. Security audit and fixes

- [ ] Run full security audit
  - `docker-compose exec app pnpm audit`
  - Document all findings
  - Create action plan for each vulnerability

### 4. Environment variable security

- [ ] Verify all sensitive data is in .env.local
- [ ] Ensure .env files are properly gitignored
- [ ] Document all required environment variables in README
- [ ] Add validation for required env vars at startup

## Medium Priority

### 5. API security enhancements

- [ ] Implement rate limiting for API routes
- [ ] Add proper CORS configuration
- [ ] Validate all user inputs
- [ ] Add request size limits

### 6. Docker security

- [ ] Remove deprecated `version` attribute from docker-compose.yml
- [ ] Review Docker image security best practices
- [ ] Implement non-root user in containers
- [ ] Add security scanning to CI/CD pipeline

## Low Priority

### 7. Security headers

- [ ] Implement Content Security Policy (CSP)
- [ ] Add security headers middleware
- [ ] Configure HTTPS-only in production
- [ ] Enable HSTS

### 8. Authentication preparation

- [ ] Plan authentication strategy for future features
- [ ] Research NextAuth.js or similar solutions
- [ ] Design secure session management

## Notes

- Always test thoroughly after security updates
- Monitor for new vulnerabilities regularly
- Keep dependencies up to date
- Follow OWASP guidelines
