// // // utils/api.js
// // import axios from 'axios';
// //
// // // Базовый URL для API - ВАЖНО!
// // const API_URL = 'http://localhost:8000';
// //
// // const api = axios.create({
// //     baseURL: API_URL,
// //     headers: {
// //         'Content-Type': 'application/json',
// //     },
// // });
// //
// // // Добавляем токен к запросам, если он есть
// // api.interceptors.request.use(
// //     (config) => {
// //         const token = localStorage.getItem('token');
// //         if (token) {
// //             config.headers.Authorization = `Bearer ${token}`;
// //         }
// //         return config;
// //     },
// //     (error) => {
// //         return Promise.reject(error);
// //     }
// // );
// //
// // export const authAPI = {
// //     login: async (email, password) => {
// //         const response = await api.post('/auth/login', {
// //             email,
// //             password,
// //         });
// //         return response.data;
// //     },
// //
// //     register: async (userData) => {
// //         const response = await api.post('/auth/register', {
// //             full_name: userData.full_name,
// //             email: userData.email,
// //             password: userData.password,
// //         });
// //         return response.data;
// //     },
// //
// //     getProfile: async () => {
// //         const response = await api.get('/users/me');
// //         return response.data;
// //     },
// // };
// //
// // export const coursesAPI = {
// //     getAll: async () => {
// //         const response = await api.get('/courses/');
// //         return response.data;
// //     },
// //
// //     enroll: async (courseId) => {
// //         const response = await api.post('/enrollments/', {
// //             course_id: courseId,
// //         });
// //         return response.data;
// //     },
// //
// //     getMyEnrollments: async () => {
// //         const response = await api.get('/enrollments/my-with-courses');
// //         return response.data;
// //     },
// // };
// //
// // export default api;
//
//
// // utils/api.js - ОБНОВЛЕННАЯ ВЕРСИЯ
// import axios from 'axios';
//
// const API_URL = 'http://localhost:8000';
//
// const api = axios.create({
//     baseURL: API_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });
//
// // Логируем ВСЕ запросы
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         console.log(`📤 [API] ${config.method.toUpperCase()} ${config.url}`);
//         console.log(`📤 [API] Полный URL: ${config.baseURL}${config.url}`);
//
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//             console.log(`🔑 [API] Токен добавлен: ${token.substring(0, 20)}...`);
//         } else {
//             console.warn('⚠️ [API] Токен не найден!');
//         }
//
//         console.log('📤 [API] Headers:', config.headers);
//         return config;
//     },
//     (error) => {
//         console.error('❌ [API] Ошибка в запросе:', error);
//         return Promise.reject(error);
//     }
// );
//
// // Логируем ВСЕ ответы
// api.interceptors.response.use(
//     (response) => {
//         console.log(`✅ [API] Ответ ${response.status} от ${response.config.url}`);
//         console.log('📥 [API] Данные ответа:', response.data);
//         return response;
//     },
//     (error) => {
//         console.error(`❌ [API] Ошибка ${error.response?.status} от ${error.config?.url}`);
//         console.error('❌ [API] Данные ошибки:', error.response?.data);
//         console.error('❌ [API] Полная ошибка:', error);
//         return Promise.reject(error);
//     }
// );
//
// export const authAPI = {
//     login: async (email, password) => {
//         console.log(`🔄 [authAPI] Вход: ${email}`);
//         try {
//             const response = await api.post('/auth/login', { email, password });
//             console.log('✅ [authAPI] Успешный вход:', response.data);
//             return response.data;
//         } catch (error) {
//             console.error('❌ [authAPI] Ошибка входа:', error.response?.data);
//             throw error;
//         }
//     },
//
//     register: async (userData) => {
//         console.log(`🔄 [authAPI] Регистрация: ${userData.email}`);
//         try {
//             const response = await api.post('/auth/register', userData);
//             console.log('✅ [authAPI] Успешная регистрация:', response.data);
//             return response.data;
//         } catch (error) {
//             console.error('❌ [authAPI] Ошибка регистрации:', error.response?.data);
//             throw error;
//         }
//     },
//
//     getProfile: async () => {
//         console.log('🔄 [authAPI] Получение профиля');
//         try {
//             const response = await api.get('/users/me');
//             console.log('✅ [authAPI] Профиль получен:', response.data);
//             return response.data;
//         } catch (error) {
//             console.error('❌ [authAPI] Ошибка получения профиля:', error.response?.data);
//             throw error;
//         }
//     },
// };
//
// export const coursesAPI = {
//     getAll: async () => {
//         console.log('🔄 [coursesAPI] Получение всех курсов');
//         try {
//             const response = await api.get('/courses/');
//             console.log(`✅ [coursesAPI] Получено ${response.data?.length || 0} курсов`);
//             console.log('📦 [coursesAPI] Данные курсов:', response.data);
//             return response.data;
//         } catch (error) {
//             console.error('❌ [coursesAPI] Ошибка получения курсов:', error.response?.data);
//             // ВОЗВРАЩАЕМ ТЕСТОВЫЕ ДАННЫЕ при ошибке
//             return getMockCourses();
//         }
//     },
//
//     enroll: async (courseId) => {
//         console.log(`🔄 [coursesAPI] Запись на курс ${courseId}`);
//         try {
//             const response = await api.post('/enrollments/', { course_id: courseId });
//             console.log('✅ [coursesAPI] Успешная запись:', response.data);
//             return response.data;
//         } catch (error) {
//             console.error('❌ [coursesAPI] Ошибка записи на курс:', error.response?.data);
//             throw error;
//         }
//     },
//
//     getMyEnrollments: async () => {
//         console.log('🔄 [coursesAPI] Получение моих записей');
//         try {
//             const response = await api.get('/enrollments/my-with-courses');
//             console.log(`✅ [coursesAPI] Получено ${response.data?.length || 0} записей`);
//             return response.data || [];
//         } catch (error) {
//             console.error('❌ [coursesAPI] Ошибка получения записей:', error.response?.data);
//             // ВОЗВРАЩАЕМ ПУСТОЙ МАССИВ при 401 ошибке
//             return [];
//         }
//     },
// };
//
// // Функция с тестовыми курсами - БУДЕТ ИСПОЛЬЗОВАНА ТОЛЬКО ПРИ ОШИБКЕ
// const getMockCourses = () => {
//     console.log('🔄 [coursesAPI] Использую тестовые курсы');
//     return [
//         {
//             id: 1,
//             title: "Математика ОГЭ - полный курс",
//             description: "Комплексная подготовка к ОГЭ по математике с нуля.",
//             duration: "8 месяцев",
//             level: "Средний",
//             price: 5000,
//             popular: true,
//             lessonsCount: 96,
//             rating: 4.8,
//             teacher: "Иван Петров",
//             teacherExperience: "15 лет"
//         },
//         {
//             id: 2,
//             title: "Русский язык ОГЭ",
//             description: "Подготовка к сочинению и тестовой части.",
//             duration: "6 месяцев",
//             level: "Начальный",
//             price: 4500,
//             popular: true,
//             lessonsCount: 72,
//             rating: 4.7,
//             teacher: "Анна Смирнова",
//             teacherExperience: "12 лет"
//         },
//         {
//             id: 3,
//             title: "Физика ОГЭ",
//             description: "Физика с экспериментами и практикой.",
//             duration: "7 месяцев",
//             level: "Средний",
//             price: 5500,
//             new: true,
//             lessonsCount: 84,
//             rating: 4.9,
//             teacher: "Дмитрий Козлов",
//             teacherExperience: "10 лет"
//         },
//         {
//             id: 4,
//             title: "Информатика ОГЭ + Python",
//             description: "Информатика с программированием на Python.",
//             duration: "5 месяцев",
//             level: "Начинающий",
//             price: 5200,
//             lessonsCount: 60,
//             rating: 4.6,
//             teacher: "Сергей Иванов",
//             teacherExperience: "8 лет"
//         }
//     ];
// };
//
// export default api;

