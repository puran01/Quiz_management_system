from app.database.database import SessionLocal
from app.models.quiz import Quiz, Question

def create_sample_data():
    db = SessionLocal()
    
    try:
        # Create a sample quiz
        quiz = Quiz(
            title="General Knowledge Quiz",
            description="Test your general knowledge with this fun quiz!"
        )
        db.add(quiz)
        db.commit()
        db.refresh(quiz)
        
        # Add questions to the quiz
        questions = [
            {
                "question_text": "What is the capital of France?",
                "option1": "London",
                "option2": "Berlin",
                "option3": "Paris",
                "option4": "Madrid",
                "correct_option": 3
            },
            {
                "question_text": "Which planet is known as the Red Planet?",
                "option1": "Venus",
                "option2": "Mars",
                "option3": "Jupiter",
                "option4": "Saturn",
                "correct_option": 2
            },
            {
                "question_text": "What is 2 + 2?",
                "option1": "3",
                "option2": "4",
                "option3": "5",
                "option4": "6",
                "correct_option": 2
            },
            {
                "question_text": "Who painted the Mona Lisa?",
                "option1": "Vincent van Gogh",
                "option2": "Pablo Picasso",
                "option3": "Leonardo da Vinci",
                "option4": "Michelangelo",
                "correct_option": 3
            },
            {
                "question_text": "What is the largest ocean on Earth?",
                "option1": "Atlantic Ocean",
                "option2": "Indian Ocean",
                "option3": "Arctic Ocean",
                "option4": "Pacific Ocean",
                "correct_option": 4
            }
        ]
        
        for q in questions:
            question = Question(
                quiz_id=quiz.id,
                **q
            )
            db.add(question)
        
        db.commit()
        print(f"Sample data created successfully! Quiz ID: {quiz.id}")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()
