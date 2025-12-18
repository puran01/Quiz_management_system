from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.quiz import Quiz, Question, UserQuizAttempt, UserAnswer
from app.models.user import User
from typing import List, Dict
from pydantic import BaseModel

class QuizSubmission(BaseModel):
    quiz_id: int
    answers: Dict[int, int]  # question_id -> selected_option
    user_name: str

router = APIRouter()

@router.post("/submit")
async def submit_quiz(
    submission: QuizSubmission,
    db: Session = Depends(get_db)
):
    # Get quiz and questions
    quiz = db.query(Quiz).filter(Quiz.id == submission.quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    questions = db.query(Question).filter(Question.quiz_id == submission.quiz_id).all()
    
    # Calculate score
    score = 0
    total = len(questions)
    
    for question in questions:
        user_answer = submission.answers.get(question.id)
        if user_answer == question.correct_option:
            score += 1
    
    # Create attempt record (simplified - no user tracking for now)
    attempt = UserQuizAttempt(
        user_id=1,  # Default user for now
        user_name=submission.user_name,
        quiz_id=submission.quiz_id,
        score=score,
        total_questions=total
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    
    # Save user answers
    for question in questions:
        user_answer = UserAnswer(
            attempt_id=attempt.id,
            question_id=question.id,
            selected_option=submission.answers.get(question.id, 0),
            is_correct=(submission.answers.get(question.id, 0) == question.correct_option)
        )
        db.add(user_answer)
    
    db.commit()
    
    return {
        "attempt_id": attempt.id,
        "score": score,
        "total": total,
        "percentage": (score / total) * 100
    }