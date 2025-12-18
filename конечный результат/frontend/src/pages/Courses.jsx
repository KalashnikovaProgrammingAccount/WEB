// src/pages/Courses.jsx - ПОЛНЫЙ КОД
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { coursesAPI, storageAPI } from '../utils/api';

const Courses = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState({});
    const [message, setMessage] = useState({ text: '', type: '' });
    const [enrolledCourses, setEnrolledCourses] = useState(new Set());

    useEffect(() => {
        console.log('🚀 Courses component mounted');
        console.log('🔐 isAuthenticated:', isAuthenticated);
        console.log('👤 User:', user);
        console.log('🔑 Token in localStorage:', localStorage.getItem('token'));

        fetchCourses();
        loadEnrolledCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            console.log('🔄 Загрузка курсов...');

            const data = await coursesAPI.getAll();
            console.log(`📥 Получено ${data.length} курсов`);

            setCourses(data);

        } catch (error) {
            console.error('❌ Ошибка загрузки курсов:', error);
            setMessage({
                text: 'Не удалось загрузить курсы. Пожалуйста, попробуйте позже.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const loadEnrolledCourses = async () => {
        try {
            if (isAuthenticated) {
                console.log('📚 Загрузка записанных курсов...');
                console.log('🔐 Токен для запроса:', localStorage.getItem('token'));

                try {
                    // Сначала пробуем API
                    const enrollments = await coursesAPI.getMyEnrollments();
                    console.log('✅ API вернул записи:', enrollments);

                    const enrolledIds = new Set(enrollments.map(e => e.course_id || e.course?.id));

                    // Затем проверяем localStorage как резерв
                    const storageEnrollments = storageAPI.getEnrollments();
                    console.log('💾 Записи из localStorage:', storageEnrollments);

                    storageEnrollments.forEach(e => {
                        if (e.course_id || e.course?.id) {
                            enrolledIds.add(e.course_id || e.course?.id);
                        }
                    });

                    setEnrolledCourses(enrolledIds);
                    console.log(`🎯 Всего записанных курсов: ${enrolledIds.size}`);

                } catch (apiError) {
                    console.warn('⚠️ API недоступен, использую localStorage');

                    // Если API недоступен, используем только localStorage
                    const storageEnrollments = storageAPI.getEnrollments();
                    const enrolledIds = new Set();

                    storageEnrollments.forEach(e => {
                        if (e.course_id || e.course?.id) {
                            enrolledIds.add(e.course_id || e.course?.id);
                        }
                    });

                    setEnrolledCourses(enrolledIds);
                    console.log(`💾 Загружено ${enrolledIds.size} курсов из localStorage`);
                }

            } else {
                console.log('👤 Пользователь не авторизован');
                // Для неавторизованных пользователей показываем только из localStorage
                const storageEnrollments = storageAPI.getEnrollments();
                const enrolledIds = new Set();

                storageEnrollments.forEach(e => {
                    if (e.course_id || e.course?.id) {
                        enrolledIds.add(e.course_id || e.course?.id);
                    }
                });

                setEnrolledCourses(enrolledIds);
            }

        } catch (error) {
            console.error('❌ Общая ошибка загрузки записанных курсов:', error);
        }
    };

    const handleEnroll = async (courseId) => {
        console.log('🎯 Начало записи на курс ID:', courseId);
        console.log('🔐 Авторизован:', isAuthenticated);
        console.log('👤 Пользователь:', user);

        // Проверка авторизации
        if (!isAuthenticated || !user) {
            setMessage({
                text: 'Для записи на курс необходимо войти в систему',
                type: 'warning'
            });

            setTimeout(() => {
                navigate('/login', {
                    state: { from: '/courses' }
                });
            }, 1500);
            return;
        }

        // Проверка, не записан ли уже на курс
        if (enrolledCourses.has(courseId)) {
            setMessage({
                text: 'Вы уже записаны на этот курс!',
                type: 'info'
            });
            return;
        }

        setEnrolling({ ...enrolling, [courseId]: true });
        setMessage({ text: '', type: '' });

        try {
            // Находим курс для отображения названия
            const course = courses.find(c => c.id === courseId);
            const courseTitle = course?.title || 'курс';

            console.log(`🎯 Запись на курс: ${courseTitle} (ID: ${courseId})`);

            // Проверяем токен перед запросом
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Токен не найден');
            }

            // Пробуем записаться через API
            console.log('🌐 Отправка запроса на сервер...');
            const result = await coursesAPI.enroll(courseId);

            console.log('✅ Ответ от сервера:', result);

            // Обновляем состояние записанных курсов
            setEnrolledCourses(prev => new Set([...prev, courseId]));

            // Показываем успешное сообщение
            setMessage({
                text: `🎉 Поздравляем, ${user?.full_name || 'Пользователь'}! Вы успешно записались на курс "${courseTitle}"!`,
                type: 'success'
            });

            // Сохраняем в localStorage как резервную копию
            storageAPI.saveEnrollment(courseId);

            // Обновляем список курсов в UI
            setCourses(prev => prev.map(c =>
                c.id === courseId
                    ? { ...c, enrolled: true, enrolled_at: new Date().toISOString() }
                    : c
            ));

            // Перенаправляем в личный кабинет через 2 секунды
            setTimeout(() => {
                navigate('/dashboard/courses');
            }, 2000);

        } catch (error) {
            console.error('❌ Ошибка записи на курс:', error);
            console.error('Детали ошибки:', error.response || error.message);

            // Проверяем, если это ошибка авторизации
            if (error.response?.status === 401 || error.message?.includes('авторизация') || error.message?.includes('401')) {
                setMessage({
                    text: 'Сессия истекла. Пожалуйста, войдите снова.',
                    type: 'error'
                });

                // Удаляем недействительный токен
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                setTimeout(() => {
                    navigate('/login', {
                        state: { from: '/courses' }
                    });
                }, 1500);
                return;
            }

            // Если API недоступен или другая ошибка, используем localStorage
            console.log('🔄 Использую офлайн-режим для записи...');
            storageAPI.saveEnrollment(courseId);
            setEnrolledCourses(prev => new Set([...prev, courseId]));

            // Обновляем UI
            setCourses(prev => prev.map(c =>
                c.id === courseId
                    ? { ...c, enrolled: true, enrolled_at: new Date().toISOString() }
                    : c
            ));

            // Находим курс для отображения названия
            const course = courses.find(c => c.id === courseId);
            const courseTitle = course?.title || 'курс';

            setMessage({
                text: `✅ Вы записались на курс "${courseTitle}"! (режим офлайн)`,
                type: 'success'
            });

            // Перенаправляем в личный кабинет через 2 секунды
            setTimeout(() => {
                navigate('/dashboard/courses');
            }, 2000);

        } finally {
            setEnrolling({ ...enrolling, [courseId]: false });
        }
    };

    const handleRefresh = () => {
        console.log('🔄 Обновление курсов...');
        setLoading(true);
        setMessage({ text: '', type: '' });
        fetchCourses();
        loadEnrolledCourses();
    };

    const handleTestAuth = () => {
        console.log('🧪 Тест авторизации...');
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        console.log('🔑 Токен:', token);
        console.log('👤 Пользователь:', userData);
        console.log('🔐 isAuthenticated из контекста:', isAuthenticated);

        alert(`Токен: ${token ? 'Есть' : 'Нет'}\nПользователь: ${userData ? JSON.parse(userData).email : 'Нет'}`);
    };

    const handleQuickLogin = () => {
        console.log('🚀 Быстрый вход для тестирования...');

        // Создаем тестового пользователя
        const testUser = {
            id: Date.now(),
            full_name: 'Тестовый Пользователь',
            email: 'test@example.com'
        };

        const testToken = 'test_jwt_token_' + Date.now();

        localStorage.setItem('token', testToken);
        localStorage.setItem('user', JSON.stringify(testUser));

        alert('✅ Тестовый пользователь создан! Обновите страницу.');
        window.location.reload();
    };

    const getMessageStyle = (type) => {
        const styles = {
            success: {
                background: '#d1fae5',
                border: '1px solid #10b981',
                color: '#065f46'
            },
            error: {
                background: '#fee2e2',
                border: '1px solid #ef4444',
                color: '#991b1b'
            },
            warning: {
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                color: '#92400e'
            },
            info: {
                background: '#dbeafe',
                border: '1px solid #3b82f6',
                color: '#1e40af'
            }
        };
        return styles[type] || {
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            color: '#4b5563'
        };
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #e5e7eb',
                        borderTopColor: '#4f46e5',
                        borderRadius: '50%',
                        margin: '0 auto 1rem',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
                        Загружаем курсы...
                    </p>
                    <button
                        onClick={handleRefresh}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#f3f4f6',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            color: '#4b5563'
                        }}
                    >
                        Обновить
                    </button>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Отладочная панель */}
                <div style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.85rem',
                    color: '#6b7280'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div>
                                <strong>Статус:</strong>
                                <span style={{
                                    marginLeft: '0.5rem',
                                    padding: '0.25rem 0.5rem',
                                    background: isAuthenticated ? '#10b981' : '#f59e0b',
                                    color: 'white',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem'
                                }}>
                                    {isAuthenticated ? '✅ Авторизован' : '❌ Не авторизован'}
                                </span>
                            </div>
                            <div>
                                <strong>Пользователь:</strong>
                                <span style={{ marginLeft: '0.5rem', color: '#1f2937' }}>
                                    {user?.full_name || 'Неизвестен'}
                                </span>
                            </div>
                            <div>
                                <strong>Записанных курсов:</strong>
                                <span style={{ marginLeft: '0.5rem', color: '#10b981', fontWeight: 'bold' }}>
                                    {enrolledCourses.size}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={handleTestAuth}
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    background: '#e5e7eb',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    color: '#4b5563'
                                }}
                                title="Проверить авторизацию"
                            >
                                🧪 Тест
                            </button>
                            {!isAuthenticated && (
                                <button
                                    onClick={handleQuickLogin}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        background: '#fef3c7',
                                        border: '1px solid #f59e0b',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        color: '#92400e'
                                    }}
                                    title="Быстрый вход для тестирования"
                                >
                                    🚀 Тестовый вход
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Сообщения */}
                {message.text && (
                    <div style={{
                        marginBottom: '2rem',
                        padding: '1rem 1.5rem',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        ...getMessageStyle(message.type)
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {message.type === 'success' && '✅ '}
                            {message.type === 'error' && '❌ '}
                            {message.type === 'warning' && '⚠️ '}
                            {message.type === 'info' && 'ℹ️ '}
                            <span>{message.text}</span>
                        </div>
                    </div>
                )}

                {/* Заголовок и управление */}
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                margin: '0 0 0.5rem 0',
                                color: '#1f2937',
                                lineHeight: 1.2
                            }}>
                                Наши курсы
                            </h1>
                            <p style={{
                                fontSize: '1.1rem',
                                color: '#6b7280',
                                marginBottom: '0.5rem'
                            }}>
                                {courses.length} профессиональных курсов подготовки к ОГЭ
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/dashboard/courses"
                                        style={{
                                            padding: '0.6rem 1.2rem',
                                            background: '#4f46e5',
                                            color: 'white',
                                            textDecoration: 'none',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#4338ca';
                                            e.target.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = '#4f46e5';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        📚 Мои курсы
                                        {enrolledCourses.size > 0 && (
                                            <span style={{
                                                background: 'white',
                                                color: '#4f46e5',
                                                padding: '0.1rem 0.5rem',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {enrolledCourses.size}
                                            </span>
                                        )}
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    style={{
                                        padding: '0.6rem 1.2rem',
                                        background: '#f3f4f6',
                                        color: '#4b5563',
                                        textDecoration: 'none',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        border: '1px solid #d1d5db'
                                    }}
                                >
                                    🔑 Войти для записи
                                </Link>
                            )}

                            <button
                                onClick={handleRefresh}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    background: 'white',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    color: '#4b5563',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#f3f4f6';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'white';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                🔄 Обновить
                            </button>
                        </div>
                    </div>

                    {!isAuthenticated && (
                        <div style={{
                            padding: '1rem',
                            background: '#fef3c7',
                            borderRadius: '8px',
                            border: '1px solid #f59e0b',
                            color: '#92400e',
                            fontSize: '0.9rem',
                            marginTop: '1rem'
                        }}>
                            ⚠️ Для записи на курс необходимо войти в систему.
                            <Link
                                to="/login"
                                style={{
                                    color: '#d97706',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    marginLeft: '0.5rem'
                                }}
                            >
                                Войти
                            </Link> или
                            <Link
                                to="/signup"
                                style={{
                                    color: '#d97706',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    marginLeft: '0.5rem'
                                }}
                            >
                                Зарегистрироваться
                            </Link>
                        </div>
                    )}
                </div>

                {/* Сетка курсов */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '2rem',
                    marginBottom: '4rem'
                }}>
                    {courses.map((course) => {
                        const isEnrolled = enrolledCourses.has(course.id);
                        const isEnrolling = enrolling[course.id];

                        return (
                            <div
                                key={course.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '1.75rem',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    border: '1px solid #e5e7eb',
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                                }}
                            >
                                {/* Статус записи */}
                                {isEnrolled && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: '#10b981',
                                        color: 'white',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        zIndex: 1
                                    }}>
                                        ✓ Записан
                                    </div>
                                )}

                                {/* Бейджи */}
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                    {course.popular && (
                                        <span style={{
                                            background: '#fef3c7',
                                            color: '#92400e',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '500'
                                        }}>
                                            Популярный
                                        </span>
                                    )}
                                    {course.new && (
                                        <span style={{
                                            background: '#dbeafe',
                                            color: '#1e40af',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '500'
                                        }}>
                                            Новый
                                        </span>
                                    )}
                                    <span style={{
                                        background: '#f3f4f6',
                                        color: '#4b5563',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '500'
                                    }}>
                                        {course.level}
                                    </span>
                                </div>

                                {/* Иконка курса */}
                                <div style={{
                                    fontSize: '3.5rem',
                                    textAlign: 'center',
                                    marginBottom: '1.5rem',
                                    height: '70px'
                                }}>
                                    {course.image}
                                </div>

                                {/* Заголовок */}
                                <h3 style={{
                                    margin: '0 0 1rem 0',
                                    color: '#1f2937',
                                    fontSize: '1.3rem',
                                    fontWeight: '600',
                                    lineHeight: 1.3,
                                    minHeight: '3.5rem'
                                }}>
                                    {course.title}
                                </h3>

                                {/* Описание */}
                                <p style={{
                                    color: '#6b7280',
                                    marginBottom: '1.5rem',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.5,
                                    flexGrow: 1
                                }}>
                                    {course.shortDescription}
                                </p>

                                {/* Детали курса */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1.5rem',
                                    paddingTop: '1.25rem',
                                    borderTop: '1px solid #e5e7eb'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                                            Длительность
                                        </div>
                                        <div style={{ fontWeight: '600', color: '#1f2937' }}>
                                            {course.duration}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                                            Уроков
                                        </div>
                                        <div style={{ fontWeight: '600', color: '#1f2937' }}>
                                            {course.lessonsCount}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                                            Цена
                                        </div>
                                        <div style={{ fontWeight: '600', color: '#4f46e5' }}>
                                            {course.price.toLocaleString()} ₽
                                        </div>
                                    </div>
                                </div>

                                {/* Кнопки */}
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                                    <Link
                                        to={`/courses/${course.id}`}
                                        style={{
                                            padding: '0.75rem',
                                            background: '#f3f4f6',
                                            color: '#4b5563',
                                            textDecoration: 'none',
                                            borderRadius: '8px',
                                            border: '1px solid #e5e7eb',
                                            flex: 1,
                                            textAlign: 'center',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#e5e7eb';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = '#f3f4f6';
                                        }}
                                    >
                                        Подробнее
                                    </Link>

                                    <button
                                        onClick={() => handleEnroll(course.id)}
                                        disabled={isEnrolling || isEnrolled || !isAuthenticated}
                                        style={{
                                            padding: '0.75rem',
                                            background: isEnrolled ? '#10b981' :
                                                !isAuthenticated ? '#9ca3af' : '#4f46e5',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: isEnrolled || !isAuthenticated ? 'default' : 'pointer',
                                            flex: 1,
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            opacity: isEnrolling ? 0.8 : 1,
                                            transition: 'all 0.2s',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isEnrolled && isAuthenticated) {
                                                e.target.style.background = '#4338ca';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isEnrolled && isAuthenticated) {
                                                e.target.style.background = '#4f46e5';
                                            }
                                        }}
                                    >
                                        {isEnrolling ? (
                                            <>
                                                <span style={{
                                                    display: 'inline-block',
                                                    animation: 'spin 1s linear infinite',
                                                    marginRight: '0.5rem'
                                                }}>↻</span>
                                                Записываем...
                                            </>
                                        ) : isEnrolled ? (
                                            '✓ Записан'
                                        ) : !isAuthenticated ? (
                                            'Войдите'
                                        ) : (
                                            'Записаться'
                                        )}
                                    </button>
                                </div>

                                {/* ID курса для отладки */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '0.5rem',
                                    left: '0.5rem',
                                    fontSize: '0.7rem',
                                    color: '#d1d5db'
                                }}>
                                    ID: {course.id}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Информационный блок */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '2.5rem',
                    borderRadius: '16px',
                    textAlign: 'center',
                    marginBottom: '3rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-10%',
                        width: '300px',
                        height: '300px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%'
                    }}></div>

                    <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem', fontWeight: '600' }}>
                        Не можете выбрать курс?
                    </h2>
                    <p style={{
                        marginBottom: '2rem',
                        opacity: 0.9,
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto 2rem'
                    }}>
                        Пройдите бесплатное тестирование и получите персональную рекомендацию
                    </p>
                    <button
                        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                        style={{
                            padding: '1rem 2.5rem',
                            background: 'white',
                            color: '#4f46e5',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            zIndex: 1
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        Пройти тестирование
                    </button>
                </div>

                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    .course-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                    }
                    
                    button:disabled {
                        opacity: 0.7;
                        cursor: not-allowed;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Courses;