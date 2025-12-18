import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Страницы
import Home from './pages/Home';
import AboutSchool from './pages/AboutSchool';
import Courses from './pages/Courses';
import CourseDetail from './components/CourseDetail';
import OgeInfo from './pages/OgeInfo';
import Pricing from './pages/Pricing';
import SignUp from './pages/SignUp';
import LoginForm from './components/Forms/LoginForm';

// Компоненты личного кабинета
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './components/dashboard/DashboardOverview';
import MyCourses from './components/dashboard/MyCourses';
import Profile from './components/dashboard/Profile';

// Компоненты Header
import Header from './components/Header';

// Компонент загрузки
const LoadingScreen = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8fafc'
    }}>
        <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid #e5e7eb',
                borderTopColor: '#4f46e5',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                animation: 'spin 1s linear infinite'
            }}></div>
            <p>Загрузка...</p>
        </div>
    </div>
);

// Защищенный роут
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Публичный роут (только для неавторизованных)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// Компоненты для остальных разделов
const Progress = () => (
    <div>
        <h1>Прогресс обучения</h1>
        <p>Здесь будет ваш прогресс по всем курсам</p>
    </div>
);

const Settings = () => (
    <div>
        <h1>Настройки</h1>
        <p>Настройки вашего аккаунта</p>
    </div>
);

const AppRouter = () => {
    const { user, logout, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Header user={user} onLogout={logout} />
            <main>
                <Routes>
                    {/* Главная страница доступна всем */}
                    <Route path="/" element={<Home />} />

                    {/* Публичные маршруты - только для неавторизованных */}
                    <Route path="/signup" element={
                        <PublicRoute>
                            <SignUp />
                        </PublicRoute>
                    } />
                    <Route path="/login" element={
                        <PublicRoute>
                            <LoginForm />
                        </PublicRoute>
                    } />

                    {/* Общедоступные страницы */}
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetail />} /> {/* ДОБАВЛЕНО */}
                    <Route path="/about" element={<AboutSchool />} />
                    <Route path="/oge" element={<OgeInfo />} />
                    <Route path="/pricing" element={<Pricing />} />

                    {/* Личный кабинет - только для авторизованных */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<DashboardOverview />} />
                        <Route path="courses" element={<MyCourses />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="progress" element={<Progress />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* 404 - перенаправление на главную */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </>
    );
};

export default AppRouter;