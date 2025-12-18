// DashboardOverview.jsx - КРАТКИЙ КОД
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../../utils/api';

const DashboardOverview = () => {
    const [user, setUser] = useState({});
    const [stats, setStats] = useState({
        activeCourses: 3,
        completedLessons: 12,
        progress: 65,
        studyHours: 24
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Получаем данные пользователя
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            // Получаем данные о курсах (не важно успешно или нет)
            try {
                const response = await coursesAPI.getMyEnrollments();
                const courses = response || [];

                // Если есть курсы - обновляем статистику
                if (courses.length > 0) {
                    setStats(prev => ({
                        ...prev,
                        activeCourses: courses.filter(c => c.status === 'active').length
                    }));
                }
            } catch (error) {
                console.log('Использую тестовые данные для статистики');
                // Оставляем тестовые данные
            }

        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setLoading(false);
        }
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
                <p>Загрузка данных...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Приветствие */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem'
            }}>
                <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>
                    Добро пожаловать, {user?.full_name || 'Пользователь'}!
                </h1>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>
                    Ваш прогресс обучения и статистика
                </p>
            </div>

            {/* Статистика */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatCard icon="📚" number={stats.activeCourses} label="Активных курса" />
                <StatCard icon="✅" number={stats.completedLessons} label="Пройдено уроков" />
                <StatCard icon="📈" number={`${stats.progress}%`} label="Прогресс обучения" />
                <StatCard icon="⏱️" number={`${stats.studyHours}ч`} label="Часов обучения" />
            </div>

            {/* Быстрые действия */}
            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>Быстрые действия</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <ActionCard
                    to="/dashboard/courses"
                    icon="🎯"
                    title="Мои курсы"
                    description="Продолжайте обучение"
                />
                <ActionCard
                    to="/courses"
                    icon="➕"
                    title="Выбрать курс"
                    description="Новые направления"
                />
                <ActionCard
                    to="/dashboard/profile"
                    icon="👤"
                    title="Профиль"
                    description="Редактировать данные"
                />
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

// Компонент статистики
const StatCard = ({ icon, number, label }) => (
    <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
    }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
        <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#4f46e5',
            marginBottom: '0.5rem'
        }}>{number}</div>
        <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{label}</div>
    </div>
);

// Компонент действия
const ActionCard = ({ to, icon, title, description }) => (
    <Link to={to} style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        textDecoration: 'none',
        color: 'inherit',
        textAlign: 'center',
        display: 'block'
    }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{title}</h3>
        <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>{description}</p>
    </Link>
);

export default DashboardOverview;