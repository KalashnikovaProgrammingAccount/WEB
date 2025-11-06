import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <main className="main">
            {/* Герой секция */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 0'
            }}>
                <div className="main-content">
                    <h1 className="hero-title">
                        Хочешь подготовиться к экзаменам?<br />Тогда тебе ко мне!
                    </h1>
                    <p className="hero-description">
                        Профессиональная подготовка к ОГЭ на 5 в 2025/2026 учебном году.
                    </p>
                    <div className="hero-buttons">
                        <button
                            className="button button-primary"
                            onClick={() => navigate('/signup')}
                        >
                            🚀 Записаться
                        </button>
                        <button
                            className="button button-secondary"
                            onClick={() => navigate('/courses')}
                        >
                            📚 О курсах
                        </button>
                        <button
                            className="button button-secondary"
                            onClick={() => navigate('/pricing')}
                        >
                            💰 Тарифы
                        </button>
                    </div>
                </div>
            </section>

            {/* Преимущества - простая версия */}
            <section style={{
                padding: '5rem 0',
                background: 'rgba(248, 250, 255, 0.8)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px'
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '3rem',
                        color: '#2c3e50'
                    }}>
                        Почему выбирают нас?
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '2.5rem 2rem',
                            borderRadius: '20px',
                            textAlign: 'center',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease'
                        }}>
                            <div style={{fontSize: '3rem', marginBottom: '1.5rem'}}>🎯</div>
                            <h3 style={{
                                fontSize: '1.3rem',
                                marginBottom: '1rem',
                                color: '#2c3e50'
                            }}>Подготовка по математике</h3>
                            <p style={{color: '#666', lineHeight: '1.6'}}>
                                Полный охват школьной программы с углубленной проработкой сложных тем
                            </p>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '2.5rem 2rem',
                            borderRadius: '20px',
                            textAlign: 'center',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease'
                        }}>
                            <div style={{fontSize: '3rem', marginBottom: '1.5rem'}}>👨‍🏫</div>
                            <h3 style={{
                                fontSize: '1.3rem',
                                marginBottom: '1rem',
                                color: '#2c3e50'
                            }}>Опытные преподаватели</h3>
                            <p style={{color: '#666', lineHeight: '1.6'}}>
                                Профессионалы с многолетним стажем и авторскими методиками обучения
                            </p>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '2.5rem 2rem',
                            borderRadius: '20px',
                            textAlign: 'center',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease'
                        }}>
                            <div style={{fontSize: '3rem', marginBottom: '1.5rem'}}>⏰</div>
                            <h3 style={{
                                fontSize: '1.3rem',
                                marginBottom: '1rem',
                                color: '#2c3e50'
                            }}>Гибкое расписание</h3>
                            <p style={{color: '#666', lineHeight: '1.6'}}>
                                Занимайся в удобное время онлайн или оффлайн с персональным графиком
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Статистика - простая версия */}
            <section style={{
                padding: '5rem 0',
                background: 'linear-gradient(135deg, #ff6b9d 0%, #9d4dff 100%)',
                color: 'white'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px'
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '3rem',
                        color: 'white'
                    }}>
                        Наши результаты
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem'
                    }}>
                        <div style={{textAlign: 'center', padding: '2rem'}}>
                            <div style={{
                                fontSize: '3rem',
                                fontWeight: '800',
                                marginBottom: '0.5rem'
                            }}>1000+</div>
                            <div style={{fontSize: '1.1rem', opacity: '0.9'}}>Учеников подготовлено</div>
                        </div>
                        <div style={{textAlign: 'center', padding: '2rem'}}>
                            <div style={{
                                fontSize: '3rem',
                                fontWeight: '800',
                                marginBottom: '0.5rem'
                            }}>94%</div>
                            <div style={{fontSize: '1.1rem', opacity: '0.9'}}>Сдали на 4 и 5</div>
                        </div>
                        <div style={{textAlign: 'center', padding: '2rem'}}>
                            <div style={{
                                fontSize: '3rem',
                                fontWeight: '800',
                                marginBottom: '0.5rem'
                            }}>5+</div>
                            <div style={{fontSize: '1.1rem', opacity: '0.9'}}>Лет опыта</div>
                        </div>
                        <div style={{textAlign: 'center', padding: '2rem'}}>
                            <div style={{
                                fontSize: '3rem',
                                fontWeight: '800',
                                marginBottom: '0.5rem'
                            }}>100%</div>
                            <div style={{fontSize: '1.1rem', opacity: '0.9'}}>Гарантия качества</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA секция - простая версия */}
            <section style={{
                padding: '5rem 0',
                background: 'linear-gradient(135deg, #4d8aff 0%, #6be2ff 100%)',
                textAlign: 'center',
                color: 'white'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px'
                }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        marginBottom: '1.5rem'
                    }}>
                        Готовы начать подготовку?
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        marginBottom: '2.5rem',
                        opacity: '0.9'
                    }}>
                        Запишись на пробный урок и убедись в качестве нашего обучения!
                    </p>
                    <button
                        style={{
                            padding: '18px 45px',
                            background: 'linear-gradient(135deg, #ff6b9d 0%, #9d4dff 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            minWidth: '300px'
                        }}
                        onClick={() => navigate('/signup')}
                    >
                        🎯 Записаться на пробный урок
                    </button>
                </div>
            </section>
        </main>
    );
};

export default Home;