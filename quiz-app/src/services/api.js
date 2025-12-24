const API_BASE_URL = 'http://localhost:8000/api/v1';

export const api = {
  // Health check
  async health() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  // Authentication
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  },

  async register(username, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return response.json();
  },

  // Quizzes
  async getQuizzes() {
    const response = await fetch(`${API_BASE_URL}/quizzes/`);
    return response.json();
  },

  async getQuiz(quizId) {
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`);
    return response.json();
  },

  // Submit quiz
  async submitQuiz(quizId, answers, userName) {
    const response = await fetch(`${API_BASE_URL}/user-quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quiz_id: quizId, answers, user_name: userName }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit quiz');
    }
    
    return response.json();
  },

  // Question management
  async addQuestion(quizId, questionData) {
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add question');
    }
    
    return response.json();
  },

  async deleteQuestion(questionId) {
    const response = await fetch(`${API_BASE_URL}/quizzes/questions/${questionId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete question');
    }
    
    return response.json();
  }
};
