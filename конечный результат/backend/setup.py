#!/usr/bin/env python3
"""
НАСТРОЙКА БАЗЫ ДАННЫХ ДЛЯ OGE MASTER
"""

import psycopg2

print("🎯 НАСТРОЙКА БАЗЫ ДАННЫХ")
print("=" * 50)

try:
    # Пробуем создать новую базу
    print("\n1. Создаем базу oge_master_db...")

    # Подключаемся к дефолтной базе postgres
    conn = psycopg2.connect(
        host="localhost",
        port="5432",
        user="postgres",
        password="postgres",
        database="postgres"
    )
    conn.autocommit = True
    cursor = conn.cursor()

    # Проверяем, есть ли уже база
    cursor.execute("SELECT 1 FROM pg_database WHERE datname='oge_master_db'")

    if not cursor.fetchone():
        cursor.execute("CREATE DATABASE oge_master_db")
        print("✅ База oge_master_db создана!")
    else:
        print("✅ База oge_master_db уже существует")

    cursor.close()
    conn.close()

    # Пишем .env файл
    print("\n2. Создаю .env файл...")

    env_content = """DATABASE_URL=postgresql://postgres:postgres@localhost:5432/oge_master_db
SECRET_KEY=super-secret-key-for-oge-master-app-in-2024-super-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True"""

    with open('.env', 'w') as f:
        f.write(env_content)

    print("✅ .env файл создан")

except Exception as e:
    print(f"\n❌ Не удалось создать новую базу: {e}")

    # Пробуем использовать существующую базу пользователя
    print("\n📝 Использую существующую базу viktorkalasnikov...")

    env_content = """DATABASE_URL=postgresql://postgres:postgres@localhost:5432/viktorkalasnikov
SECRET_KEY=super-secret-key-for-oge-master-app-in-2024-super-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True"""

    with open('.env', 'w') as f:
        f.write(env_content)

    print("✅ .env создан с базой viktorkalasnikov")

print("\n" + "=" * 50)
print("🚀 ВСЁ ГОТОВО!")
print("🌐 Запускай сервер командой:")
print("   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
print("📚 Документация: http://localhost:8000/docs")