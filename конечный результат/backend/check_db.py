# check_db.py
import os
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# Проверка подключения к БД
try:
    # Берем URL из .env или указываем явно
    DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/oge_master_db"
    print(f"Пытаюсь подключиться к: {DATABASE_URL}")

    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ Подключение к БД успешно!")

        # Проверяем таблицы
        tables = conn.execute(text("""
                                   SELECT table_name
                                   FROM information_schema.tables
                                   WHERE table_schema = 'public'
                                   """))

        print("\n📊 Таблицы в базе:")
        for table in tables:
            print(f"  - {table[0]}")

except OperationalError as e:
    print(f"❌ Ошибка подключения к БД: {e}")
    print("\n💡 Проверьте:")
    print("   1. PostgreSQL запущен?")
    print("   2. Пароль правильный?")
    print("   3. База существует?")