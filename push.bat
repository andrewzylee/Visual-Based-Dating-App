@echo off
echo ========================================
echo Pushing to GitHub
echo ========================================
echo.

echo [1/7] Initializing git repository...
git init
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/downloads
    pause
    exit /b 1
)

echo.
echo [2/7] Adding remote repository...
git remote add origin https://github.com/andrewzylee/Visual-Based-Dating-App.git 2>nul
if errorlevel 1 (
    echo Remote already exists, updating...
    git remote set-url origin https://github.com/andrewzylee/Visual-Based-Dating-App.git
)

echo.
echo [3/7] Adding all files...
git add .

echo.
echo [4/7] Committing changes...
git commit -m "Initial commit: Visual Compatibility Matching Platform with 3D avatar builder, personality sliders, and lifestyle blocks"

echo.
echo [5/7] Setting main branch...
git branch -M main

echo.
echo [6/7] Pushing to GitHub...
echo You will be prompted for your GitHub credentials.
echo Use your username and a Personal Access Token (not password)
echo.
git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo Push failed. Common solutions:
    echo ========================================
    echo 1. If repository has existing content, run:
    echo    git pull origin main --allow-unrelated-histories
    echo    Then push again: git push -u origin main
    echo.
    echo 2. Use Personal Access Token instead of password
    echo    Create at: https://github.com/settings/tokens
    echo.
    echo 3. Make sure you have push access to the repository
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Successfully pushed to GitHub!
    echo ========================================
    echo Repository: https://github.com/andrewzylee/Visual-Based-Dating-App
)

echo.
pause