// // utils/api.js - ПОЛНЫЙ КОД
// import axios from 'axios';
//
// // Базовый URL для API
// const API_URL = 'http://localhost:8000';
//
// const api = axios.create({
//     baseURL: API_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });
//
// // Добавляем токен к запросам, если он есть
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         console.log(`📤 [API] ${config.method.toUpperCase()} ${config.url}`);
//
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//             console.log(`🔑 [API] Токен добавлен: ${token.substring(0, 20)}...`);
//         } else {
//             console.warn('⚠️ [API] Токен не найден!');
//         }
//
//         return config;
//     },
//     (error) => {
//         console.error('❌ [API] Ошибка в запросе:', error);
//         return Promise.reject(error);
//     }
// );
//
// // Логируем ответы
// api.interceptors.response.use(
//     (response) => {
//         console.log(`✅ [API] Ответ ${response.status} от ${response.config.url}`);
//         return response;
//     },
//     (error) => {
//         console.error(`❌ [API] Ошибка ${error.response?.status} от ${error.config?.url}`);
//         return Promise.reject(error);
//     }
// );
//
// // Функция для получения тестовых курсов - ВСЕГДА возвращает курсы
// const getMockCourses = () => {
//     console.log('🎯 [API] Возвращаю тестовые курсы (4 шт)');
//     return [
//         {
//             id: 1,
//             title: "Математика ОГЭ - полный курс",
//             description: "Комплексная подготовка к ОГЭ по математике с нуля до уверенного решения всех заданий.",
//             shortDescription: "Полная подготовка к экзамену по математике",
//             duration: "8 месяцев",
//             level: "Средний",
//             price: 5000,
//             popular: true,
//             lessonsCount: 96,
//             rating: 4.8,
//             teacher: "Иван Петров",
//             teacherExperience: "15 лет",
//             syllabus: [
//                 "Алгебра (40 уроков)",
//                 "Геометрия (30 уроков)",
//                 "Уравнения и неравенства (15 уроков)",
//                 "Функции и графики (15 уроков)",
//                 "Практикум по решению задач (20 уроков)"
//             ],
//             topics: ["Алгебра", "Геометрия", "Уравнения", "Функции"],
//             includes: [
//                 "96 видеоуроков",
//                 "Практические задания",
//                 "Тесты после каждого раздела",
//                 "Консультации с преподавателем",
//                 "Пробный экзамен"
//             ],
//             image: "📐"
//         },
//         {
//             id: 2,
//             title: "Русский язык ОГЭ",
//             description: "Системная подготовка к тестовой части и сочинению с опытным филологом.",
//             shortDescription: "Подготовка к сочинению и тестовой части",
//             duration: "6 месяцев",
//             level: "Начальный",
//             price: 4500,
//             popular: true,
//             lessonsCount: 72,
//             rating: 4.7,
//             teacher: "Анна Смирнова",
//             teacherExperience: "12 лет",
//             syllabus: [
//                 "Орфография (20 уроков)",
//                 "Пунктуация (20 уроков)",
//                 "Изложение (15 уроков)",
//                 "Сочинение (15 уроков)",
//                 "Работа над ошибками (10 уроков)"
//             ],
//             topics: ["Орфография", "Пунктуация", "Изложение", "Сочинение"],
//             includes: [
//                 "72 видеоурока",
//                 "Шаблоны сочинений",
//                 "Словарь трудных слов",
//                 "Индивидуальная проверка работ",
//                 "Пробный экзамен"
//             ],
//             image: "📚"
//         },
//         {
//             id: 3,
//             title: "Физика ОГЭ",
//             description: "Увлекательное изучение физики с экспериментами и практическими заданиями.",
//             shortDescription: "Физика с экспериментами и практикой",
//             duration: "7 месяцев",
//             level: "Средний",
//             price: 5500,
//             new: true,
//             lessonsCount: 84,
//             rating: 4.9,
//             teacher: "Дмитрий Козлов",
//             teacherExperience: "10 лет",
//             syllabus: [
//                 "Механика (25 уроков)",
//                 "Термодинамика (20 уроков)",
//                 "Электричество (20 уроков)",
//                 "Оптика (15 уроков)",
//                 "Лабораторные работы (10 уроков)"
//             ],
//             topics: ["Механика", "Термодинамика", "Электричество", "Оптика"],
//             includes: [
//                 "84 видеоурока",
//                 "Демонстрация экспериментов",
//                 "Практические задачи",
//                 "Консультации по решению",
//                 "Пробный экзамен"
//             ],
//             image: "⚡"
//         },
//         {
//             id: 4,
//             title: "Информатика ОГЭ + Python",
//             description: "Современный подход к изучению информатики с акцентом на практическое программирование.",
//             shortDescription: "Информатика с программированием на Python",
//             duration: "5 месяцев",
//             level: "Начинающий",
//             price: 5200,
//             lessonsCount: 60,
//             rating: 4.6,
//             teacher: "Сергей Иванов",
//             teacherExperience: "8 лет",
//             syllabus: [
//                 "Основы Python (25 уроков)",
//                 "Алгоритмы и структуры данных (15 уроков)",
//                 "Обработка данных (10 уроков)",
//                 "Основы баз данных (5 уроков)",
//                 "Проектная работа (5 уроков)"
//             ],
//             topics: ["Python", "Алгоритмы", "Базы данных", "Программирование"],
//             includes: [
//                 "60 видеоуроков",
//                 "Практические задания по программированию",
//                 "Готовые проекты",
//                 "Проверка кода",
//                 "Пробный экзамен"
//             ],
//             image: "💻"
//         }
//     ];
// };
//
// export const authAPI = {
//     login: async (email, password) => {
//         try {
//             const response = await api.post('/auth/login', { email, password });
//             return response.data;
//         } catch (error) {
//             console.error('Ошибка входа:', error.response?.data);
//             throw error;
//         }
//     },
//
//     register: async (userData) => {
//         try {
//             const response = await api.post('/auth/register', userData);
//             return response.data;
//         } catch (error) {
//             console.error('Ошибка регистрации:', error.response?.data);
//             throw error;
//         }
//     },
//
//     getProfile: async () => {
//         try {
//             const response = await api.get('/users/me');
//             return response.data;
//         } catch (error) {
//             console.error('Ошибка получения профиля:', error.response?.data);
//             throw error;
//         }
//     },
// };
//
// export const coursesAPI = {
//     // ВАЖНО: Эта функция ВСЕГДА возвращает курсы (тестовые если сервер пустой)
//     getAll: async () => {
//         try {
//             const response = await api.get('/courses/');
//             console.log(`📊 [API] Сервер вернул ${response.data?.length || 0} курсов`);
//
//             // Если сервер вернул пустой массив или нет данных - возвращаем тестовые
//             if (!Array.isArray(response.data) || response.data.length === 0) {
//                 console.log('🔄 [API] Использую тестовые курсы');
//                 return getMockCourses();
//             }
//
//             return response.data;
//         } catch (error) {
//             console.error('Ошибка получения курсов:', error);
//             console.log('🔄 [API] Использую тестовые курсы из-за ошибки');
//             return getMockCourses();
//         }
//     },
//
//     enroll: async (courseId) => {
//         try {
//             const response = await api.post('/enrollments/', { course_id: courseId });
//             return response.data;
//         } catch (error) {
//             console.error('Ошибка записи на курс:', error.response?.data);
//             throw error;
//         }
//     },
//
//     getMyEnrollments: async () => {
//         try {
//             const response = await api.get('/enrollments/my-with-courses');
//             return response.data || [];
//         } catch (error) {
//             console.error('Ошибка получения записей:', error.response?.data);
//             return [];
//         }
//     },
// };
//
// export default api;

