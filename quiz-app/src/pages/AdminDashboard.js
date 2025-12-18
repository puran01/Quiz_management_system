import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 'Paris'
    },
    {
      id: 2,
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 'Mars'
    }
  ]);
  
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question || newQuestion.options.some(opt => !opt) || !newQuestion.correctAnswer) {
      setSnackbarMessage('Please fill in all fields');
      setOpenSnackbar(true);
      return;
    }

    try {
      // Find the correct option index (1-4)
      const correctOptionIndex = newQuestion.options.findIndex(opt => opt === newQuestion.correctAnswer) + 1;
      
      if (correctOptionIndex === 0) {
        setSnackbarMessage('Correct answer must match one of the options');
        setOpenSnackbar(true);
        return;
      }

      // Add question to database (assuming quiz ID 1 for now)
      await api.addQuestion(1, {
        question_text: newQuestion.question,
        option1: newQuestion.options[0],
        option2: newQuestion.options[1],
        option3: newQuestion.options[2],
        option4: newQuestion.options[3],
        correct_option: correctOptionIndex
      });

      // Update local state
      const newQuestionObj = {
        id: questions.length + 1,
        ...newQuestion
      };

      setQuestions([...questions, newQuestionObj]);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      });
      
      setSnackbarMessage('Question added successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Failed to add question to database');
      setOpenSnackbar(true);
    }
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">Admin Dashboard</Typography>
        <Box>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => navigate('/manage-questions')}
            sx={{ mr: 2 }}
          >
            Manage Questions
          </Button>
          <Typography variant="subtitle1" component="span" sx={{ mr: 2 }}>
            Welcome, {currentUser?.username}
          </Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Add New Question</Typography>
              <TextField
                fullWidth
                label="Question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                margin="normal"
              />
              
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Options:</Typography>
              {[0, 1, 2, 3].map((index) => (
                <TextField
                  key={index}
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={newQuestion.options[index] || ''}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  margin="dense"
                  size="small"
                />
              ))}
              
              <TextField
                fullWidth
                label="Correct Answer"
                value={newQuestion.correctAnswer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                margin="normal"
                helperText="Enter the exact text of the correct answer"
              />
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddQuestion}
                sx={{ mt: 2 }}
              >
                Add Question
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Current Questions ({questions.length})</Typography>
              <List>
                {questions.map((q, index) => (
                  <div key={q.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDeleteQuestion(q.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={`${index + 1}. ${q.question}`}
                        secondary={
                          <>
                            <div>Options: {q.options.join(', ')}</div>
                            <div>Correct Answer: {q.correctAnswer}</div>
                          </>
                        }
                      />
                    </ListItem>
                    {index < questions.length - 1 && <Divider component="li" />}
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
