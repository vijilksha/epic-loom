# Tekstac Issue Tracker - Excel Backend

This project has been configured to use Excel files as the backend instead of Supabase.

## Local Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install concurrently** (if not already installed)
   ```bash
   npm install concurrently --save-dev
   ```

3. **Start the Application**
   ```bash
   npm start
   ```
   This will start both the Excel backend server (port 3001) and the React frontend (port 5173).

   Alternatively, you can start them separately:
   ```bash
   # Terminal 1 - Start the Excel backend server
   npm run server

   # Terminal 2 - Start the React frontend
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Excel Files Structure

The data is stored in Excel files located in the `data/` directory:

- **issues.xlsx** - Contains all issue/defect records
- **comments.xlsx** - Contains all comments for issues
- **projects.xlsx** - Contains project information

### Default Projects
The system comes with three pre-configured projects:
1. **Student Learning Platform (SLP)** - For student-related issues
2. **Training Management System (TMS)** - For trainer-related issues  
3. **Tekstac Core Platform (TCP)** - For core platform issues

## API Endpoints

The Express server provides the following REST API endpoints:

### Projects
- `GET /api/projects` - Get all projects

### Issues
- `GET /api/issues` - Get all issues
- `POST /api/issues` - Create a new issue
- `PUT /api/issues/:id` - Update an issue
- `DELETE /api/issues/:id` - Delete an issue

### Comments
- `GET /api/comments/:issueId` - Get comments for an issue
- `POST /api/comments` - Create a new comment

## Features

✅ **Complete Excel Integration**
- Automatic Excel file creation and management
- Data persistence across application restarts
- Human-readable data format (Excel files can be opened in Excel/Google Sheets)

✅ **Jira-Style Defect Reporting**
- Project selection based on user types
- Structured defect reporting with required fields:
  - Steps to Reproduce
  - Actual Result vs Expected Result
  - Environment details
  - Priority/Severity levels
  - Labels and topic management

✅ **Full CRUD Operations**
- Create, read, update, and delete issues
- Comment system for issue tracking
- Real-time updates via React Query

✅ **Data Backup & Portability**
- All data stored in standard Excel format
- Easy to backup, share, and migrate
- Can be viewed/edited in Excel if needed

## Data Location

All Excel files are stored in the `data/` directory:
```
project-root/
├── data/
│   ├── issues.xlsx
│   ├── comments.xlsx
│   └── projects.xlsx
├── server.js
└── ...
```

You can backup these files or transfer them to other environments as needed.