import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  CircularProgress
} from '@mui/material';

const QuizStart = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (userName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    try {
      setLoading(true);
      // Store user name in sessionStorage for the quiz session
      sessionStorage.setItem('quizUserName', userName.trim());
      
      // Get quiz ID from URL
      const pathParts = window.location.pathname.split('/');
      const quizId = pathParts[pathParts.length - 1];
      
      // Navigate to the actual quiz
      navigate(`/quiz/${quizId}`);
    } catch (err) {
      setError('Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Start Quiz
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          Please enter your name to begin the quiz
        </Typography>
        
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            margin="normal"
            required
            autoFocus
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Start Quiz'}
          </Button>
          
          <Box textAlign="center">
            <Button
              variant="text"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default QuizStart;
