@echo off
cd door-guard-buddy-main
git status
git add -A
git commit -m "Fix syntax error in MissingPersonsPanel.tsx - added missing closing div tag"
git push
