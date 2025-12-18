# fix_models.py
import os

# Проверяем наличие файлов
files_to_check = ['app/__init__.py', 'app/models.py', 'app/database.py']

for file in files_to_check:
    if os.path.exists(file):
        print(f"✅ {file} существует")
        with open(file, 'r') as f:
            content = f.read()
            if 'Base' in content:
                print(f"   Содержит 'Base'")
            else:
                print(f"   ❌ Не содержит 'Base'")
    else:
        print(f"❌ {file} не существует")

# Создаем app/__init__.py если его нет
if not os.path.exists('app/__init__.py'):
    print("\nСоздаю app/__init__.py...")
    with open('app/__init__.py', 'w') as f:
        f.write('__version__ = "1.0.0"')
    print("✅ app/__init__.py создан")

# Исправляем database.py
print("\nПроверяю app/database.py...")
with open('app/database.py', 'r') as f:
    db_content = f.read()

if 'Base = declarative_base()' not in db_content:
    print("❌ app/database.py не содержит Base = declarative_base()")
    # Добавляем
    lines = db_content.split('\n')
    new_lines = []
    for line in lines:
        new_lines.append(line)
        if 'SessionLocal = sessionmaker' in line:
            new_lines.append('')
            new_lines.append('Base = declarative_base()')

    with open('app/database.py', 'w') as f:
        f.write('\n'.join(new_lines))
    print("✅ Добавил Base в app/database.py")

print("\n🔄 Запускаю проверку импортов...")

# Тест импорта
test_code = """
import sys
sys.path.append('.')

try:
    from app.database import Base
    print("✅ Base импортируется из database")
    
    from app import models
    print("✅ models импортируется")
    
    # Проверяем, что модели наследуются от Base
    from app.models import User, Course, Lesson, Enrollment
    print("✅ Модели импортируются")
    
    print("\\n🎯 ВСЕ ОК!")
    
except Exception as e:
    print(f"❌ Ошибка: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
"""

with open('test_import.py', 'w') as f:
    f.write(test_code)

import subprocess
subprocess.run(['python', 'test_import.py'])

os.remove('test_import.py')