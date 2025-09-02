// Excel-based API client to replace Supabase
const API_BASE_URL = 'http://localhost:3001/api';

export const excelApi = {
  // Projects
  getProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  // Issues
  getIssues: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(`${API_BASE_URL}/issues`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      return response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Backend server not responding. Make sure Node.js server is running on port 3001');
      }
      throw error;
    }
  },

  createIssue: async (issue: any) => {
    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issue),
    });
    if (!response.ok) throw new Error('Failed to create issue');
    return response.json();
  },

  updateIssue: async (id: string, updates: any) => {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update issue');
    return response.json();
  },

  deleteIssue: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete issue');
    return response.json();
  },

  // Comments
  getComments: async (issueId: string) => {
    const response = await fetch(`${API_BASE_URL}/comments/${issueId}`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  },

  createComment: async (comment: any) => {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });
    if (!response.ok) throw new Error('Failed to create comment');
    return response.json();
  },
};