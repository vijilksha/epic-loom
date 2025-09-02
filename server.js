import express from 'express';
import cors from 'cors';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Excel files paths
const DATA_DIR = path.join(__dirname, 'data');
const ISSUES_FILE = path.join(DATA_DIR, 'issues.xlsx');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.xlsx');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.xlsx');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Helper function to read Excel file
function readExcelFile(filePath, sheetName = 'Sheet1') {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) return [];
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Helper function to write Excel file
function writeExcelFile(filePath, data, sheetName = 'Sheet1') {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filePath);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
}

// Initialize default data if files don't exist
function initializeData() {
  // Initialize projects
  if (!fs.existsSync(PROJECTS_FILE)) {
    const defaultProjects = [
      {
        id: '1',
        name: 'Student Learning Platform',
        code: 'SLP',
        description: 'Issues related to student learning activities and coursework',
        user_role: 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Training Management System',
        code: 'TMS',
        description: 'Issues related to training content and instructor tools',
        user_role: 'trainer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Tekstac Core Platform',
        code: 'TCP',
        description: 'Core platform issues affecting all users',
        user_role: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    writeExcelFile(PROJECTS_FILE, defaultProjects);
  }

  // Initialize empty issues and comments files
  if (!fs.existsSync(ISSUES_FILE)) {
    writeExcelFile(ISSUES_FILE, []);
  }
  if (!fs.existsSync(COMMENTS_FILE)) {
    writeExcelFile(COMMENTS_FILE, []);
  }
}

// Generate unique ID
function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Routes

// Projects
app.get('/api/projects', (req, res) => {
  try {
    const projects = readExcelFile(PROJECTS_FILE);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Issues
app.get('/api/issues', (req, res) => {
  try {
    const issues = readExcelFile(ISSUES_FILE);
    // Sort by created_at descending
    issues.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/issues', (req, res) => {
  try {
    const issues = readExcelFile(ISSUES_FILE);
    const newIssue = {
      id: generateId(),
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status_date: new Date().toISOString()
    };
    
    issues.push(newIssue);
    writeExcelFile(ISSUES_FILE, issues);
    res.json(newIssue);
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/issues/:id', (req, res) => {
  try {
    const issues = readExcelFile(ISSUES_FILE);
    const issueIndex = issues.findIndex(issue => issue.id === req.params.id);
    
    if (issueIndex === -1) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    issues[issueIndex] = {
      ...issues[issueIndex],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    writeExcelFile(ISSUES_FILE, issues);
    res.json(issues[issueIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/issues/:id', (req, res) => {
  try {
    const issues = readExcelFile(ISSUES_FILE);
    const filteredIssues = issues.filter(issue => issue.id !== req.params.id);
    
    if (issues.length === filteredIssues.length) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    writeExcelFile(ISSUES_FILE, filteredIssues);
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comments
app.get('/api/comments/:issueId', (req, res) => {
  try {
    const comments = readExcelFile(COMMENTS_FILE);
    const issueComments = comments.filter(comment => comment.issue_id === req.params.issueId);
    issueComments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    res.json(issueComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/comments', (req, res) => {
  try {
    const comments = readExcelFile(COMMENTS_FILE);
    const newComment = {
      id: generateId(),
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    comments.push(newComment);
    writeExcelFile(COMMENTS_FILE, comments);
    res.json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize data and start server
initializeData();

app.listen(PORT, () => {
  console.log(`Excel backend server running on http://localhost:${PORT}`);
  console.log(`Data files stored in: ${DATA_DIR}`);
});