// import React from 'react';
// import './App.css';
//
// function App() {
//     return (
//         <div className="app">
//             {/* Шапка */}
//             <header className="header">
//                 <div className="header-content">
//                     <div className="logo">ОГЭПрофи</div>
//                     <nav className="navigation">
//                         <button className="nav-button">о школе</button>
//                         <button className="nav-button">о курсах</button>
//                         <button className="nav-button">тарифы</button>
//                         <button className="nav-button">ОГЭ</button>
//                         <button className="nav-button nav-button-primary">записаться</button>
//                     </nav>
//                 </div>
//             </header>
//
//             {/* Главный контент */}
//             <main className="main">
//                 <div className="main-content">
//                     <h1 className="hero-title">
//                         Хочешь подготовиться к экзаменам, тогда тебе ко мне
//                     </h1>
//                     <p className="hero-description">
//                         Подготовлю к ОГЭ на 5 в 2025/2026 учебном году
//                     </p>
//                     <div className="hero-buttons">
//                         <button className="button button-primary">записаться</button>
//                         <button className="button button-secondary">о курсах</button>
//                         <button className="button button-secondary">тарифы</button>
//                     </div>
//                 </div>
//
//                 {/* Преимущества */}
//                 <section className="features">
//                     <div className="feature">
//                         <h3>Подготовка по математике</h3>
//                         <p>Полный охват школьной программы</p>
//                     </div>
//                     <div className="feature">
//                         <h3>Опытные преподаватели</h3>
//                         <p>Профессионалы с многолетним стажем</p>
//                     </div>
//                     <div className="feature">
//                         <h3>Гибкое расписание</h3>
//                         <p>Занимайся в удобное время</p>
//                     </div>
//                 </section>
//             </main>
//         </div>
//     );
// }
//
// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AboutSchool from './pages/AboutSchool';
import Courses from './pages/Courses';
import Pricing from './pages/Pricing';
import OgeInfo from './pages/OgeInfo';
import SignUp from './pages/SignUp';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <div className="animated-bg"></div>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutSchool />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/oge" element={<OgeInfo />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
