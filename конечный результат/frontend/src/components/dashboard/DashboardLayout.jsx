// DashboardLayout.jsx
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            display: 'flex',
            // Добавляем отступ для Header
            paddingTop: '80px' // Высота вашего хедера
        }}>
            {/* Боковая панель */}
            <aside style={{
                width: '250px',
                background: 'white',
                borderRight: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 1rem',
                height: 'calc(100vh - 80px)', // Учитываем высоту хедера
                position: 'fixed', // Делаем фиксированной
                left: 0,
                top: '80px', // Располагаем под хедером
                zIndex: 50
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                            fontWeight: 'bold'
                        }}>
                            {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>{user?.full_name || 'Пользователь'}</h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#666' }}>{user?.email}</p>
                        </div>
                    </div>
                </div>

                <nav style={{ flex: 1 }}>
                    <Link to="/dashboard" style={navLinkStyle}>
                        📊 Обзор
                    </Link>
                    <Link to="/dashboard/courses" style={navLinkStyle}>
                        📚 Мои курсы
                    </Link>
                    <Link to="/dashboard/progress" style={navLinkStyle}>
                        📈 Прогресс
                    </Link>
                    <Link to="/dashboard/profile" style={navLinkStyle}>
                        👤 Профиль
                    </Link>
                    <Link to="/dashboard/settings" style={navLinkStyle}>
                        ⚙️ Настройки
                    </Link>
                </nav>

                <div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.95rem'
                        }}
                    >
                        🚪 Выйти
                    </button>
                </div>
            </aside>

            {/* Основное содержимое - добавляем отступ слева для сайдбара */}
            <main style={{
                flex: 1,
                marginLeft: '250px', // Отступ для фиксированного сайдбара
                padding: '2rem',
                minHeight: 'calc(100vh - 80px)' // Учитываем высоту хедера
            }}>
                <Outlet />
            </main>
        </div>
    );
};

const navLinkStyle = {
    display: 'block',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    color: '#4b5563',
    borderRadius: '6px',
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease'
};

export default DashboardLayout;