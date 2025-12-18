import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={{ paddingTop: '80px' }}>
            {/* Верхняя навигация */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                background: 'white',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#4f46e5',
                    textDecoration: 'none',
                    cursor: 'pointer'
                }} onClick={() => navigate('/')}>
                    🎯 OGE Master
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {isAuthenticated ? (
                        <>
                            <span style={{ color: '#4b5563', fontSize: '0.9rem' }}>
                                Привет, {user?.full_name || 'Пользователь'}!
                            </span>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    background: '#4f46e5',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                📊 Личный кабинет
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#fef2f2',
                                    color: '#dc2626',
                                    border: '1px solid #fecaca',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'none',
                                    color: '#4b5563',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Войти
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    background: '#4f46e5',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Начать обучение
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Герой секция */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        marginBottom: '1.5rem'
                    }}>
                        {isAuthenticated ? (
                            <>
                                Добро пожаловать в OGE Master!
                                <div style={{ fontSize: '1.5rem', marginTop: '1rem', opacity: 0.9 }}>
                                    Перейдите в личный кабинет для продолжения обучения
                                </div>
                            </>
                        ) : (
                            'Хочешь подготовиться к экзаменам на отлично?'
                        )}
                    </h1>

                    {!isAuthenticated && (
                        <p style={{
                            fontSize: '1.25rem',
                            marginBottom: '2.5rem',
                            maxWidth: '600px',
                            margin: '0 auto 2.5rem'
                        }}>
                            Профессиональная подготовка к ОГЭ 2025/2026 с гарантией результата.
                            94% наших учеников сдают на 4 и 5!
                        </p>
                    )}

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '3rem'
                    }}>
                        {isAuthenticated ? (
                            <button
                                style={{
                                    padding: '1rem 2rem',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                                onClick={() => navigate('/dashboard')}
                            >
                                📊 Перейти в личный кабинет
                            </button>
                        ) : (
                            <>
                                <button
                                    style={{
                                        padding: '1rem 2rem',
                                        background: '#ff6b6b',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate('/signup')}
                                >
                                    🚀 Начать обучение
                                </button>
                                <button
                                    style={{
                                        padding: '1rem 2rem',
                                        background: 'transparent',
                                        color: 'white',
                                        border: '2px solid white',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate('/courses')}
                                >
                                    📚 Бесплатный урок
                                </button>
                            </>
                        )}
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '3rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>1000+</div>
                            <div>учеников</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>94%</div>
                            <div>успешной сдачи</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>5+</div>
                            <div>лет опыта</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Преимущества - показываем только если не авторизован */}
            {!isAuthenticated && (
                <>
                    {/* Преимущества */}
                    <section style={{
                        padding: '5rem 2rem',
                        background: '#f8f9fa'
                    }}>
                        <div style={{
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            <h2 style={{
                                textAlign: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                marginBottom: '3rem'
                            }}>
                                Почему выбирают ОГЭМастер?
                            </h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '2rem'
                            }}>
                                <div style={{
                                    background: 'white',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Персональный подход</h3>
                                    <p>Индивидуальная программа для каждого ученика</p>
                                </div>
                                <div style={{
                                    background: 'white',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Авторские методики</h3>
                                    <p>Уникальные материалы и технологии обучения</p>
                                </div>
                                <div style={{
                                    background: 'white',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Интенсивная подготовка</h3>
                                    <p>Максимум результата за минимальное время</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Процесс обучения */}
                    <section style={{
                        padding: '5rem 2rem',
                        background: 'white'
                    }}>
                        <div style={{
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            <h2 style={{
                                textAlign: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                marginBottom: '3rem'
                            }}>
                                Как проходит обучение?
                            </h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '2rem'
                            }}>
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        margin: '0 auto 1.5rem'
                                    }}>1</div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Диагностика уровня</h3>
                                    <p>Определяем текущие знания и цели</p>
                                </div>
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        margin: '0 auto 1.5rem'
                                    }}>2</div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Индивидуальный план</h3>
                                    <p>Разрабатываем программу подготовки</p>
                                </div>
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        margin: '0 auto 1.5rem'
                                    }}>3</div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Регулярные занятия</h3>
                                    <p>Систематические уроки с практикой</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Отзывы учеников */}
                    <section style={{
                        padding: '5rem 2rem',
                        background: '#f8f9fa'
                    }}>
                        <div style={{
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            <h2 style={{
                                textAlign: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                marginBottom: '3rem'
                            }}>
                                Отзывы учеников
                            </h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '2rem'
                            }}>
                                <div style={{
                                    background: 'white',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <p style={{ fontStyle: 'italic', marginBottom: '1.5rem' }}>
                                        "За 4 месяца подготовки с нуля сдал математику на 5! Преподаватель объясняет очень доступно."
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold'
                                        }}>А</div>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>Александр Иванов</div>
                                            <div style={{ color: '#10b981' }}>ОГЭ по математике: 5</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    background: 'white',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <p style={{ fontStyle: 'italic', marginBottom: '1.5rem' }}>
                                        "Боялась математики, но здесь смогла разобраться во всех темах. Спасибо за терпение!"
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold'
                                        }}>М</div>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>Мария Петрова</div>
                                            <div style={{ color: '#10b981' }}>ОГЭ по математике: 4</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA секция */}
                    <section style={{
                        padding: '5rem 2rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}>
                            <h2 style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                marginBottom: '1.5rem'
                            }}>
                                Готовы к успешной сдаче ОГЭ?
                            </h2>
                            <p style={{
                                fontSize: '1.25rem',
                                marginBottom: '2.5rem'
                            }}>
                                Начните подготовку сегодня и получите бесплатную консультацию
                            </p>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                marginBottom: '2rem'
                            }}>
                                <button
                                    style={{
                                        padding: '1rem 2rem',
                                        background: '#ff6b6b',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate('/signup')}
                                >
                                    🎯 Записаться на пробный урок
                                </button>
                                <button
                                    style={{
                                        padding: '1rem 2rem',
                                        background: 'transparent',
                                        color: 'white',
                                        border: '2px solid white',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate('/courses')}
                                >
                                    📞 Получить консультацию
                                </button>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '2rem',
                                flexWrap: 'wrap'
                            }}>
                                <div>✅ Гарантия результата</div>
                                <div>✅ Персональный куратор</div>
                                <div>✅ Возврат средств</div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default Home;