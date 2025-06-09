# Task Management

This directory contains organized TODO lists for the Tesla Supercharger Finder project.

## TODO Files

- **[TODO-security.md](./TODO-security.md)** - Security vulnerabilities and fixes (High Priority)
- **[TODO-features.md](./TODO-features.md)** - Feature implementations for Phase 1, 2, and 3
- **[TODO-testing.md](./TODO-testing.md)** - Testing improvements and coverage goals
- **[TODO-infra.md](./TODO-infra.md)** - Infrastructure, configuration, and DevOps tasks
- **[TODO-docs.md](./TODO-docs.md)** - Documentation improvements and standards

## Priority Levels

1. **Critical** - Security vulnerabilities that need immediate attention
2. **High** - Core features and major issues
3. **Medium** - Important improvements and optimizations
4. **Low** - Nice-to-have features and enhancements

## Current Focus

1. **Security**: Update Next.js to fix critical vulnerabilities
2. **Phase 1 Features**: Complete favorites, timer, and ads features
3. **Testing**: Improve test coverage from current 9.49%
4. **Infrastructure**: Optimize build and development experience

## How to Use

1. Check the relevant TODO file for your work area
2. Pick tasks based on priority
3. Update task status as you work
4. Create feature branches for implementation
5. Submit PRs when tasks are complete

## Quick Links

- Main project: [/Users/wataru_shinohara/GitHub/wshino/tesla-sc](../..)
- Worktrees:
  - `favorites` - Favorite chargers feature
  - `charging-timer` - Charging timer feature
  - `native-ads` - Native ads integration
  - `task-management` - This TODO organization (current)

## Commands

```bash
# Switch to a worktree
cd ../../worktrees/[branch-name]

# Create a new worktree
git worktree add -b [new-feature] ../../worktrees/[new-feature]

# List all worktrees
git worktree list
```
