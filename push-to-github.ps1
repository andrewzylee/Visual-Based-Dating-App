# PowerShell script to push to GitHub
# Run this script: .\push-to-github.ps1

Write-Host "Initializing git repository..." -ForegroundColor Cyan
git init

Write-Host "Adding remote repository..." -ForegroundColor Cyan
git remote add origin https://github.com/andrewzylee/Visual-Based-Dating-App.git

# Check if remote already exists
if ($LASTEXITCODE -ne 0) {
    Write-Host "Remote already exists, updating..." -ForegroundColor Yellow
    git remote set-url origin https://github.com/andrewzylee/Visual-Based-Dating-App.git
}

Write-Host "Adding all files..." -ForegroundColor Cyan
git add .

Write-Host "Committing changes..." -ForegroundColor Cyan
git commit -m "Initial commit: Visual Compatibility Matching Platform with 3D avatar builder, personality sliders, and lifestyle blocks"

Write-Host "Setting main branch..." -ForegroundColor Cyan
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "You may be prompted for your GitHub credentials." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "Push failed. You may need to:" -ForegroundColor Red
    Write-Host "1. Pull first: git pull origin main --allow-unrelated-histories" -ForegroundColor Yellow
    Write-Host "2. Use a Personal Access Token for authentication" -ForegroundColor Yellow
    Write-Host "3. Set up SSH keys" -ForegroundColor Yellow
}

