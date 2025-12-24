import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  Box, 
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { api } from '../services/api';

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);

  const handleSubmit = useCallback(async () => {
    const userName = sessionStorage.getItem('quizUserName');
    if (!userName) {
      setError('User name not found. Please restart the quiz.');
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await api.submitQuiz(id, answers, userName);
      setResult({
        score: response.score,
        total: response.total,
        percentage: response.percentage,
        userName: userName
      });
    } catch (err) {
      setError('Failed to submit quiz');
      setSubmitting(false);
    }
  }, [id, answers]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await api.getQuiz(id);
        const shuffledQuiz = {
          ...data,
          questions: shuffleArray(data.questions)
        };
        setQuiz(shuffledQuiz);
      } catch (err) {
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (!quiz) return;

    setTimeLeft(10);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else {
            handleSubmit();
          }
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, quiz, handleSubmit]);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (result) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Quiz Completed!
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Your score: {result.score} out of {result.total} ({result.percentage}%)
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const hasAnswered = answers[currentQuestion.id] !== undefined;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {quiz.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Question {currentQuestionIndex + 1} of {quiz.questions.length}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color={timeLeft <= 3 ? "error" : "text.secondary"}>
          Time remaining: {timeLeft} seconds
        </Typography>
      </Box>
      
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {currentQuestion.question_text}
        </Typography>
        
        <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerSelect(currentQuestion.id, parseInt(e.target.value))}
          >
            {[
              currentQuestion.option1,
              currentQuestion.option2,
              currentQuestion.option3,
              currentQuestion.option4
            ].map((option, index) => (
              <FormControlLabel
                key={index}
                value={index + 1}
                control={<Radio />}
                label={option}
                sx={{ mb: 1 }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        {isLastQuestion ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!hasAnswered || submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!hasAnswered}
          >
            Next
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Quiz;
