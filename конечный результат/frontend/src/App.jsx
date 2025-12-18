
// App.jsx
import AppRouter from './Router';
import './App.css';

function App() {
    return (
        <div className="App">
            <div className="animated-background">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                </div>
            </div>

            {/* Убираем обертку page-content-wrapper, так как она будет в Router.jsx */}
            <AppRouter />

            <Footer />
        </div>
    );
}

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>ОГЭМастер</h3>
                    <p>Профессиональная подготовка к ОГЭ с 2018 года</p>
                    <div className="social-links">
                        <a href="#" aria-label="VKontakte" className="social-link">VK</a>
                        <a href="#" aria-label="Telegram" className="social-link">TG</a>
                        <a href="#" aria-label="YouTube" className="social-link">YT</a>
                    </div>
                </div>
                <div className="footer-section">
                    <h4>Курсы</h4>
                    <a href="/courses">Математика ОГЭ</a>
                    <a href="/courses">Русский язык ОГЭ</a>
                    <a href="/courses">Физика ОГЭ</a>
                </div>
                <div className="footer-section">
                    <h4>Контакты</h4>
                    <p>📞 +7 (999) 123-45-67</p>
                    <p>✉️ info@ogemaster.ru</p>
                    <p>🕒 Пн-Пт: 9:00-21:00</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 ОГЭМастер. Все права защищены.</p>
            </div>
        </footer>
    );
};

export default App;