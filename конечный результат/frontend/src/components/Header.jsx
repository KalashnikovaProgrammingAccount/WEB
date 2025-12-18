
// Header.jsx (добавьте эти изменения)
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ... остальной код такой же как у вас ...

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="logo-icon">🎯</span>
                    ОГЭМастер
                </Link>

                <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link
                        to="/"
                        className="nav-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Главная
                    </Link>
                    <Link
                        to="/about"
                        className="nav-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        О школе
                    </Link>
                    <Link
                        to="/courses"
                        className="nav-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Курсы
                    </Link>
                    <Link
                        to="/pricing"
                        className="nav-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Цены
                    </Link>
                    <Link
                        to="/oge"
                        className="nav-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        ОГЭ Инфо
                    </Link>
                </div>

                <div className="auth-section">
                    {user ? (
                        <div className="user-menu">
                            <Link
                                to="/dashboard"
                                className="user-greeting"
                                style={{textDecoration: 'none', color: 'inherit'}}
                            >
                                👤 {user.full_name || user.email}
                            </Link>
                            <button
                                onClick={onLogout}
                                className="logout-btn"
                            >
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button
                                className="auth-btn login-btn"
                                onClick={() => navigate('/login')}
                            >
                                Войти
                            </button>
                            <button
                                className="auth-btn signup-btn"
                                onClick={() => navigate('/signup')}
                            >
                                Регистрация
                            </button>
                        </div>
                    )}
                </div>

                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Меню"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    );
};

export default Header;