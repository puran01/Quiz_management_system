from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.quiz import Quiz, Question
from typing import List, Dict
from pydantic import BaseModel
from app.models.quiz import Quiz, Question, UserAnswer  # Add UserAnswer to the imports
class QuestionCreate(BaseModel):
    question_text: str
    option1: str
    option2: str
    option3: str
    option4: str
    correct_option: int  # 1-4

router = APIRouter()

@router.get("/", response_model=List[dict])
async def list_quizzes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).offset(skip).limit(limit).all()
    print(quizzes)
    return [{"id": q.id, "title": q.title, "description": q.description} for q in quizzes]

@router.get("/{quiz_id}")
async def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    return {
        "id": quiz.id,
        "title": quiz.title,
        "description": quiz.description,
        "questions": [
            {
                "id": q.id,
                "question_text": q.question_text,
                "option1": q.option1,
                "option2": q.option2,
                "option3": q.option3,
                "option4": q.option4
            } for q in questions
        ]
    }

@router.post("/{quiz_id}/questions")
async def add_question(quiz_id: int, question: QuestionCreate, db: Session = Depends(get_db)):
    # Verify quiz exists
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Validate correct_option
    if question.correct_option < 1 or question.correct_option > 4:
        raise HTTPException(status_code=400, detail="correct_option must be between 1 and 4")
    
    # Create new question
    db_question = Question(
        quiz_id=quiz_id,
        question_text=question.question_text,
        option1=question.option1,
        option2=question.option2,
        option3=question.option3,
        option4=question.option4,
        correct_option=question.correct_option
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    
    return {"message": "Question added successfully", "question_id": db_question.id}

@router.delete("/questions/{question_id}")
async def delete_question(question_id: int, db: Session = Depends(get_db)):
    try:
        print(f"Attempting to delete question {question_id}")
        
        # First delete related answers
        answer_count = db.query(UserAnswer).filter(UserAnswer.question_id == question_id).delete()
        print(f"Deleted {answer_count} related answers")
        
        # Then delete the question
        question = db.query(Question).filter(Question.id == question_id).first()
        if not question:
            print(f"Question {question_id} not found")
            raise HTTPException(status_code=404, detail="Question not found")
            
        db.delete(question)
        db.commit()
        print(f"Successfully deleted question {question_id}")
        return {"message": "Question deleted successfully"}
        
    except Exception as e:
        db.rollback()
        print(f"Error deleting question {question_id}: {str(e)}")
        import traceback
        traceback.print_exc()  # This will print the full traceback
        raise HTTPException(status_code=500, detail=str(e))