# Remove API Key from Git History

## IMPORTANT: Steps to remove the exposed API key from git history

### 1. First, revoke the exposed API key in Google Cloud Console

Go to https://console.cloud.google.com/apis/credentials and revoke the exposed key immediately

### 2. Install BFG Repo-Cleaner

```bash
brew install bfg
```

### 3. Clone a fresh copy of your repo

```bash
cd /tmp
git clone --mirror https://github.com/wshino/tesla-sc.git
cd tesla-sc.git
```

### 4. Create a file with the text to remove

```bash
echo "YOUR-EXPOSED-API-KEY" > ../api-keys.txt
```

### 5. Run BFG to remove the API key from all commits

```bash
bfg --replace-text ../api-keys.txt
```

### 6. Clean up the repo

```bash
git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

### 7. Push the cleaned history

```bash
git push --force
```

### 8. Tell all collaborators to rebase

All collaborators need to:

```bash
git fetch origin
git rebase origin/main
```

## Alternative: Using git filter-branch (slower but no additional tools needed)

```bash
# From your repository root
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch DEPLOY_VERCEL.md" \
  --prune-empty --tag-name-filter cat -- --all

# Then force push
git push origin --force --all
git push origin --force --tags
```

## After cleaning the history:

1. Generate a new API key in Google Cloud Console
2. Add proper restrictions (HTTP referrer, API restrictions)
3. Store it only in `.env.local` (never commit)
4. Update your local `.env.local` with the new key
5. Update Vercel environment variables with the new key

## Prevention for the future:

1. Never put real API keys in documentation
2. Use placeholders like `your-api-key-here`
3. Consider using tools like git-secrets to prevent accidental commits
4. Review all files before committing
