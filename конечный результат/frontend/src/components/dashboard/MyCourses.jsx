// src/pages/dashboard/MyCourses.jsx - ИСПРАВЛЕННЫЙ КОД
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI, storageAPI } from '../../utils/api';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadMyCourses();
    }, []);

    const loadMyCourses = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('📚 Загрузка моих курсов...');

            // Сначала пробуем получить данные из API
            let apiCourses = [];
            try {
                const response = await coursesAPI.getMyEnrollments();
                console.log('✅ API вернул записи:', response);

                if (Array.isArray(response) && response.length > 0) {
                    apiCourses = response.map(enrollment => {
                        // Форматируем данные в нужный формат
                        return {
                            id: enrollment.id || enrollment.enrollment_id,
                            enrolled_at: enrollment.enrolled_at || enrollment.created_at || new Date().toISOString(),
                            status: enrollment.status || 'active',
                            course: {
                                id: enrollment.course_id || enrollment.course?.id,
                                title: enrollment.course?.title || `Курс ${enrollment.course_id}`,
                                description: enrollment.course?.description || enrollment.course?.shortDescription || 'Описание курса',
                                price: enrollment.course?.price || 0,
                                duration: enrollment.course?.duration || 'Не указано',
                                level: enrollment.course?.level || 'Любой уровень',
                                image: enrollment.course?.image || '📚'
                            }
                        };
                    });
                }
            } catch (apiError) {
                console.warn('⚠️ API недоступен:', apiError.message);
            }

            // Получаем данные из localStorage как резерв
            const storageEnrollments = storageAPI.getEnrollments();
            console.log('💾 Записи из localStorage:', storageEnrollments);

            const storageCourses = storageEnrollments.map(enrollment => {
                // Если у нас уже есть этот курс из API, используем данные API
                const existingApiCourse = apiCourses.find(c => c.course.id === (enrollment.course_id || enrollment.course?.id));

                if (existingApiCourse) {
                    return existingApiCourse;
                }

                // Иначе создаем из localStorage
                return {
                    id: enrollment.id || enrollment.enrollment_id || Date.now(),
                    enrolled_at: enrollment.enrolled_at || enrollment.created_at || new Date().toISOString(),
                    status: enrollment.status || 'active',
                    course: {
                        id: enrollment.course_id || enrollment.course?.id,
                        title: enrollment.course?.title || `Курс ${enrollment.course_id}`,
                        description: enrollment.course?.description || enrollment.course?.shortDescription || 'Описание курса',
                        price: enrollment.course?.price || 0,
                        duration: enrollment.course?.duration || 'Не указано',
                        level: enrollment.course?.level || 'Любой уровень',
                        image: enrollment.course?.image || '📚'
                    }
                };
            });

            // Объединяем курсы из API и localStorage, убирая дубликаты
            const allCourses = [...apiCourses];
            storageCourses.forEach(storageCourse => {
                const exists = allCourses.some(c => c.course.id === storageCourse.course.id);
                if (!exists) {
                    allCourses.push(storageCourse);
                }
            });

            console.log(`🎯 Всего моих курсов: ${allCourses.length}`);
            console.log('📊 Данные курсов:', allCourses);

            if (allCourses.length === 0) {
                console.log('ℹ️ У пользователя нет записанных курсов');
            }

            setCourses(allCourses);

        } catch (error) {
            console.error('❌ Ошибка загрузки курсов:', error);
            setError('Не удалось загрузить ваши курсы');

            // В случае ошибки показываем данные из localStorage
            const storageEnrollments = storageAPI.getEnrollments();
            const storageCourses = storageEnrollments.map(enrollment => ({
                id: enrollment.id || enrollment.enrollment_id || Date.now(),
                enrolled_at: enrollment.enrolled_at || enrollment.created_at || new Date().toISOString(),
                status: enrollment.status || 'active',
                course: {
                    id: enrollment.course_id || enrollment.course?.id,
                    title: enrollment.course?.title || `Курс ${enrollment.course_id}`,
                    description: enrollment.course?.description || enrollment.course?.shortDescription || 'Описание курса',
                    price: enrollment.course?.price || 0,
                    duration: enrollment.course?.duration || 'Не указано',
                    level: enrollment.course?.level || 'Любой уровень',
                    image: enrollment.course?.image || '📚'
                }
            }));

            setCourses(storageCourses);
            console.log(`💾 Использую ${storageCourses.length} курсов из localStorage`);

        } finally {
            setLoading(false);
        }
    };

    const getCourseProgress = (courseId) => {
        // Временная логика прогресса
        const progressMap = {
            1: 65,
            2: 30,
            3: 15,
            4: 0
        };
        return progressMap[courseId] || Math.floor(Math.random() * 100);
    };

    const handleRefresh = () => {
        console.log('🔄 Обновление моих курсов...');
        setLoading(true);
        loadMyCourses();
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #e5e7eb',
                    borderTopColor: '#4f46e5',
                    borderRadius: '50%',
                    margin: '0 auto 1rem',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p>Загрузка ваших курсов...</p>
                <button
                    onClick={handleRefresh}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Обновить
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Заголовок и управление */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem', color: '#1f2937', fontSize: '1.75rem' }}>
                        Мои курсы
                    </h1>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                        Продолжайте обучение и отслеживайте свой прогресс
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        fontSize: '0.9rem',
                        color: '#6b7280'
                    }}>
                        <span>Всего курсов: <strong>{courses.length}</strong></span>
                        <span>•</span>
                        <span>Активных: <strong style={{ color: '#10b981' }}>{courses.filter(c => c.status === 'active').length}</strong></span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleRefresh}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            color: '#4b5563',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        🔄 Обновить
                    </button>

                    <Link
                        to="/courses"
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#4f46e5',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        ➕ Новый курс
                    </Link>
                </div>
            </div>

            {/* Сообщение об ошибке */}
            {error && (
                <div style={{
                    marginBottom: '2rem',
                    padding: '1rem',
                    background: '#fee2e2',
                    border: '1px solid #ef4444',
                    borderRadius: '8px',
                    color: '#991b1b'
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Отладочная информация */}
            {courses.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
                    <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>У вас пока нет курсов</h2>
                    <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto' }}>
                        Начните обучение, выбрав подходящий курс из нашего каталога
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link
                            to="/courses"
                            style={{
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '1rem'
                            }}
                        >
                            Выбрать курс
                        </Link>
                        <button
                            onClick={() => {
                                console.log('Текущие данные в localStorage:', storageAPI.getEnrollments());
                                alert(`Проверьте консоль для отладки.\nЗаписей в localStorage: ${storageAPI.getEnrollments().length}`);
                            }}
                            style={{
                                padding: '1rem 2rem',
                                background: '#f3f4f6',
                                color: '#4b5563',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            🐛 Отладка
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Список курсов */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {courses.map((enrollment) => (
                            <div
                                key={enrollment.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    padding: '1.5rem',
                                    borderLeft: '4px solid #4f46e5',
                                    transition: 'transform 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <div style={{
                                                fontSize: '1.5rem',
                                                width: '50px',
                                                height: '50px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: '#f3f4f6',
                                                borderRadius: '10px'
                                            }}>
                                                {enrollment.course?.image || '📚'}
                                            </div>
                                            <div>
                                                <h3 style={{
                                                    margin: '0 0 0.5rem 0',
                                                    fontSize: '1.25rem',
                                                    color: '#1f2937'
                                                }}>
                                                    {enrollment.course?.title || 'Курс без названия'}
                                                </h3>
                                                <p style={{
                                                    margin: 0,
                                                    color: '#6b7280',
                                                    fontSize: '0.95rem',
                                                    lineHeight: 1.4
                                                }}>
                                                    {enrollment.course?.description || 'Описание курса отсутствует'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        background: enrollment.status === 'active' ? '#10b981' :
                                            enrollment.status === 'completed' ? '#3b82f6' : '#6b7280',
                                        color: 'white',
                                        borderRadius: '1rem',
                                        fontSize: '0.8rem',
                                        fontWeight: '500',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {enrollment.status === 'active' ? 'Активен' :
                                            enrollment.status === 'completed' ? 'Завершен' : 'Неизвестен'}
                                    </span>
                                </div>

                                {/* Прогресс */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.9rem',
                                        color: '#4b5563'
                                    }}>
                                        <span>Прогресс обучения</span>
                                        <span><strong>{getCourseProgress(enrollment.course?.id)}%</strong></span>
                                    </div>
                                    <div style={{
                                        height: '8px',
                                        background: '#e5e7eb',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <div
                                            style={{
                                                width: `${getCourseProgress(enrollment.course?.id)}%`,
                                                height: '100%',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                borderRadius: '4px',
                                                transition: 'width 0.3s ease'
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Информация о курсе */}
                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    marginBottom: '1.5rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        color: '#6b7280'
                                    }}>
                                        <span>🎯</span>
                                        <span>{enrollment.course?.level || 'Любой уровень'}</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        color: '#6b7280'
                                    }}>
                                        <span>⏱️</span>
                                        <span>{enrollment.course?.duration || 'Не указано'}</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        color: '#6b7280'
                                    }}>
                                        <span>💰</span>
                                        <span>{enrollment.course?.price ? `${enrollment.course.price} ₽/мес` : 'Бесплатно'}</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        color: '#6b7280'
                                    }}>
                                        <span>📅</span>
                                        <span>Записан: {new Date(enrollment.enrolled_at).toLocaleDateString('ru-RU')}</span>
                                    </div>
                                </div>

                                {/* Кнопка действий */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Link
                                        to={`/courses/${enrollment.course?.id}`}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            textDecoration: 'none',
                                            borderRadius: '6px',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        {enrollment.status === 'active' ? 'Продолжить обучение →' : 'Посмотреть →'}
                                    </Link>
                                </div>

                                {/* ID для отладки */}
                                <div style={{
                                    marginTop: '0.5rem',
                                    fontSize: '0.7rem',
                                    color: '#d1d5db',
                                    textAlign: 'right'
                                }}>
                                    ID: {enrollment.course?.id} | Запись: {enrollment.id}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Информация о данных */}
                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.85rem',
                        color: '#6b7280'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span>ℹ️</span>
                            <span style={{ fontWeight: '500' }}>Информация:</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <span>Курсов загружено: <strong>{courses.length}</strong></span>
                            <span>Источник: <strong>API + localStorage</strong></span>
                            <span>Время: <strong>{new Date().toLocaleTimeString()}</strong></span>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default MyCourses;