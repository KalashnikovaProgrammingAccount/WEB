import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const navigate = useNavigate();

    return (
        <main className="main">
            <div className="page-content">
                <h1>Тарифы</h1>
                <div className="pricing-cards">
                    <div className="price-card">
                        <h3>Базовый</h3>
                        <p className="price">5000₽/мес</p>
                        <button
                            className="button button-primary"
                            onClick={() => navigate('/signup')}
                        >
                            Выбрать
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Pricing;