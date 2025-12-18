import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = ({ isAuthenticated, setIsAuthenticated }) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
    };

    return (
        <div className="layout">
            {/* Шапка */}
            <header className="header">
                <div className="header-content">
                    <Link to="/" className="logo">
                        🎯 OGE Master
                    </Link>

                    <nav className="navigation">
                        <Link to="/" className="nav-link">Главная</Link>
                        <Link to="/courses" className="nav-link">Курсы</Link>
                        <Link to="/about" className="nav-link">О школе</Link>
                        <Link to="/oge-info" className="nav-link">Об ОГЭ</Link>
                        <Link to="/pricing" className="nav-link">Тарифы</Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="nav-link nav-button-primary">
                                    Личный кабинет
                                </Link>
                                <button onClick={handleLogout} className="nav-link logout-button">
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link">Войти</Link>
                                <Link to="/signup" className="nav-link nav-button-primary">
                                    Начать обучение
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Основное содержимое */}
            <main className="main">
                <Outlet />
            </main>

            {/* Подвал */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>OGE Master</h3>
                        <p>Подготовка к ОГЭ онлайн</p>
                    </div>
                    <div className="footer-section">
                        <h4>Контакты</h4>
                        <p>Email: info@ogemaster.ru</p>
                        <p>Телефон: +7 (XXX) XXX-XX-XX</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 OGE Master. Все права защищены.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;