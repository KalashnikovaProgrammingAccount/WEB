# debug_registration.py
import requests
import json
import traceback

def debug_registration():
    url = "http://localhost:8000/auth/register"

    data = {
        "email": "test2@example.com",
        "full_name": "Тест Тестов",
        "password": "password123"
    }

    print(f"Отправка POST на: {url}")
    print(f"Данные: {json.dumps(data, ensure_ascii=False, indent=2)}")

    try:
        response = requests.post(url, json=data, timeout=10)

        print(f"\nСтатус код: {response.status_code}")
        print(f"Заголовки: {dict(response.headers)}")
        print(f"Тело ответа: {response.text}")

        if response.status_code == 500:
            print("\n❌ Внутренняя ошибка сервера (500)")
            print("Скорее всего ошибка в коде регистрации")

    except requests.exceptions.ConnectionError:
        print("❌ Не могу подключиться к серверу")
        print("Убедитесь что сервер запущен на localhost:8000")
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    print("🔍 ДЕБАГ РЕГИСТРАЦИИ")
    print("=" * 50)
    debug_registration()