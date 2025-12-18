import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { authAPI, coursesAPI } from '../utils/api';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // Функция login
    const login = async (email, password) => {
        try {
            setLoading(true);
            console.log('🔄 [AuthContext] Отправка запроса на вход:', email);

            // Получаем ответ от сервера
            const response = await authAPI.login(email, password);
            console.log('📥 [AuthContext] Ответ от authAPI.login:', response);

            // FastAPI возвращает ошибки в {detail}
            if (response && response.detail) {
                console.error('❌ [AuthContext] Ошибка от сервера:', response.detail);
                return {
                    success: false,
                    error: response.detail
                };
            }

            // Проверяем формат ответа
            if (!response) {
                return {
                    success: false,
                    error: 'Пустой ответ от сервера'
                };
            }

            // Логируем структуру ответа
            console.log('🔍 [AuthContext] Структура ответа:', {
                keys: Object.keys(response),
                hasAccessToken: 'access_token' in response,
                hasToken: 'token' in response,
                hasUser: 'user' in response,
                fullResponse: response
            });

            // Вариант 1: access_token (стандарт для FastAPI)
            if (response.access_token) {
                console.log('✅ [AuthContext] Получен access_token');

                // Сохраняем токен
                localStorage.setItem('token', response.access_token);
                setToken(response.access_token);

                // Создаем/получаем пользователя
                const userData = response.user || {
                    id: response.user_id || Date.now(),
                    full_name: email.split('@')[0] || 'Пользователь',
                    email: email
                };

                // Сохраняем пользователя
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setIsAuthenticated(true);

                return {
                    success: true,
                    user: userData,
                    message: 'Вход выполнен успешно'
                };
            }

            // Вариант 2: token
            if (response.token) {
                console.log('✅ [AuthContext] Получен token');

                localStorage.setItem('token', response.token);
                setToken(response.token);

                const userData = response.user || {
                    id: response.user_id || Date.now(),
                    full_name: email.split('@')[0] || 'Пользователь',
                    email: email
                };

                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setIsAuthenticated(true);

                return {
                    success: true,
                    user: userData,
                    message: 'Вход выполнен успешно'
                };
            }

            // Если формат непонятный, показываем что получили
            console.error('❌ [AuthContext] Неизвестный формат ответа:', response);
            return {
                success: false,
                error: `Неизвестный формат ответа: ${JSON.stringify(response)}`
            };

        } catch (error) {
            console.error('❌ [AuthContext] Ошибка в login:', error);

            // Проверяем разные форматы ошибок
            if (error.response?.data?.detail) {
                return { success: false, error: error.response.data.detail };
            }

            // Если сервер недоступен
            if (error.message && error.message.includes('Network')) {
                return {
                    success: false,
                    error: 'Сервер недоступен. Проверьте, запущен ли бэкенд.'
                };
            }

            return {
                success: false,
                error: error.message || 'Произошла ошибка при входе'
            };
        } finally {
            setLoading(false);
        }
    };

    // Функция register - ИСПРАВЛЕННАЯ ВЕРСИЯ
    const register = async (userData) => {
        try {
            setLoading(true);
            console.log('🔄 [AuthContext] Отправка запроса на регистрацию:', userData.email);

            const response = await authAPI.register(userData);
            console.log('📥 [AuthContext] Ответ от authAPI.register:', response);

            // Проверяем ошибки
            if (response && response.detail) {
                console.error('❌ [AuthContext] Ошибка от сервера:', response.detail);
                return {
                    success: false,
                    error: response.detail
                };
            }

            // Проверяем формат ответа
            if (!response) {
                return {
                    success: false,
                    error: 'Пустой ответ от сервера'
                };
            }

            // КЛЮЧЕВАЯ ЛОГИКА: Ваш бэкенд возвращает {email, full_name, id, is_active, created_at}
            // НО НЕ ВОЗВРАЩАЕТ ТОКЕН!

            console.log('🔍 [AuthContext] Анализ ответа регистрации:', {
                keys: Object.keys(response),
                hasId: 'id' in response,
                hasEmail: 'email' in response,
                response: response
            });

            // 1. Проверяем новый формат (пользователь без токена)
            if (response.id && response.email) {
                console.log('✅ [AuthContext] Регистрация успешна. Пользователь создан:', response.email);

                // Сохраняем данные пользователя
                const newUser = {
                    id: response.id,
                    full_name: response.full_name || userData.full_name,
                    email: response.email || userData.email,
                    is_active: response.is_active || true,
                    created_at: response.created_at
                };

                localStorage.setItem('user', JSON.stringify(newUser));
                setUser(newUser);

                // 🔄 ПОПЫТКА АВТОМАТИЧЕСКОГО ВХОДА ПОСЛЕ РЕГИСТРАЦИИ
                try {
                    console.log('🔄 [AuthContext] Пробуем автоматически войти после регистрации...');

                    const loginResult = await login(userData.email, userData.password);

                    if (loginResult.success) {
                        console.log('✅ [AuthContext] Автоматический вход успешен');
                        return {
                            success: true,
                            user: loginResult.user,
                            isAuthenticated: true,
                            message: 'Регистрация и вход выполнены успешно!'
                        };
                    } else {
                        console.warn('⚠️ [AuthContext] Автоматический вход не удался:', loginResult.error);

                        // Регистрация успешна, но вход не удался
                        setIsAuthenticated(false); // Нет токена

                        return {
                            success: true,
                            user: newUser,
                            isAuthenticated: false,
                            message: 'Регистрация успешна! Теперь войдите в систему.'
                        };
                    }

                } catch (loginError) {
                    console.error('❌ [AuthContext] Ошибка автоматического входа:', loginError);

                    setIsAuthenticated(false);

                    return {
                        success: true,
                        user: newUser,
                        isAuthenticated: false,
                        message: 'Регистрация успешна! Для продолжения войдите в систему.'
                    };
                }
            }

            // 2. Старый формат с токеном (если бэкенд изменится)
            const token = response.access_token || response.token;
            if (token) {
                console.log('✅ [AuthContext] Регистрация успешна, токен получен');

                localStorage.setItem('token', token);
                setToken(token);

                const newUser = response.user || {
                    id: response.user_id || Date.now(),
                    full_name: userData.full_name,
                    email: userData.email
                };

                localStorage.setItem('user', JSON.stringify(newUser));
                setUser(newUser);
                setIsAuthenticated(true);

                return {
                    success: true,
                    user: newUser,
                    isAuthenticated: true
                };
            }

            // 3. Формат с user объектом
            if (response.user && response.user.id) {
                console.log('✅ [AuthContext] Регистрация успешна (формат с user)');

                const newUser = response.user;
                localStorage.setItem('user', JSON.stringify(newUser));
                setUser(newUser);
                setIsAuthenticated(true);

                return {
                    success: true,
                    user: newUser,
                    isAuthenticated: true
                };
            }

            console.error('❌ [AuthContext] Неизвестный формат ответа:', response);
            return {
                success: false,
                error: `Неизвестный формат ответа: ${JSON.stringify(response)}`
            };

        } catch (error) {
            console.error('❌ [AuthContext] Ошибка в register:', error);

            if (error.response?.data?.detail) {
                return { success: false, error: error.response.data.detail };
            }

            if (error.message && error.message.includes('Network')) {
                return {
                    success: false,
                    error: 'Сервер недоступен. Проверьте, запущен ли бэкенд.'
                };
            }

            return {
                success: false,
                error: error.message || 'Произошла ошибка при регистрации'
            };
        } finally {
            setLoading(false);
        }
    };

    // Функция logout
    const logout = () => {
        console.log('🚪 [AuthContext] Выход из системы');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    // Функция получения курсов
    const getCourses = async () => {
        try {
            return await coursesAPI.getAll();
        } catch (error) {
            console.error('Get courses error:', error);
            throw error;
        }
    };

    // Функция записи на курс
    const enrollToCourse = async (courseId) => {
        try {
            return await coursesAPI.enroll(courseId);
        } catch (error) {
            console.error('Enroll error:', error);
            throw error;
        }
    };

    // Проверка авторизации при загрузке
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            console.log('🔍 [AuthContext] Проверка авторизации при загрузке');
            console.log('Токен:', token);
            console.log('Данные пользователя:', userData);

            if (token && userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    console.log('✅ [AuthContext] Пользователь полностью авторизован:', parsedUser.email);
                    setUser(parsedUser);
                    setToken(token);
                    setIsAuthenticated(true);
                } catch (e) {
                    console.error('❌ Ошибка парсинга user data:', e);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } else if (userData && !token) {
                try {
                    const parsedUser = JSON.parse(userData);
                    console.log('⚠️ [AuthContext] Пользователь зарегистрирован, но не авторизован:', parsedUser.email);
                    setUser(parsedUser);
                    setToken(null);
                    setIsAuthenticated(false);
                } catch (e) {
                    console.error('❌ Ошибка парсинга user data:', e);
                }
            } else {
                console.log('❌ [AuthContext] Пользователь не найден');
                setIsAuthenticated(false);
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const value = useMemo(() => ({
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        getCourses,
        enrollToCourse
    }), [user, token, loading, isAuthenticated]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;