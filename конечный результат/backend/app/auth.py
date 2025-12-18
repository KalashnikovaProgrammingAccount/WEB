

from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv
from app import crud, schemas
from app.database import get_db

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Используем bcrypt с sha256 как fallback
pwd_context = CryptContext(
    schemes=["bcrypt", "sha256_crypt"],
    bcrypt__default_rounds=12,
    deprecated="auto"
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверка пароля"""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"Ошибка при проверке пароля: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Хеширование пароля с обработкой длины"""
    try:
        # Для bcrypt: ограничение 72 байта, для UTF-8 это примерно 72 символа
        # Но лучше ограничить явно
        if len(password.encode('utf-8')) > 72:
            # Обрезаем до безопасной длины
            password = password[:50]

        return pwd_context.hash(password)
    except Exception as e:
        print(f"Ошибка при хешировании пароля: {e}")
        # Fallback на sha256 если bcrypt не работает
        from passlib.hash import sha256_crypt
        return sha256_crypt.hash(password)

def authenticate_user(db: Session, email: str, password: str):
    """Аутентификация пользователя"""
    user = crud.get_user_by_email(db, email)
    if not user:
        print(f"Пользователь не найден: {email}")
        return False

    if not verify_password(password, user.hashed_password):
        print(f"Неверный пароль для: {email}")
        return False

    return user

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Создание JWT токена"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    try:
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        print(f"Ошибка при создании токена: {e}")
        raise

async def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    """Получение текущего пользователя из токена"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось проверить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            raise credentials_exception

        token_data = schemas.TokenData(email=email)

    except JWTError as e:
        print(f"JWT ошибка: {e}")
        raise credentials_exception
    except Exception as e:
        print(f"Ошибка при декодировании токена: {e}")
        raise credentials_exception

    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        print(f"Пользователь не найден по токену: {email}")
        raise credentials_exception

    return user

async def get_current_active_user(
        current_user: schemas.User = Depends(get_current_user)
):
    """Проверка активности пользователя"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неактивный пользователь"
        )

    return current_user