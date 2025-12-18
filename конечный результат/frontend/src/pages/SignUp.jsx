
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated, user } = useAuth();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Если пользователь уже авторизован, перенаправляем
    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, user, navigate]);

    // Проверка сложности пароля
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }

        if (error) setError('');
        if (successMessage) setSuccessMessage('');
    };

    const validateForm = () => {
        if (!formData.full_name.trim()) {
            setError('Введите ФИО');
            return false;
        }

        if (!formData.email.trim()) {
            setError('Введите email');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Введите корректный email');
            return false;
        }

        if (!formData.password) {
            setError('Введите пароль');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return false;
        }

        if (passwordStrength < 2) {
            setError('Пароль слишком слабый. Используйте заглавные буквы и цифры');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🔄 Начало регистрации...');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        const userData = {
            full_name: formData.full_name,
            email: formData.email,
            password: formData.password
        };

        console.log('📤 Отправка данных на сервер:', {
            ...userData,
            password: '***' // Не логируем пароль
        });

        try {
            const result = await register(userData);

            console.log('📥 Ответ от сервера:', result);

            if (result.success) {
                setSuccessMessage(result.message || 'Регистрация успешна!');

                // ПРОВЕРЯЕМ localStorage
                const token = localStorage.getItem('token');
                const user = localStorage.getItem('user');
                console.log('🔍 Проверяем localStorage после регистрации:');
                console.log('token:', token);
                console.log('user:', user);

                if (result.isAuthenticated && token) {
                    // Полная авторизация
                    console.log('✅ Регистрация и вход успешны!');
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1500);
                } else {
                    // Только регистрация
                    console.log('✅ Регистрация успешна, требуется вход');
                    setTimeout(() => {
                        navigate('/login', {
                            state: {
                                email: formData.email,
                                message: result.message || 'Регистрация успешна! Войдите в систему.'
                            }
                        });
                    }, 2000);
                }
            } else {
                console.error('❌ Ошибка регистрации:', result.error);
                setError(result.error || 'Произошла ошибка при регистрации');
            }
        } catch (error) {
            console.error('❌ Неожиданная ошибка:', error);
            setError(error.message || 'Произошла ошибка при регистрации');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthText = () => {
        const texts = ['Очень слабый', 'Слабый', 'Средний', 'Сильный', 'Очень сильный'];
        return texts[passwordStrength] || '';
    };

    const getPasswordStrengthColor = () => {
        const colors = ['#ff4d4d', '#ff944d', '#ffd24d', '#8ce38c', '#4caf50'];
        return colors[passwordStrength] || '#ff4d4d';
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
                        Регистрация
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
                        Создайте аккаунт для доступа к курсам
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
                            border: '1px solid #fcc',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div style={{
                            background: '#efffed',
                            color: '#2e7d32',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            border: '1px solid #c8e6c9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span>✅</span>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#374151'
                        }}>
                            Имя и фамилия *
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            placeholder="Иванов Иван Иванович"
                        />
                    </div>

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
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            placeholder="your@email.com"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
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
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            placeholder="Минимум 6 символов"
                        />

                        {formData.password && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <div style={{
                                    height: '4px',
                                    background: '#eee',
                                    borderRadius: '2px',
                                    overflow: 'hidden',
                                    marginBottom: '0.25rem'
                                }}>
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${(passwordStrength / 4) * 100}%`,
                                            background: getPasswordStrengthColor(),
                                            transition: 'all 0.3s ease'
                                        }}
                                    ></div>
                                </div>
                                <span style={{
                                    fontSize: '0.875rem',
                                    color: getPasswordStrengthColor()
                                }}>
                                    Сложность: {getPasswordStrengthText()}
                                </span>
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#374151'
                        }}>
                            Подтвердите пароль *
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            placeholder="Повторите пароль"
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
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {loading && (
                            <div style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                        )}
                        {loading ? 'Регистрация...' : 'Создать аккаунт'}
                    </button>

                    <div style={{
                        marginTop: '1.5rem',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        color: '#6b7280'
                    }}>
                        <p>Уже есть аккаунт?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#667eea',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontWeight: '600'
                                }}
                            >
                                Войти
                            </button>
                        </p>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                input:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
            `}</style>
        </div>
    );
};

export default SignUp;