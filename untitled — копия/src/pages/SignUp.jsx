import React from 'react';

const SignUp = () => {
    return (
        <main className="main">
            <div className="page-content">
                <h1>Записаться на курс</h1>
                <form className="signup-form">
                    <input type="text" placeholder="Имя" />
                    <input type="tel" placeholder="Телефон" />
                    <input type="email" placeholder="Email" />
                    <select>
                        <option>Выберите курс</option>
                        <option>Математика ОГЭ</option>
                    </select>
                    <button type="submit" className="button button-primary">
                        Отправить заявку
                    </button>
                </form>
            </div>
        </main>
    );
};

export default SignUp;