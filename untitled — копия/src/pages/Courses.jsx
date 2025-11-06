import React from 'react';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
    const navigate = useNavigate();

    return (
        <main className="main">
            <div className="page-content">
                <h1>Наши курсы</h1>
                <div className="courses-grid">
                    <div className="course-card">
                        <h3>Математика ОГЭ</h3>
                        <p>Полная подготовка к экзамену по математике</p>
                        <button
                            className="button button-primary"
                            onClick={() => navigate('/signup')}
                        >
                            Записаться
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Courses;