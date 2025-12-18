from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.security import create_access_token
from app.schemas.user import UserCreate, UserLogin
from app.models.user import User

router = APIRouter()

@router.post("/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    # Simple login without password hashing
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or db_user.hashed_password != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    return {"access_token": create_access_token(data={"sub": user.username})}

@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    # Create new user (without password hashing)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=user.password,
        is_active=True,
        is_admin=True  # Set new registrations as admin users
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User created successfully"}