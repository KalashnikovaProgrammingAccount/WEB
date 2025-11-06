import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-content">
                {/* Заменяем div на Link для логотипа */}
                <Link to="/" className="logo" style={{textDecoration: 'none'}}>
                    ОГЭПрофи
                </Link>
                <nav className="navigation">
                    <button
                        className="nav-button"
                        onClick={() => navigate('/about')}
                    >
                        о школе
                    </button>
                    <button
                        className="nav-button"
                        onClick={() => navigate('/courses')}
                    >
                        о курсах
                    </button>
                    <button
                        className="nav-button"
                        onClick={() => navigate('/pricing')}
                    >
                        тарифы
                    </button>
                    <button
                        className="nav-button"
                        onClick={() => navigate('/oge')}
                    >
                        ОГЭ
                    </button>
                    <button
                        className="nav-button nav-button-primary"
                        onClick={() => navigate('/signup')}
                    >
                        записаться
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;