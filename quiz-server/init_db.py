import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent))

from app.database.database import engine, Base
from app.models.user import User
from app.models.quiz import Quiz, Question, UserQuizAttempt, UserAnswer
from app.core.config import settings
from app.core.security import get_password_hash

def init_db():
    # Create all tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Create a default admin user if it doesn't exist
    from sqlalchemy.orm import Session
    db = Session(engine)
    
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin_user = User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            is_admin=True
        )
        db.add(admin_user)
        db.commit()
        print("Created default admin user")
    
    print("Database initialization complete!")

if __name__ == "__main__":
    init_db()
