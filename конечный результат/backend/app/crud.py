from sqlalchemy.orm import Session
from sqlalchemy import and_
from app import models, schemas
from app.auth import get_password_hash

# User CRUD operations
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    print(f"CRUD: Создание пользователя {user.email}")

    try:
        hashed_password = get_password_hash(user.password)
        print(f"CRUD: Пароль захэширован успешно")

        db_user = models.User(
            email=user.email,
            full_name=user.full_name,
            hashed_password=hashed_password
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        print(f"CRUD: Пользователь создан успешно, ID={db_user.id}")
        return db_user

    except Exception as e:
        print(f"CRUD: Ошибка при создании пользователя: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

# Course CRUD operations
def get_courses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Course).filter(models.Course.is_active == True).offset(skip).limit(limit).all()

def get_course(db: Session, course_id: int):
    return db.query(models.Course).filter(models.Course.id == course_id).first()

def create_course(db: Session, course: schemas.CourseCreate):
    db_course = models.Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def update_course(db: Session, course_id: int, course_update: schemas.CourseCreate):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if db_course:
        for key, value in course_update.dict().items():
            setattr(db_course, key, value)
        db.commit()
        db.refresh(db_course)
    return db_course

def delete_course(db: Session, course_id: int):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if db_course:
        db_course.is_active = False
        db.commit()
        db.refresh(db_course)
    return db_course

# Lesson CRUD operations
def create_lesson(db: Session, lesson: schemas.LessonCreate):
    db_lesson = models.Lesson(**lesson.dict())
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

def get_course_lessons(db: Session, course_id: int):
    return db.query(models.Lesson).filter(
        models.Lesson.course_id == course_id
    ).order_by(models.Lesson.order_number).all()

def get_lesson(db: Session, lesson_id: int):
    return db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()

def get_lesson_with_course(db: Session, lesson_id: int):
    return db.query(models.Lesson).join(models.Course).filter(
        models.Lesson.id == lesson_id
    ).first()

def update_lesson(db: Session, lesson_id: int, lesson_update: schemas.LessonCreate):
    db_lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if db_lesson:
        for key, value in lesson_update.dict().items():
            setattr(db_lesson, key, value)
        db.commit()
        db.refresh(db_lesson)
    return db_lesson

def delete_lesson(db: Session, lesson_id: int):
    db_lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if db_lesson:
        db.delete(db_lesson)
        db.commit()
    return db_lesson

# Enrollment CRUD operations
def create_enrollment(db: Session, enrollment: schemas.EnrollmentCreate):
    # Check if enrollment already exists
    existing_enrollment = db.query(models.Enrollment).filter(
        and_(
            models.Enrollment.user_id == enrollment.user_id,
            models.Enrollment.course_id == enrollment.course_id,
            models.Enrollment.status == "active"
        )
    ).first()

    if existing_enrollment:
        return existing_enrollment

    db_enrollment = models.Enrollment(**enrollment.dict())
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment

def get_user_enrollments(db: Session, user_id: int):
    return db.query(models.Enrollment).filter(models.Enrollment.user_id == user_id).all()

def get_enrollment(db: Session, enrollment_id: int):
    return db.query(models.Enrollment).filter(models.Enrollment.id == enrollment_id).first()

def get_enrollments_with_courses(db: Session, user_id: int):
    return db.query(models.Enrollment).join(models.Course).filter(
        models.Enrollment.user_id == user_id
    ).all()

def get_enrollments_with_courses_and_lessons(db: Session, user_id: int):
    enrollments = db.query(models.Enrollment).join(models.Course).filter(
        models.Enrollment.user_id == user_id
    ).all()

    result = []
    for enrollment in enrollments:
        lessons = get_course_lessons(db, enrollment.course_id)
        result.append({
            'enrollment': enrollment,
            'course': enrollment.course,
            'lessons': lessons
        })

    return result

def cancel_enrollment(db: Session, enrollment_id: int):
    db_enrollment = db.query(models.Enrollment).filter(models.Enrollment.id == enrollment_id).first()
    if db_enrollment:
        db_enrollment.status = "cancelled"
        db.commit()
        db.refresh(db_enrollment)
    return db_enrollment