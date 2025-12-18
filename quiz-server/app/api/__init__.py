from fastapi import APIRouter
from .endpoints import auth, quiz, user_quiz, health

api_router = APIRouter()

# Include all API endpoints
api_router.include_router(health.router, tags=["Health Check"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(quiz.router, prefix="/quizzes", tags=["Quizzes"])
api_router.include_router(user_quiz.router, prefix="/user-quiz", tags=["User Quiz"])