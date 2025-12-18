import React from 'react';

const AboutSchool = () => {
    return (
        <div className="info-container" style={{ paddingTop: '80px' }}>
            <div className="info-content">
                {/* Заголовок с анимацией */}
                <div className="info-header">
                    <div style={{
                        background: 'linear-gradient(135deg, #1a237e 0%, #4527a0 100%)', // Более темные цвета
                        padding: '3rem 2rem',
                        borderRadius: '20px',
                        color: 'white',
                        textAlign: 'center',
                        marginBottom: '4rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-50px',
                            right: '-50px',
                            width: '200px',
                            height: '200px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '50%'
                        }}></div>
                        <div style={{
                            position: 'absolute',
                            bottom: '-30px',
                            left: '-30px',
                            width: '150px',
                            height: '150px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '50%'
                        }}></div>

                        <h1 className="info-title" style={{
                            color: 'white',
                            marginBottom: '1rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)' // Добавляем тень для лучшей читаемости
                        }}>
                            🎓 О нашей школе
                        </h1>
                        <p className="info-subtitle" style={{
                            color: 'rgba(255,255,255,0.95)', // Более контрастный белый
                            fontSize: '1.3rem',
                            fontWeight: '500'
                        }}>
                            <strong>ОГЭМастер</strong> - там, где обычная подготовка превращается в уверенность на 100%!
                            С 2018 года мы помогаем школьникам покорять вершины знаний 🚀
                        </p>
                    </div>
                </div>

                {/* Основная информация с иконкой */}
                <div className="info-section" style={{position: 'relative'}}>
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '30px',
                        background: '#0d47a1', // Более темный синий
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '25px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(13, 71, 161, 0.3)'
                    }}>
                        💫 Наша философия
                    </div>
                    <h2 style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '2rem',
                        color: '#1a237e' // Темно-синий для лучшего контраста
                    }}>
                        <span style={{
                            background: 'linear-gradient(135deg, #0d47a1 0%, #4527a0 100%)', // Более контрастный градиент
                            padding: '0.5rem',
                            borderRadius: '12px',
                            fontSize: '2rem'
                        }}>🎯</span>
                        Наша миссия
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        lineHeight: '1.8',
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                        padding: '2rem',
                        borderRadius: '15px',
                        borderLeft: '5px solid #0d47a1', // Более темный акцент
                        color: '#2d3748', // Темно-серый для лучшей читаемости
                        fontWeight: '500'
                    }}>
                        <strong style={{color: '#0d47a1'}}>Мы не просто "натаскиваем" на экзамены</strong> — мы зажигаем искру интереса к учебе!
                        Наша цель — превратить подготовку к ОГЭ в увлекательное путешествие, где каждый ученик:
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                        marginTop: '2rem'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                            border: '2px solid #e2e8f0',
                            transition: 'transform 0.3s ease',
                            borderTop: '4px solid #0d47a1' // Контрастная верхняя граница
                        }}>
                            <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🧠</div>
                            <h4 style={{color: '#0d47a1', marginBottom: '0.5rem', fontWeight: '600'}}>Понимает предмет</h4>
                            <p style={{color: '#4a5568', fontSize: '0.9rem'}}>А не просто заучивает формулы</p>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                            border: '2px solid #e2e8f0',
                            transition: 'transform 0.3s ease',
                            borderTop: '4px solid #c53030' // Красный для контраста
                        }}>
                            <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>❤️</div>
                            <h4 style={{color: '#c53030', marginBottom: '0.5rem', fontWeight: '600'}}>Любит учиться</h4>
                            <p style={{color: '#4a5568', fontSize: '0.9rem'}}>Находит радость в получении знаний</p>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                            border: '2px solid #e2e8f0',
                            transition: 'transform 0.3s ease',
                            borderTop: '4px solid #2d3748' // Темно-серый для контраста
                        }}>
                            <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🎯</div>
                            <h4 style={{color: '#2d3748', marginBottom: '0.5rem', fontWeight: '600'}}>Достигает целей</h4>
                            <p style={{color: '#4a5568', fontSize: '0.9rem'}}>Уверенно идет к своим мечтам</p>
                        </div>
                    </div>

                    {/* Статистика в стиле инфографики - УЛУЧШЕННАЯ КОНТРАСТНОСТЬ */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1a237e 0%, #4527a0 100%)', // Более темные цвета
                        padding: '3rem 2rem',
                        borderRadius: '20px',
                        marginTop: '3rem',
                        color: 'white',
                        textAlign: 'center',
                        boxShadow: '0 10px 30px rgba(26, 35, 126, 0.3)'
                    }}>
                        <h3 style={{
                            marginBottom: '2rem',
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                        }}>
                            📊 Наши результаты говорят сами за себя:
                        </h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-number" style={{
                                    fontSize: '3.5rem',
                                    fontWeight: '800',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                    color: '#ffd54f' // Яркий желтый для контраста
                                }}>1000+</div>
                                <div className="stat-label" style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '500',
                                    color: 'rgba(255,255,255,0.95)'
                                }}>Счастливых выпускников</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number" style={{
                                    fontSize: '3.5rem',
                                    fontWeight: '800',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                    color: '#4fc3f7' // Яркий голубой для контраста
                                }}>94%</div>
                                <div className="stat-label" style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '500',
                                    color: 'rgba(255,255,255,0.95)'
                                }}>Успешной сдачи на 4 и 5</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number" style={{
                                    fontSize: '3.5rem',
                                    fontWeight: '800',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                    color: '#81c784' // Яркий зеленый для контраста
                                }}>5+</div>
                                <div className="stat-label" style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '500',
                                    color: 'rgba(255,255,255,0.95)'
                                }}>Лет безупречной работы</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number" style={{
                                    fontSize: '3.5rem',
                                    fontWeight: '800',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                    color: '#ff8a65' // Яркий оранжевый для контраста
                                }}>15+</div>
                                <div className="stat-label" style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '500',
                                    color: 'rgba(255,255,255,0.95)'
                                }}>Звездных преподавателей</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Наша команда с улучшенной контрастностью */}
                <div className="info-section">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '2rem',
                        padding: '1rem 1.5rem',
                        background: 'linear-gradient(135deg, #1a237e 0%, #4527a0 100%)', // Темный градиент
                        borderRadius: '12px',
                        color: 'white'
                    }}>
                        <span style={{fontSize: '2.5rem'}}>👨‍🏫</span>
                        <div>
                            <h2 style={{margin: 0, color: 'white'}}>Наша команда</h2>
                            <p style={{margin: 0, color: 'rgba(255,255,255,0.9)'}}>Профессионалы, которые горят своим делом</p>
                        </div>
                    </div>

                    <p style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.7',
                        marginBottom: '2rem',
                        color: '#2d3748', // Темный цвет для текста
                        fontWeight: '500'
                    }}>
                        Наши преподаватели — это не просто специалисты с дипломами. Это <strong style={{color: '#1a237e'}}>настоящие мастера своего дела</strong>,
                        которые умеют превращать сложные темы в увлекательные истории и находить ключик к сердцу каждого ученика!
                    </p>

                    <div className="tips-grid">
                        <div className="tip-card" style={{
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                            border: '2px solid #0d47a1' // Контрастная граница
                        }}>
                            <div className="tip-icon" style={{fontSize: '3rem', color: '#0d47a1'}}>🎓</div>
                            <h4 style={{color: '#0d47a1'}}>Сертифицированные педагоги</h4>
                            <p style={{color: '#2d3748'}}>Дипломы ведущих вузов + постоянное повышение квалификации = гарантия качества</p>
                        </div>
                        <div className="tip-card" style={{
                            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                            border: '2px solid #7b1fa2' // Контрастная граница
                        }}>
                            <div className="tip-icon" style={{fontSize: '3rem', color: '#7b1fa2'}}>💡</div>
                            <h4 style={{color: '#7b1fa2'}}>Авторские методики</h4>
                            <p style={{color: '#2d3748'}}>Уникальные разработки, проверенные временем и тысячами успешных учеников</p>
                        </div>
                        <div className="tip-card" style={{
                            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                            border: '2px solid #2e7d32' // Контрастная граница
                        }}>
                            <div className="tip-icon" style={{fontSize: '3rem', color: '#2e7d32'}}>🤝</div>
                            <h4 style={{color: '#2e7d32'}}>Индивидуальный подход</h4>
                            <p style={{color: '#2d3748'}}>Находим подход к каждому — от вундеркиндов до тех, кто "не дружит" с предметом</p>
                        </div>
                        <div className="tip-card" style={{
                            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                            border: '2px solid #ef6c00' // Контрастная граница
                        }}>
                            <div className="tip-icon" style={{fontSize: '3rem', color: '#ef6c00'}}>📊</div>
                            <h4 style={{color: '#ef6c00'}}>Прозрачная отчетность</h4>
                            <p style={{color: '#2d3748'}}>Родители всегда в курсе успехов: от первых шагов до триумфальной сдачи ОГЭ</p>
                        </div>
                    </div>
                </div>

                {/* CTA секция с улучшенной контрастностью */}
                <div style={{
                    background: 'linear-gradient(135deg, #1a237e 0%, #4527a0 100%)', // Темный градиент
                    color: 'white',
                    padding: '4rem 3rem',
                    borderRadius: '25px',
                    textAlign: 'center',
                    marginTop: '4rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 15px 35px rgba(26, 35, 126, 0.4)'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-100px',
                        width: '300px',
                        height: '300px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        bottom: '-50px',
                        left: '-50px',
                        width: '200px',
                        height: '200px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%'
                    }}></div>

                    <h2 style={{
                        fontSize: '2.8rem',
                        fontWeight: 'bold',
                        marginBottom: '1.5rem',
                        position: 'relative',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        Готовы начать путешествие к успеху? 🚀
                    </h2>
                    <p style={{
                        fontSize: '1.3rem',
                        marginBottom: '2.5rem',
                        opacity: '0.95', // Более контрастный
                        position: 'relative',
                        fontWeight: '500'
                    }}>
                        Присоединяйтесь к тысячам учеников, которые уже доказали: с ОГЭМастер невозможное становится возможным!
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        position: 'relative'
                    }}>
                        <button
                            className="button button-primary button-large"
                            onClick={() => window.location.href = '/signup'}
                            style={{
                                background: '#ff6b6b',
                                border: 'none',
                                fontSize: '1.2rem',
                                padding: '1.2rem 2.5rem',
                                fontWeight: '600',
                                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
                            }}
                        >
                            🎯 Начать бесплатный урок
                        </button>
                        <button
                            className="button button-secondary button-large"
                            onClick={() => window.location.href = '/courses'}
                            style={{
                                background: 'transparent',
                                border: '3px solid white', // Более толстая граница
                                fontSize: '1.2rem',
                                padding: '1.2rem 2.5rem',
                                fontWeight: '600',
                                color: 'white'
                            }}
                        >
                            📚 Узнать о курсах
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutSchool;