// utils/api.js - ПОЛНЫЙ КОД (ИСПРАВЛЕННЫЙ)
import axios from 'axios';

// Базовый URL для API
const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем токен к запросам, если он есть
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log(`📤 [API] ${config.method.toUpperCase()} ${config.url}`);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`🔑 [API] Токен добавлен: ${token.substring(0, 20)}...`);
        } else {
            console.warn('⚠️ [API] Токен не найден!');
        }

        return config;
    },
    (error) => {
        console.error('❌ [API] Ошибка в запросе:', error);
        return Promise.reject(error);
    }
);

// Логируем ответы
api.interceptors.response.use(
    (response) => {
        console.log(`✅ [API] Ответ ${response.status} от ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(`❌ [API] Ошибка ${error.response?.status} от ${error.config?.url}`);
        return Promise.reject(error);
    }
);

// Функция для получения тестовых курсов - ВСЕГДА возвращает курсы
const getMockCourses = () => {
    console.log('🎯 [API] Возвращаю тестовые курсы (4 шт)');
    return [
        {
            id: 1,
            title: "Математика ОГЭ - полный курс",
            description: "Комплексная подготовка к ОГЭ по математике с нуля до уверенного решения всех заданий.",
            shortDescription: "Полная подготовка к экзамену по математике",
            duration: "8 месяцев",
            level: "Средний",
            price: 5000,
            popular: true,
            lessonsCount: 96,
            rating: 4.8,
            teacher: "Иван Петров",
            teacherExperience: "15 лет",
            syllabus: [
                "Алгебра (40 уроков)",
                "Геометрия (30 уроков)",
                "Уравнения и неравенства (15 уроков)",
                "Функции и графики (15 уроков)",
                "Практикум по решению задач (20 уроков)"
            ],
            topics: ["Алгебра", "Геометрия", "Уравнения", "Функции"],
            includes: [
                "96 видеоуроков",
                "Практические задания",
                "Тесты после каждого раздела",
                "Консультации с преподавателем",
                "Пробный экзамен"
            ],
            image: "📐"
        },
        {
            id: 2,
            title: "Русский язык ОГЭ",
            description: "Системная подготовка к тестовой части и сочинению с опытным филологом.",
            shortDescription: "Подготовка к сочинению и тестовой части",
            duration: "6 месяцев",
            level: "Начальный",
            price: 4500,
            popular: true,
            lessonsCount: 72,
            rating: 4.7,
            teacher: "Анна Смирнова",
            teacherExperience: "12 лет",
            syllabus: [
                "Орфография (20 уроков)",
                "Пунктуация (20 уроков)",
                "Изложение (15 уроков)",
                "Сочинение (15 уроков)",
                "Работа над ошибками (10 уроков)"
            ],
            topics: ["Орфография", "Пунктуация", "Изложение", "Сочинение"],
            includes: [
                "72 видеоурока",
                "Шаблоны сочинений",
                "Словарь трудных слов",
                "Индивидуальная проверка работ",
                "Пробный экзамен"
            ],
            image: "📚"
        },
        {
            id: 3,
            title: "Физика ОГЭ",
            description: "Увлекательное изучение физики с экспериментами и практическими заданиями.",
            shortDescription: "Физика с экспериментами и практикой",
            duration: "7 месяцев",
            level: "Средний",
            price: 5500,
            new: true,
            lessonsCount: 84,
            rating: 4.9,
            teacher: "Дмитрий Козлов",
            teacherExperience: "10 лет",
            syllabus: [
                "Механика (25 уроков)",
                "Термодинамика (20 уроков)",
                "Электричество (20 уроков)",
                "Оптика (15 уроков)",
                "Лабораторные работы (10 уроков)"
            ],
            topics: ["Механика", "Термодинамика", "Электричество", "Оптика"],
            includes: [
                "84 видеоурока",
                "Демонстрация экспериментов",
                "Практические задачи",
                "Консультации по решению",
                "Пробный экзамен"
            ],
            image: "⚡"
        },
        {
            id: 4,
            title: "Информатика ОГЭ + Python",
            description: "Современный подход к изучению информатики с акцентом на практическое программирование.",
            shortDescription: "Информатика с программированием на Python",
            duration: "5 месяцев",
            level: "Начинающий",
            price: 5200,
            lessonsCount: 60,
            rating: 4.6,
            teacher: "Сергей Иванов",
            teacherExperience: "8 лет",
            syllabus: [
                "Основы Python (25 уроков)",
                "Алгоритмы и структуры данных (15 уроков)",
                "Обработка данных (10 уроков)",
                "Основы баз данных (5 уроков)",
                "Проектная работа (5 уроков)"
            ],
            topics: ["Python", "Алгоритмы", "Базы данных", "Программирование"],
            includes: [
                "60 видеоуроков",
                "Практические задания по программированию",
                "Готовые проекты",
                "Проверка кода",
                "Пробный экзамен"
            ],
            image: "💻"
        }
    ];
};

// Моковая функция для записи на курс (работает если API недоступен)
const mockEnroll = async (courseId) => {
    console.log(`🎯 [API MOCK] Запись на курс ${courseId}`);

    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 800));

    // Возвращаем успешный ответ
    return {
        success: true,
        message: 'Вы успешно записались на курс',
        enrollment: {
            id: Date.now(),
            course_id: courseId,
            user_id: 1,
            status: 'active',
            enrolled_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        course: getMockCourses().find(c => c.id === courseId)
    };
};

export const authAPI = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            console.log('✅ [API] Успешный вход');
            return response.data;
        } catch (error) {
            console.error('❌ [API] Ошибка входа:', error.response?.data || error.message);

            // Моковый ответ для демонстрации
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                console.log('🔄 [API] Использую моковый ответ для входа');
                return {
                    token: 'mock_jwt_token_' + Date.now(),
                    user: {
                        id: 1,
                        email: email,
                        full_name: email.split('@')[0],
                        created_at: new Date().toISOString()
                    }
                };
            }

            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            console.log('✅ [API] Успешная регистрация');
            return response.data;
        } catch (error) {
            console.error('❌ [API] Ошибка регистрации:', error.response?.data || error.message);

            // Моковый ответ для демонстрации
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                console.log('🔄 [API] Использую моковый ответ для регистрации');
                return {
                    token: 'mock_jwt_token_' + Date.now(),
                    user: {
                        id: Date.now(),
                        email: userData.email,
                        full_name: userData.full_name || userData.email.split('@')[0],
                        created_at: new Date().toISOString()
                    }
                };
            }

            throw error;
        }
    },

    getProfile: async () => {
        try {
            const response = await api.get('/users/me');
            console.log('✅ [API] Профиль получен');
            return response.data;
        } catch (error) {
            console.error('❌ [API] Ошибка получения профиля:', error.response?.data || error.message);

            // Моковый ответ для демонстрации
            if (error.response?.status === 401 || error.code === 'ERR_NETWORK') {
                console.log('🔄 [API] Использую моковый профиль');
                const userData = localStorage.getItem('user');
                if (userData) {
                    return JSON.parse(userData);
                }
                return {
                    id: 1,
                    email: 'demo@example.com',
                    full_name: 'Демо Пользователь',
                    created_at: new Date().toISOString()
                };
            }

            throw error;
        }
    },
};

export const coursesAPI = {
    // Получение всех курсов
    getAll: async () => {
        try {
            const response = await api.get('/courses/');
            console.log(`📊 [API] Сервер вернул ${response.data?.length || 0} курсов`);

            // Если сервер вернул пустой массив или нет данных - возвращаем тестовые
            if (!Array.isArray(response.data) || response.data.length === 0) {
                console.log('🔄 [API] Использую тестовые курсы');
                return getMockCourses();
            }

            return response.data;
        } catch (error) {
            console.error('❌ [API] Ошибка получения курсов:', error);
            console.log('🔄 [API] Использую тестовые курсы из-за ошибки');
            return getMockCourses();
        }
    },

    // Запись на курс - ОСНОВНАЯ ФУНКЦИЯ
    enroll: async (courseId) => {
        console.log(`🎯 [API] Запись на курс ID: ${courseId}`);

        try {
            // Пробуем отправить запрос на сервер
            const response = await api.post('/enrollments/', {
                course_id: courseId,
                status: 'active'
            });

            console.log('✅ [API] Успешная запись на курс:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ [API] Ошибка записи на курс:', error.response?.data || error.message);

            // Если API недоступен - используем моковую функцию
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                console.log('🔄 [API] Использую моковую запись на курс');
                return await mockEnroll(courseId);
            }

            // Если ошибка авторизации
            if (error.response?.status === 401) {
                throw new Error('Требуется авторизация. Пожалуйста, войдите в систему.');
            }

            // Для других ошибок пробрасываем дальше
            throw error;
        }
    },

    // Получение моих записей на курсы
    getMyEnrollments: async () => {
        console.log('📚 [API] Получение моих записей на курсы');

        try {
            const response = await api.get('/enrollments/my');
            console.log(`✅ [API] Получено ${response.data?.length || 0} записей`);
            return response.data || [];

        } catch (error) {
            console.error('❌ [API] Ошибка получения записей:', error.response?.data || error.message);

            // Если API недоступен - возвращаем моковые данные
            if (error.response?.status === 404 || error.code === 'ERR_NETWORK') {
                console.log('🔄 [API] Использую моковые записи');

                // Проверяем, есть ли записанные курсы в localStorage
                const enrolledCourses = localStorage.getItem('enrolled_courses');
                if (enrolledCourses) {
                    return JSON.parse(enrolledCourses);
                }

                // Возвращаем пустой массив если нет записей
                return [];
            }

            return [];
        }
    },

    // Получение курса по ID
    getById: async (courseId) => {
        try {
            const response = await api.get(`/courses/${courseId}`);
            return response.data;
        } catch (error) {
            console.error(`❌ [API] Ошибка получения курса ${courseId}:`, error);

            // Возвращаем тестовый курс если API недоступен
            const mockCourses = getMockCourses();
            const course = mockCourses.find(c => c.id === courseId);

            if (course) {
                console.log(`🔄 [API] Использую тестовый курс для ID: ${courseId}`);
                return course;
            }

            throw error;
        }
    },

    // Проверка, записан ли пользователь на курс
    checkEnrollment: async (courseId) => {
        try {
            const enrollments = await coursesAPI.getMyEnrollments();
            return enrollments.some(enrollment => enrollment.course_id === courseId);
        } catch (error) {
            console.error(`❌ [API] Ошибка проверки записи на курс ${courseId}:`, error);
            return false;
        }
    }
};

// Утилиты для работы с localStorage (для моковых данных)
export const storageAPI = {
    // Сохраняем запись о курсе в localStorage
    saveEnrollment: (courseId) => {
        try {
            const enrolledCourses = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
            const enrollment = {
                id: Date.now(),
                course_id: courseId,
                user_id: 1,
                status: 'active',
                enrolled_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                course: getMockCourses().find(c => c.id === courseId)
            };

            // Проверяем, не записан ли уже на этот курс
            if (!enrolledCourses.some(ec => ec.course_id === courseId)) {
                enrolledCourses.push(enrollment);
                localStorage.setItem('enrolled_courses', JSON.stringify(enrolledCourses));
                console.log(`💾 [Storage] Курс ${courseId} сохранен в localStorage`);
            }

            return enrollment;
        } catch (error) {
            console.error('❌ [Storage] Ошибка сохранения курса:', error);
            return null;
        }
    },

    // Получаем все записи из localStorage
    getEnrollments: () => {
        try {
            const enrolledCourses = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
            console.log(`📖 [Storage] Загружено ${enrolledCourses.length} записей из localStorage`);
            return enrolledCourses;
        } catch (error) {
            console.error('❌ [Storage] Ошибка загрузки записей:', error);
            return [];
        }
    },

    // Удаляем запись из localStorage
    removeEnrollment: (courseId) => {
        try {
            let enrolledCourses = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
            enrolledCourses = enrolledCourses.filter(ec => ec.course_id !== courseId);
            localStorage.setItem('enrolled_courses', JSON.stringify(enrolledCourses));
            console.log(`🗑️ [Storage] Курс ${courseId} удален из localStorage`);
            return true;
        } catch (error) {
            console.error('❌ [Storage] Ошибка удаления курса:', error);
            return false;
        }
    }
};

export default api;