// import React, { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import './Forms.css';
//
// const LoginForm = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//
//     const { login } = useAuth();
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//
//         const result = await login(email, password);
//         if (!result.success) {
//             setError(result.error);
//         }
//         setLoading(false);
//     };
//
//     return (
//         <form onSubmit={handleSubmit} className="auth-form">
//             <h2>Вход в аккаунт</h2>
//
//             {error && <div className="error-message">{error}</div>}
//
//             <div className="form-group">
//                 <label htmlFor="email">Email:</label>
//                 <input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     placeholder="Введите ваш email"
//                 />
//             </div>
//
//             <div className="form-group">
//                 <label htmlFor="password">Пароль:</label>
//                 <input
//                     id="password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     placeholder="Введите ваш пароль"
//                 />
//             </div>
//
//             <button type="submit" disabled={loading} className="auth-button">
//                 {loading ? 'Вход...' : 'Войти'}
//             </button>
//         </form>
//     );
// };
//
// export default LoginForm;

// LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Forms.css';

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        console.log('🔄 Попытка входа...');

        try {
            const result = await login(email, password);

            console.log('📥 Ответ от сервера:', result);

            if (!result.success) {
                console.error('❌ Ошибка входа:', result.error);
                setError(result.error);
                setLoading(false);
            } else {
                console.log('✅ Вход успешный!');
                // Редирект произойдет автоматически через ProtectedRoute в Router.jsx
            }
        } catch (error) {
            console.error('❌ Неожиданная ошибка:', error);
            setError('Произошла ошибка при входе');
            setLoading(false);
        }
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
            <div style={{ height: '80px' }}></div>

            <div style={{
                maxWidth: '500px',
                margin: '0 auto',
                padding: '2rem',
                marginTop: '-80px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Вход
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
                        Войдите в свой аккаунт для доступа к курсам
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{
                    background: 'white',
                    padding: '2.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}>
                    {error && (
                        <div style={{
                            background: '#fee',
                            color: '#c33',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            border: '1px solid #fcc'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#374151'
                        }}>
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                            placeholder="your@email.com"
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#374151'
                        }}>
                            Пароль *
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                            placeholder="Введите пароль"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem 2rem',
                            background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>

                    <div style={{
                        marginTop: '1.5rem',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        color: '#6b7280'
                    }}>
                        <p>Нет аккаунта?{' '}
                            <button
                                type="button"
                                onClick={handleSignUpClick}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#667eea',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Зарегистрироваться
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;