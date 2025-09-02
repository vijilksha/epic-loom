TEKSTAC ISSUE TRACKER - LOCAL SETUP
=====================================

QUICK START:
1. npm install
2. npm start
3. Open http://localhost:5173

DETAILED INSTRUCTIONS:
======================

PREREQUISITES:
- Node.js (version 16 or higher)
- npm (comes with Node.js)

STEP-BY-STEP SETUP:
1. Open terminal/command prompt in project folder

2. Install all dependencies:
   npm install

3. Start the application:
   npm start
   
   This will start both:
   - Excel backend server on port 3001
   - React frontend on port 5173

4. Access the application:
   - Open your browser
   - Go to: http://localhost:5173

ALTERNATIVE STARTUP METHODS:
===========================

Windows Users:
- Double-click start.bat

Mac/Linux Users:
- Run: ./start.sh
- Or: bash start.sh

Manual Startup (two terminals):
- Terminal 1: npm run server
- Terminal 2: npm run dev

DATA STORAGE:
=============
- All data stored in Excel files in data/ folder
- issues.xlsx - Issue records
- comments.xlsx - Issue comments  
- projects.xlsx - Project information

TROUBLESHOOTING:
===============
- If port 5173 is busy, the app will use next available port
- If port 3001 is busy, change it in server.js
- Make sure all npm dependencies are installed
- Check that Node.js version is 16+

STOPPING THE APPLICATION:
========================
- Press Ctrl+C in terminal
- Or close the command prompt/terminal window