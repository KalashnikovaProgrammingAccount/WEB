
# backend/app/schemas.py
# новое с видео (исправленная версия)
from pydantic import BaseModel, EmailStr, validator, Field
from datetime import datetime
from typing import Optional, List, Dict, Any
import re

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=50)

    @validator('password')
    def password_strength(cls, v):
        if len(v) < 6:
            raise ValueError('Пароль должен содержать минимум 6 символов')
        if len(v) > 50:
            raise ValueError('Пароль не должен превышать 50 символов')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

# --- LESSON SCHEMAS ---
class LessonBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = None
    order_number: int = Field(..., ge=1)
    duration_minutes: Optional[int] = Field(None, ge=1)
    video_url: Optional[str] = None
    video_type: Optional[str] = Field(None, pattern="^(youtube|vimeo|s3|local)$")
    is_free_preview: bool = False
    materials: Optional[Dict[str, Any]] = None

class LessonCreate(LessonBase):
    course_id: int

class Lesson(LessonBase):
    id: int
    course_id: int

    class Config:
        from_attributes = True

# --- COURSE SCHEMAS ---
class CourseBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=1000)
    price: float = Field(..., ge=0)
    duration: str = Field(..., min_length=2, max_length=50)
    level: str = Field(..., min_length=2, max_length=50)
    category: Optional[str] = Field(None, max_length=50)
    preview_image: Optional[str] = None

class CourseCreate(CourseBase):
    curriculum: Optional[Dict[str, Any]] = None

class Course(CourseBase):
    id: int
    is_active: bool = True
    created_at: datetime
    curriculum: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class CourseWithLessons(Course):
    lessons: List[Lesson] = []

# --- ENROLLMENT SCHEMAS ---
class EnrollmentBase(BaseModel):
    user_id: int
    course_id: int

class EnrollmentCreate(EnrollmentBase):
    pass

class Enrollment(EnrollmentBase):
    id: int
    enrolled_at: datetime
    status: str = "active"

    class Config:
        from_attributes = True

class EnrollmentWithCourse(Enrollment):
    course: Course

class EnrollmentWithCourseAndLessons(Enrollment):
    course: CourseWithLessons

# --- AUTH SCHEMAS ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    database: str