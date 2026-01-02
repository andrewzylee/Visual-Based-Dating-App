# Push to GitHub - Step by Step Instructions

## Prerequisites
1. Make sure Git is installed on your computer
   - Download from: https://git-scm.com/downloads
   - Or install via: `winget install Git.Git` (Windows)

## Steps to Push

### Method 1: Using Git Bash or Command Prompt

1. **Open Git Bash** (or Command Prompt/PowerShell with Git)

2. **Navigate to your project folder:**
   ```bash
   cd C:\Users\User\Desktop\test
   ```

3. **Initialize git (if not already):**
   ```bash
   git init
   ```

4. **Add the remote repository:**
   ```bash
   git remote add origin https://github.com/andrewzylee/Visual-Based-Dating-App.git
   ```
   
   If you get "remote origin already exists", use:
   ```bash
   git remote set-url origin https://github.com/andrewzylee/Visual-Based-Dating-App.git
   ```

5. **Add all files:**
   ```bash
   git add .
   ```

6. **Commit the changes:**
   ```bash
   git commit -m "Initial commit: Visual Compatibility Matching Platform with 3D avatar builder, personality sliders, and lifestyle blocks"
   ```

7. **Set the main branch:**
   ```bash
   git branch -M main
   ```

8. **Push to GitHub:**
   ```bash
   git push -u origin main
   ```

### If the repository already has content:

If you get an error about unrelated histories, first pull:
```bash
git pull origin main --allow-unrelated-histories
```

Then push again:
```bash
git push -u origin main
```

### Authentication

When prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (NOT your GitHub password)
  - Create one at: https://github.com/settings/tokens
  - Select scopes: `repo` (full control of private repositories)

### Method 2: Using GitHub Desktop

1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. File → Add Local Repository → Select your project folder
4. Click "Publish repository" and select the remote repository

### Method 3: Using VS Code

1. Open VS Code in your project folder
2. Open Source Control panel (Ctrl+Shift+G)
3. Click "Initialize Repository"
4. Stage all changes
5. Commit with message
6. Click "..." → "Remote" → "Add Remote"
7. Enter: `https://github.com/andrewzylee/Visual-Based-Dating-App.git`
8. Push to remote

## Troubleshooting

**Error: "fatal: not a git repository"**
- Run `git init` first

**Error: "remote origin already exists"**
- Run `git remote set-url origin https://github.com/andrewzylee/Visual-Based-Dating-App.git`

**Error: "failed to push some refs"**
- Pull first: `git pull origin main --allow-unrelated-histories`
- Then push again

**Authentication failed**
- Use Personal Access Token instead of password
- Or set up SSH keys

