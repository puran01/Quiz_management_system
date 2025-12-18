import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '../services/api';

const ManageQuestions = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    question_text: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct_option: 1
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuiz) {
      fetchQuestions(selectedQuiz);
    }
  }, [selectedQuiz]);

  const fetchQuizzes = async () => {
    try {
      const data = await api.getQuizzes();
      setQuizzes(data);
      if (data.length > 0) {
        setSelectedQuiz(data[0].id);
      }
    } catch (err) {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (quizId) => {
    try {
      const data = await api.getQuiz(quizId);
      setQuestions(data.questions || []);
    } catch (err) {
      setError('Failed to load questions');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await api.addQuestion(selectedQuiz, formData);
      setSuccess('Question added successfully!');
      setShowAddForm(false);
      setFormData({
        question_text: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correct_option: 1
      });
      fetchQuestions(selectedQuiz);
    } catch (err) {
      setError('Failed to add question');
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await api.deleteQuestion(questionId);
      setSuccess('Question deleted successfully!');
      setQuestions(questions.filter(q => q.id !== questionId));
    } catch (err) {
      setError('Failed to delete question');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">Manage Questions</Typography>
        <Button variant="outlined" onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Select Quiz</Typography>
        <select 
          value={selectedQuiz || ''} 
          onChange={(e) => setSelectedQuiz(parseInt(e.target.value))}
          style={{ padding: '8px', fontSize: '16px', minWidth: '200px' }}
        >
          {quizzes.map(quiz => (
            <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
          ))}
        </select>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Question'}
        </Button>
      </Box>

      {showAddForm && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Add New Question</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Question"
                  name="question_text"
                  value={formData.question_text}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Option 1"
                  name="option1"
                  value={formData.option1}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Option 2"
                  name="option2"
                  value={formData.option2}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Option 3"
                  name="option3"
                  value={formData.option3}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Option 4"
                  name="option4"
                  value={formData.option4}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Correct Option"
                  name="correct_option"
                  value={formData.correct_option}
                  onChange={handleInputChange}
                  SelectProps={{ native: true }}
                >
                  <option value={1}>Option 1</option>
                  <option value={2}>Option 2</option>
                  <option value={3}>Option 3</option>
                  <option value={4}>Option 4</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Add Question
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      <Typography variant="h6" gutterBottom>
        Questions ({questions.length})
      </Typography>
      
      <Grid container spacing={2}>
        {questions.map((question) => (
          <Grid item xs={12} key={question.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {question.question_text}
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color={question.correct_option === 1 ? 'success.main' : 'text.secondary'}>
                      1. {question.option1} {question.correct_option === 1 && '(Correct)'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color={question.correct_option === 2 ? 'success.main' : 'text.secondary'}>
                      2. {question.option2} {question.correct_option === 2 && '(Correct)'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color={question.correct_option === 3 ? 'success.main' : 'text.secondary'}>
                      3. {question.option3} {question.correct_option === 3 && '(Correct)'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color={question.correct_option === 4 ? 'success.main' : 'text.secondary'}>
                      4. {question.option4} {question.correct_option === 4 && '(Correct)'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <IconButton color="error" onClick={() => handleDelete(question.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ManageQuestions;
