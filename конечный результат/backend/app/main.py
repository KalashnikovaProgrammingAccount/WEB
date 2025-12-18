from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timedelta
from typing import List, Dict, Any
import logging
import traceback

# Настраиваем логирование
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

from app import models, schemas, crud
from app.database import SessionLocal, engine, get_db
from app.auth import (
    create_access_token,
    authenticate_user,
    get_current_user,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Create database tables
try:
    models.Base.metadata.create_all(bind=engine)
    logger.info("✅ Таблицы базы данных созданы")
except Exception as e:
    logger.error(f"❌ Ошибка при создании таблиц: {e}")

# FastAPI приложение с документацией
app = FastAPI(
    title="OGE Master School API",
    description="API for OGE Master School - подготовка к ОГЭ",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoints
@app.get("/", response_model=schemas.HealthCheck)
async def root(db: Session = Depends(get_db)):
    """Health check endpoint"""
    try:
        # Test database connection
        db.execute(text("SELECT 1"))
        db_status = "connected"
        logger.debug("✅ Проверка подключения к БД: успешно")
    except Exception as e:
        db_status = f"disconnected: {str(e)}"
        logger.error(f"❌ Ошибка подключения к БД: {e}")

    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "database": db_status
    }

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """Detailed health check"""
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "OGE Master API",
        "version": "1.0.0",
        "database": db_status
    }

# Authentication endpoints
@app.post("/auth/login", response_model=schemas.Token)
async def login_for_access_token(
        user_data: schemas.UserLogin,
        db: Session = Depends(get_db)
):
    """Login user and return access token"""
    logger.info(f"🔐 Попытка входа: {user_data.email}")

    user = authenticate_user(db, user_data.email, user_data.password)
    if not user:
        logger.warning(f"❌ Неудачная попытка входа: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неправильный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )

    logger.info(f"✅ Успешный вход: {user.email}")
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.post("/auth/register", response_model=schemas.User)
async def register_user(
        user: schemas.UserCreate,
        db: Session = Depends(get_db)
):
    """Register new user"""
    logger.info(f"📝 Начало регистрации: {user.email}")

    try:
        # Проверяем существование пользователя
        db_user = crud.get_user_by_email(db, email=user.email)
        if db_user:
            logger.warning(f"⚠️ Email уже занят: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email уже зарегистрирован"
            )

        logger.debug(f"Создаю пользователя: {user.email}")
        new_user = crud.create_user(db=db, user=user)

        logger.info(f"✅ Пользователь создан: ID={new_user.id}, email={new_user.email}")
        return new_user

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Критическая ошибка при регистрации: {type(e).__name__}: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Внутренняя ошибка сервера: {str(e)}"
        )

# User endpoints
@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user

@app.get("/users/", response_model=List[schemas.User])
async def read_users(
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(get_current_active_user)
):
    """Get all users (admin only)"""
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

# Course endpoints
@app.get("/courses/", response_model=List[schemas.Course])
async def read_courses(
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db)
):
    """Get all active courses"""
    courses = crud.get_courses(db, skip=skip, limit=limit)
    return courses

@app.get("/courses/{course_id}", response_model=schemas.Course)
async def read_course(
        course_id: int,
        db: Session = Depends(get_db)
):
    """Get course by ID"""
    db_course = crud.get_course(db, course_id=course_id)
    if db_course is None:
        raise HTTPException(status_code=404, detail="Курс не найден")
    return db_course

@app.get("/courses/{course_id}/with-lessons", response_model=schemas.CourseWithLessons)
async def read_course_with_lessons(
        course_id: int,
        db: Session = Depends(get_db)
):
    """Get course with all lessons"""
    db_course = crud.get_course(db, course_id=course_id)
    if db_course is None:
        raise HTTPException(status_code=404, detail="Курс не найден")

    lessons = crud.get_course_lessons(db, course_id=course_id)

    # Создаем ответ с уроками
    course_dict = {k: v for k, v in db_course.__dict__.items() if not k.startswith('_')}
    course_dict["lessons"] = lessons

    return course_dict

@app.post("/courses/", response_model=schemas.Course)
async def create_course(
        course: schemas.CourseCreate,
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(get_current_active_user)
):
    """Create new course (admin only)"""
    return crud.create_course(db=db, course=course)

