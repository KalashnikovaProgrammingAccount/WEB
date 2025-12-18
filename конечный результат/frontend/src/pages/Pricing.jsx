import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const Pricing = () => {
    const navigate = useNavigate();
    const sectionRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        sectionRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const addToRefs = (el) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };

    const plans = [
        {
            name: "Базовый",
            price: "5000",
            period: "месяц",
            description: "Для уверенного старта подготовки",
            features: [
                "8 занятий в месяц",
                "Домашние задания",
                "Проверка работ",
                "Доступ к материалам",
                "Чат с преподавателем"
            ],
            popular: false
        },
        {
            name: "Оптимальный",
            price: "8000",
            period: "месяц",
            description: "Самый популярный вариант",
            features: [
                "12 занятий в месяц",
                "Индивидуальный план",
                "Промежуточные тесты",
                "Разбор ошибок",
                "Приоритетная поддержка",
                "Пробный экзамен"
            ],
            popular: true
        },
        {
            name: "Премиум",
            price: "12000",
            period: "месяц",
            description: "Максимальный результат",
            features: [
                "16 занятий в месяц",
                "Персональный куратор",
                "Еженедельные консультации",
                "Расширенная аналитика",
                "Гарантия результата",
                "Все материалы курса",
                "Поддержка 24/7"
            ],
            popular: false
        }
    ];

    return (
        <main className="main">
            <div className="page-content">
                <div className="page-header" ref={addToRefs}>
                    <h1>Выберите тариф</h1>
                    <p className="page-subtitle">Подберите подходящий вариант подготовки для достижения ваших целей</p>
                </div>

                <div className="pricing-cards">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.name}
                            className={`price-card ${plan.popular ? 'popular' : ''}`}
                            ref={addToRefs}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {plan.popular && <div className="popular-badge">Популярный</div>}

                            <div className="card-content">
                                <div className="card-top">
                                    <div className="plan-header">
                                        <h3>{plan.name}</h3>
                                        <p className="plan-description">{plan.description}</p>
                                    </div>

                                    <div className="plan-price">
                                        <span className="price-amount">{plan.price}₽</span>
                                        <span className="price-period">/{plan.period}</span>
                                    </div>

                                    <ul className="plan-features">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="feature-item">
                                                <span className="feature-icon">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="card-bottom">
                                    <button
                                        className={`button ${plan.popular ? 'button-primary' : 'button-secondary'} plan-button`}
                                        onClick={() => navigate('/signup')}
                                    >
                                        Выбрать тариф
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pricing-info" ref={addToRefs}>
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-icon">💳</div>
                            <h4>Оплата частями</h4>
                            <p>Возможность разделить оплату на 2-3 части без переплат</p>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">↩️</div>
                            <h4>Возврат средств</h4>
                            <p>Вернем деньги если результат не устроит после 4-х занятий</p>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">🎁</div>
                            <h4>Пробный урок</h4>
                            <p>Бесплатное первое занятие для знакомства с форматом</p>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📚</div>
                            <h4>Все материалы</h4>
                            <p>Полный доступ ко всем учебным материалам и записям</p>
                        </div>
                    </div>
                </div>

                <div className="faq-section" ref={addToRefs}>
                    <h2>Частые вопросы</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4>Можно ли поменять тариф в процессе обучения?</h4>
                            <p>Да, вы можете перейти на другой тариф в любой момент. Разница в стоимости будет пересчитана.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Что входит в стоимость занятий?</h4>
                            <p>Все материалы, проверка домашних заданий, поддержка преподавателя и доступ к платформе.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Как проходят занятия?</h4>
                            <p>Онлайн на нашей платформе с интерактивной доской, видео и чатом.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Есть ли скидки?</h4>
                            <p>Да, предусмотрены скидки при оплате за несколько месяцев и для братьев/сестер.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Pricing;