# Lesson endpoints
@app.post("/courses/{course_id}/lessons", response_model=schemas.Lesson)
async def create_lesson_for_course(
        course_id: int,
        lesson: schemas.LessonCreate,
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(get_current_active_user)
):
    """Create lesson for a course (admin only)"""
    # Проверяем существование курса
    course = crud.get_course(db, course_id=course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Курс не найден")

    # Устанавливаем course_id
    lesson_data = lesson.dict()
    lesson_data["course_id"] = course_id

    return crud.create_lesson(db=db, lesson=schemas.LessonCreate(**lesson_data))

@app.get("/courses/{course_id}/lessons", response_model=List[schemas.Lesson])
async def read_course_lessons(
        course_id: int,
        db: Session = Depends(get_db)
):
    """Get all lessons for a course"""
    lessons = crud.get_course_lessons(db, course_id=course_id)
    return lessons

@app.get("/lessons/{lesson_id}", response_model=schemas.Lesson)
async def read_lesson(
        lesson_id: int,
        db: Session = Depends(get_db)
):
    """Get lesson by ID"""
    db_lesson = crud.get_lesson(db, lesson_id=lesson_id)
    if db_lesson is None:
        raise HTTPException(status_code=404, detail="Урок не найден")
    return db_lesson

# Enrollment endpoints
@app.post("/enrollments/", response_model=schemas.Enrollment)
async def create_enrollment(
        enrollment: schemas.EnrollmentCreate,
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(get_current_active_user)
):
    """Enroll user in a course"""
    # Ensure user can only enroll themselves
    enrollment.user_id = current_user.id

    # Check if course exists
    course = crud.get_course(db, course_id=enrollment.course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Курс не найден")

    return crud.create_enrollment(db=db, enrollment=enrollment)

@app.get("/enrollments/my", response_model=List[schemas.Enrollment])
async def get_my_enrollments(
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(get_current_active_user)
):
    """Get current user's enrollments"""
    return crud.get_user_enrollments(db, user_id=current_user.id)

@app.get("/enrollments/my-with-courses", response_model=List[Dict[str, Any]])
async def get_my_enrollments_with_courses(
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(get_current_active_user)
):
    """Get current user's enrollments with course details"""
    enrollments = crud.get_enrollments_with_courses(db, user_id=current_user.id)

    result = []
    for enrollment in enrollments:
        result.append({
            "id": enrollment.id,
            "enrolled_at": enrollment.enrolled_at,
            "status": enrollment.status,
            "course": {
                "id": enrollment.course.id,
                "title": enrollment.course.title,
                "description": enrollment.course.description,
                "price": enrollment.course.price,
                "duration": enrollment.course.duration,
                "level": enrollment.course.level
            }
        })

    return result

@app.get("/enrollments/my-with-courses-and-lessons", response_model=List[Dict[str, Any]])
async def get_my_enrollments_with_courses_and_lessons(
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(get_current_active_user)
):
    """Get current user's enrollments with course and lesson details"""
    enrollments_data = crud.get_enrollments_with_courses_and_lessons(db, user_id=current_user.id)

    result = []
    for data in enrollments_data:
        enrollment = data['enrollment']
        course = data['course']
        lessons = data['lessons']

        result.append({
            "id": enrollment.id,
            "enrolled_at": enrollment.enrolled_at,
            "status": enrollment.status,
            "course": {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "price": course.price,
                "duration": course.duration,
                "level": course.level
            },
            "lessons": [
                {
                    "id": lesson.id,
                    "title": lesson.title,
                    "description": lesson.description,
                    "order_number": lesson.order_number,
                    "duration_minutes": lesson.duration_minutes,
                    "video_url": lesson.video_url,
                    "video_type": lesson.video_type,
                    "is_free_preview": lesson.is_free_preview
                } for lesson in lessons
            ]
        })

    return result

# Data seeding endpoint with videos
@app.post("/seed-data-with-videos")
async def seed_data_with_videos(db: Session = Depends(get_db)):
    """Create sample data with videos for testing"""
    logger.info("🎬 Создание тестовых данных с видео")

    # Создаем курсы
    sample_courses = [
        {
            "title": "Математика ОГЭ - Алгебра",
            "description": "Полный курс алгебры для подготовки к ОГЭ",
            "detailed_description": "Курс охватывает все темы алгебры: уравнения, неравенства, функции, прогрессии.",
            "price": 5000.0,
            "duration": "8 месяцев",
            "level": "Средний",
            "category": "Математика",
            "preview_image": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
            "curriculum": {
                "modules": [
                    {"title": "Модуль 1: Основы алгебры", "hours": 20},
                    {"title": "Модуль 2: Уравнения", "hours": 25},
                    {"title": "Модуль 3: Функции", "hours": 30}
                ]
            }
        },
        {
            "title": "Русский язык - Подготовка к сочинению",
            "description": "Учимся писать сочинение на максимальный балл",
            "detailed_description": "Разбор структуры сочинения, клише, примеры работ.",
            "price": 4500.0,
            "duration": "6 месяцев",
            "level": "Начальный",
            "category": "Русский язык",
            "preview_image": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
            "curriculum": {
                "modules": [
                    {"title": "Модуль 1: Структура сочинения", "hours": 15},
                    {"title": "Модуль 2: Аргументация", "hours": 20},
                    {"title": "Модуль 3: Практика", "hours": 25}
                ]
            }
        },
        {
            "title": "Физика ОГЭ - Механика",
            "description": "Разбор всех задач по механике для ОГЭ",
            "detailed_description": "Кинематика, динамика, статика, законы сохранения.",
            "price": 5500.0,
            "duration": "7 месяцев",
            "level": "Продвинутый",
            "category": "Физика",
            "preview_image": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
            "curriculum": {
                "modules": [
                    {"title": "Модуль 1: Кинематика", "hours": 18},
                    {"title": "Модуль 2: Динамика", "hours": 22},
                    {"title": "Модуль 3: Законы сохранения", "hours": 20}
                ]
            }
        }
    ]

    created_courses = []

    for course_data in sample_courses:
        try:
            course = schemas.CourseCreate(**course_data)
            created_course = crud.create_course(db=db, course=course)
            created_courses.append(created_course)

            # Добавляем уроки для курса
            if course_data["title"] == "Математика ОГЭ - Алгебра":
                math_lessons = [
                    {
                        "title": "Введение в алгебру",
                        "description": "Основные понятия и термины алгебры",
                        "order_number": 1,
                        "duration_minutes": 45,
                        "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  # Замените на реальное видео
                        "video_type": "youtube",
                        "is_free_preview": True,
                        "materials": {
                            "presentation": "intro_algebra.pdf",
                            "tasks": ["task1.pdf", "task2.pdf"]
                        }
                    },
                    {
                        "title": "Линейные уравнения",
                        "description": "Решение уравнений первой степени",
                        "order_number": 2,
                        "duration_minutes": 60,
                        "video_url": "https://vimeo.com/123456789",  # Замените на реальное видео
                        "video_type": "vimeo",
                        "is_free_preview": False,
                        "materials": {
                            "presentation": "linear_equations.pdf",
                            "homework": "hw1.pdf"
                        }
                    }
                ]

                for lesson_data in math_lessons:
                    lesson_data["course_id"] = created_course.id
                    crud.create_lesson(db=db, lesson=schemas.LessonCreate(**lesson_data))

            elif course_data["title"] == "Русский язык - Подготовка к сочинению":
                russian_lessons = [
                    {
                        "title": "Структура сочинения ОГЭ",
                        "description": "Как правильно построить сочинение",
                        "order_number": 1,
                        "duration_minutes": 50,
                        "video_url": "https://www.youtube.com/watch?v=abc123",  # Замените на реальное видео
                        "video_type": "youtube",
                        "is_free_preview": True,
                        "materials": {
                            "template": "essay_template.docx",
                            "examples": ["example1.pdf", "example2.pdf"]
                        }
                    }
                ]

                for lesson_data in russian_lessons:
                    lesson_data["course_id"] = created_course.id
                    crud.create_lesson(db=db, lesson=schemas.LessonCreate(**lesson_data))

        except Exception as e:
            logger.error(f"Ошибка при создании курса: {e}")

    return {
        "message": "Тестовые данные с видео созданы успешно",
        "courses_created": len(created_courses),
        "courses": [
            {
                "id": course.id,
                "title": course.title,
                "category": course.category,
                "price": course.price
            } for course in created_courses
        ]
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTP ошибка {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Необработанная ошибка: {type(exc).__name__}: {exc}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": "Внутренняя ошибка сервера"}
    )

# Application info
@app.get("/api/info")
async def api_info():
    """Get API information"""
    return {
        "name": "OGE Master School API",
        "version": "1.0.0",
        "description": "API для школы подготовки к ОГЭ",
        "documentation": "/docs"
    }