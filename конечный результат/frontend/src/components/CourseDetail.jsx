// src/components/CourseDetail.jsx - ИСПРАВЛЕННЫЙ КОД
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// Создаем моковый API если настоящий недоступен
const coursesAPI = {
    getById: async (id) => {
        console.log('📚 Загрузка курса ID:', id);
        return null;
    }
};

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('lessons');
    const [completedLessons, setCompletedLessons] = useState(new Set([1, 3]));
    const [currentLesson, setCurrentLesson] = useState(1);
    const [progress, setProgress] = useState(30);
    const [selectedPDF, setSelectedPDF] = useState(null);

    // PDF файлы для каждого курса - ПОДСТАВЬТЕ ВАШИ ФАЙЛЫ
    const getCoursePDFs = (courseId) => {
        const pdfs = {
            1: [ // Математика - 2 файла
                {
                    id: 1,
                    title: "Математика: Задание 6",
                    description: "Теория и практика по заданию 6 ОГЭ по математике",
                    fileName: "математика задание 6 .pdf",
                    filePath: "/pdf/courses/математика задание 6 .pdf",
                    size: "? МБ",
                    pages: "?",
                    type: "theory"
                },
                {
                    id: 2,
                    title: "Математика: Решения задания 6",
                    description: "Подробные решения задач по заданию 6",
                    fileName: "математика решения задание 6 .pdf",
                    filePath: "/pdf/courses/математика решения задание 6 .pdf",
                    size: "? МБ",
                    pages: "?",
                    type: "practice"
                }
            ],
            2: [ // Русский язык - 2 файла
                {
                    id: 1,
                    title: "Русский язык: Теория задания 9",
                    description: "Теоретические материалы по заданию 9 ОГЭ по русскому языку",
                    fileName: "русский теория 9 задание.pdf",
                    filePath: "/pdf/courses/русский теория 9 задание.pdf",
                    size: "? МБ",
                    pages: "?",
                    type: "theory"
                },
                {
                    id: 2,
                    title: "Русский язык: Практика задания 9",
                    description: "Практические задания и упражнения по заданию 9",
                    fileName: "русский практика 9 задание.pdf",
                    filePath: "/pdf/courses/русский практика 9 задание.pdf",
                    size: "? МБ",
                    pages: "?",
                    type: "practice"
                }
            ],
            3: [ // Физика - пока без файлов
                {
                    id: 1,
                    title: "Физика: Теория",
                    description: "Теоретические материалы скоро будут добавлены",
                    fileName: "physics_theory.pdf",
                    filePath: "#",
                    size: "Скоро",
                    pages: "-",
                    type: "theory"
                }
            ],
            4: [ // Информатика - 2 файла
                {
                    id: 1,
                    title: "Информатика: Конспект задания 1",
                    description: "Теоретический конспект по заданию 1 ОГЭ по информатике",
                    fileName: "информатика 1 задание конспект.pdf",
                    filePath: "/pdf/courses/информатика 1 задание конспект.pdf",
                    size: "? МБ",
                    pages: "?",
                    type: "theory"
                },
                {
                    id: 2,
                    title: "Информатика: Практика задания 1",
                    description: "Практические задания по заданию 1 ОГЭ по информатике",
                    fileName: "информатика 1 задание практика.pdf",
                    filePath: "/pdf/courses/информатика 1 задание практика.pdf",
                    size: "? МБ",
                    pages: "?",
                    type: "practice"
                }
            ]
        };

        return pdfs[courseId] || [];
    };

    // Моковые данные курсов (оставляем как было)
    const getMockCourse = (courseId) => {
        const courses = {
            1: {
                id: 1,
                title: "Математика ОГЭ - полный курс",
                description: "Комплексная подготовка к ОГЭ по математике с нуля до уверенного решения всех заданий.",
                duration: "8 месяцев",
                level: "Средний",
                image: "📐",
                lessons: [
                    { id: 1, title: "Задание 6: Теория", duration: "45 мин", type: "pdf", description: "Изучите теоретические материалы" },
                    { id: 2, title: "Задание 6: Практика", duration: "60 мин", type: "pdf", description: "Решите практические задачи" }
                ]
            },
            2: {
                id: 2,
                title: "Русский язык ОГЭ",
                description: "Системная подготовка к тестовой части и сочинению с опытным филологом.",
                duration: "6 месяцев",
                level: "Начальный",
                image: "📚",
                lessons: [
                    { id: 1, title: "Задание 9: Теория", duration: "40 мин", type: "pdf", description: "Изучите теоретические материалы" },
                    { id: 2, title: "Задание 9: Практика", duration: "55 мин", type: "pdf", description: "Выполните практические задания" }
                ]
            },
            3: {
                id: 3,
                title: "Физика ОГЭ",
                description: "Увлекательное изучение физики с экспериментами и практическими заданиями.",
                duration: "7 месяцев",
                level: "Средний",
                image: "⚡",
                lessons: [
                    { id: 1, title: "Основы механики", duration: "50 мин", type: "video", description: "Законы Ньютона" },
                    { id: 2, title: "Кинематика", duration: "65 мин", type: "video", description: "Движение тел" }
                ]
            },
            4: {
                id: 4,
                title: "Информатика ОГЭ + Python",
                description: "Современный подход к изучению информатики с акцентом на практическое программирование.",
                duration: "5 месяцев",
                level: "Начинающий",
                image: "💻",
                lessons: [
                    { id: 1, title: "Задание 1: Конспект", duration: "45 мин", type: "pdf", description: "Изучите теоретический конспект" },
                    { id: 2, title: "Задание 1: Практика", duration: "55 мин", type: "pdf", description: "Выполните практические задания" }
                ]
            }
        };

        return courses[courseId] || {
            id: courseId,
            title: `Курс ${courseId}`,
            description: "Описание курса",
            image: "📚",
            lessons: []
        };
    };

    useEffect(() => {
        fetchCourseDetails();
        const savedProgress = localStorage.getItem(`course_${id}_progress`);
        if (savedProgress) {
            setProgress(parseInt(savedProgress));
        }

        const savedCompleted = localStorage.getItem(`course_${id}_completed`);
        if (savedCompleted) {
            setCompletedLessons(new Set(JSON.parse(savedCompleted)));
        }
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            console.log(`📚 Загрузка деталей курса ID: ${id}`);

            const data = await coursesAPI.getById(id);
            console.log('✅ Данные курса:', data);

            if (!data) {
                setCourse(getMockCourse(id));
            } else {
                setCourse(data);
            }

        } catch (error) {
            console.error('❌ Ошибка загрузки курса:', error);
            setCourse(getMockCourse(id));
        } finally {
            setLoading(false);
        }
    };

    const handleLessonClick = (lessonId) => {
        setCurrentLesson(lessonId);

        if (!completedLessons.has(lessonId)) {
            const newCompleted = new Set([...completedLessons, lessonId]);
            setCompletedLessons(newCompleted);

            localStorage.setItem(`course_${id}_completed`, JSON.stringify([...newCompleted]));

            const totalLessons = course?.lessons?.length || 1;
            const newProgress = Math.round((newCompleted.size / totalLessons) * 100);
            setProgress(newProgress);
            localStorage.setItem(`course_${id}_progress`, newProgress.toString());

            console.log(`✅ Урок ${lessonId} отмечен как завершенный`);
        }
    };

    const handleOpenPDF = (pdf) => {
        if (pdf.filePath === "#") {
            alert('Файл скоро будет доступен!');
            return;
        }

        setSelectedPDF(pdf);
        // Открываем PDF в новой вкладке
        window.open(pdf.filePath, '_blank');
    };

    const handleDownloadAll = () => {
        const pdfs = getCoursePDFs(parseInt(id));
        const availablePDFs = pdfs.filter(pdf => pdf.filePath !== "#");

        if (availablePDFs.length === 0) {
            alert('Нет доступных файлов для скачивания');
            return;
        }

        alert(`Начинаем загрузку ${availablePDFs.length} PDF файлов для курса "${course?.title}"`);

        // Открываем каждый файл в новой вкладке
        availablePDFs.forEach(pdf => {
            window.open(pdf.filePath, '_blank');
        });
    };

    // Получаем PDF для текущего курса
    const coursePDFs = getCoursePDFs(parseInt(id));

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f8fafc'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #e5e7eb',
                        borderTopColor: '#4f46e5',
                        borderRadius: '50%',
                        margin: '0 auto 1rem',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ color: '#6b7280' }}>Загружаем курс...</p>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            // ДОБАВЛЯЕМ ОТСТУП ДЛЯ HEADER
            paddingTop: '80px' // Высота вашего хедера
        }}>
            {/* Шапка курса */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '2rem 0'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 2rem'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '2rem',
                        flexWrap: 'wrap',
                        gap: '2rem'
                    }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    fontSize: '2rem',
                                    width: '60px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '12px'
                                }}>
                                    {course.image}
                                </div>
                                <div>
                                    <Link
                                        to="/courses"
                                        style={{
                                            color: 'rgba(255,255,255,0.9)',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        ← Назад к курсам
                                    </Link>
                                </div>
                            </div>

                            <h1 style={{
                                margin: '0 0 1rem 0',
                                fontSize: '2rem',
                                fontWeight: 'bold'
                            }}>
                                {course.title}
                            </h1>

                            <p style={{
                                margin: 0,
                                opacity: 0.9,
                                fontSize: '1.1rem',
                                maxWidth: '800px'
                            }}>
                                {course.description}
                            </p>
                        </div>

                        {/* Прогресс */}
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            minWidth: '250px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.9rem',
                                    opacity: 0.9
                                }}>
                                    <span>Прогресс обучения</span>
                                    <span>{progress}%</span>
                                </div>
                                <div style={{
                                    height: '8px',
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div
                                        style={{
                                            width: `${progress}%`,
                                            height: '100%',
                                            background: 'white',
                                            borderRadius: '4px',
                                            transition: 'width 0.5s ease'
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.9rem',
                                opacity: 0.9,
                                marginBottom: '1rem'
                            }}>
                                <div>
                                    <div>Доступно PDF:</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {coursePDFs.filter(p => p.filePath !== "#").length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Вкладки */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        borderBottom: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        {['lessons', 'materials'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    background: 'none',
                                    color: 'white',
                                    border: 'none',
                                    borderBottom: `3px solid ${activeTab === tab ? 'white' : 'transparent'}`,
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    fontWeight: activeTab === tab ? '600' : '400',
                                    opacity: activeTab === tab ? 1 : 0.7,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab === 'lessons' && '📚 Уроки'}
                                {tab === 'materials' && '📁 Учебные материалы'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Основное содержимое */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem',
                display: 'grid',
                gridTemplateColumns: '1fr 350px',
                gap: '2rem'
            }}>
                {/* Левая колонка - контент */}
                <div>
                    {activeTab === 'lessons' && (
                        <div>
                            <h2 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Уроки курса</h2>

                            {/* Список уроков */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {course.lessons?.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        onClick={() => handleLessonClick(lesson.id)}
                                        style={{
                                            background: currentLesson === lesson.id ? '#f3f4f6' : 'white',
                                            border: `1px solid ${currentLesson === lesson.id ? '#4f46e5' : '#e5e7eb'}`,
                                            borderRadius: '10px',
                                            padding: '1rem 1.25rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem'
                                        }}
                                    >
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            background: completedLessons.has(lesson.id) ? '#10b981' :
                                                currentLesson === lesson.id ? '#4f46e5' : '#f3f4f6',
                                            color: completedLessons.has(lesson.id) ? 'white' :
                                                currentLesson === lesson.id ? 'white' : '#6b7280',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem'
                                        }}>
                                            {completedLessons.has(lesson.id) ? '✓' : lesson.id}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: '1rem',
                                                color: '#1f2937'
                                            }}>
                                                {lesson.title}
                                            </h3>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '0.9rem',
                                                color: '#6b7280'
                                            }}>
                                                {lesson.description}
                                            </p>
                                        </div>

                                        <span style={{
                                            fontSize: '0.85rem',
                                            color: '#6b7280',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            {lesson.type === 'pdf' ? '📄 PDF' : '🎬 Видео'}
                                            {lesson.duration}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'materials' && (
                        <div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <h2 style={{ margin: 0, color: '#1f2937' }}>
                                    📚 Учебные материалы ({coursePDFs.filter(p => p.filePath !== "#").length} файлов)
                                </h2>
                                <button
                                    onClick={handleDownloadAll}
                                    disabled={coursePDFs.filter(p => p.filePath !== "#").length === 0}
                                    style={{
                                        padding: '0.6rem 1.2rem',
                                        background: coursePDFs.filter(p => p.filePath !== "#").length === 0 ? '#9ca3af' : '#4f46e5',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: coursePDFs.filter(p => p.filePath !== "#").length === 0 ? 'not-allowed' : 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        opacity: coursePDFs.filter(p => p.filePath !== "#").length === 0 ? 0.7 : 1
                                    }}
                                >
                                    ⬇️ Скачать все материалы
                                </button>
                            </div>

                            {/* Список PDF файлов */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {coursePDFs.map((pdf) => (
                                    <div
                                        key={pdf.id}
                                        style={{
                                            background: pdf.filePath === "#" ? '#f9fafb' : 'white',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            border: `1px solid ${pdf.filePath === "#" ? '#d1d5db' : '#e5e7eb'}`,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            transition: 'all 0.3s ease',
                                            cursor: pdf.filePath === "#" ? 'default' : 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            opacity: pdf.filePath === "#" ? 0.7 : 1
                                        }}
                                        onClick={() => pdf.filePath !== "#" && handleOpenPDF(pdf)}
                                        onMouseEnter={(e) => {
                                            if (pdf.filePath !== "#") {
                                                e.currentTarget.style.transform = 'translateY(-5px)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (pdf.filePath !== "#") {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                            }
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '1rem',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{
                                                fontSize: '2rem',
                                                width: '60px',
                                                height: '60px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: pdf.type === 'theory' ? '#f0f9ff' :
                                                    pdf.type === 'practice' ? '#f0fdf4' : '#f3f4f6',
                                                borderRadius: '10px',
                                                color: pdf.type === 'theory' ? '#1e40af' :
                                                    pdf.type === 'practice' ? '#166534' : '#6b7280'
                                            }}>
                                                {pdf.type === 'theory' ? '📘' :
                                                    pdf.type === 'practice' ? '📝' : '📄'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{
                                                    margin: '0 0 0.5rem 0',
                                                    fontSize: '1.1rem',
                                                    color: '#1f2937'
                                                }}>
                                                    {pdf.title}
                                                </h3>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '0.9rem',
                                                    color: '#6b7280',
                                                    lineHeight: 1.4
                                                }}>
                                                    {pdf.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginTop: 'auto',
                                            paddingTop: '1rem',
                                            borderTop: '1px solid #e5e7eb'
                                        }}>
                                            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                                <div style={{ marginBottom: '0.25rem' }}>
                                                    <strong>Файл:</strong> {pdf.fileName}
                                                </div>
                                                <div>
                                                    <strong>Размер:</strong> {pdf.size}
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenPDF(pdf);
                                                }}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: pdf.filePath === "#" ? '#9ca3af' :
                                                        pdf.type === 'theory' ? '#3b82f6' : '#10b981',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: pdf.filePath === "#" ? 'default' : 'pointer',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    opacity: pdf.filePath === "#" ? 0.7 : 1
                                                }}
                                            >
                                                {pdf.filePath === "#" ? '⏳ Скоро' : '📥 Открыть'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {coursePDFs.length === 0 && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '3rem',
                                    background: 'white',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                                    <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>
                                        Материалы скоро появятся
                                    </h3>
                                    <p style={{ color: '#6b7280' }}>
                                        Учебные материалы для этого курса готовятся
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Правая колонка - боковая панель */}
                <div>
                    {/* Карточка курса */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        border: '1px solid #e5e7eb',
                        position: 'sticky',
                        top: '2rem'
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>📊 Статистика курса</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                    Материалы доступно
                                </div>
                                <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.2rem' }}>
                                    {coursePDFs.filter(p => p.filePath !== "#").length} PDF файлов
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                    Уровень сложности
                                </div>
                                <div style={{ fontWeight: '600', color: '#1f2937' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        background: course.level === 'Начальный' ? '#d1fae5' :
                                            course.level === 'Средний' ? '#dbeafe' : '#fef3c7',
                                        color: course.level === 'Начальный' ? '#065f46' :
                                            course.level === 'Средний' ? '#1e40af' : '#92400e',
                                        borderRadius: '1rem',
                                        fontSize: '0.8rem'
                                    }}>
                                        {course.level}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                            <div style={{
                                background: '#f0f9ff',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #dbeafe'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '1.25rem' }}>💡</span>
                                    <span style={{ fontWeight: '500', color: '#1e40af' }}>Как работать с материалами</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#4b5563' }}>
                                    1. Откройте файл в браузере<br/>
                                    2. Скачайте на компьютер<br/>
                                    3. Распечатайте для удобства<br/>
                                    4. Делайте пометки при изучении
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Баннер поддержки */}
                    <div style={{
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #f59e0b'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❓</div>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>Вопросы по материалам?</h4>
                        <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}>
                            Есть вопросы по PDF файлам?<br/>
                            Задавайте их в комментариях к урокам
                        </p>
                    </div>
                </div>
            </div>

            {/* Информация о файлах в футере */}
            <div style={{
                background: '#f8fafc',
                padding: '2rem',
                borderTop: '1px solid #e5e7eb',
                marginTop: '2rem'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                        📄 Все PDF файлы оптимизированы для печати и удобного чтения
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#9ca3af', fontSize: '0.8rem' }}>
                        Для открытия файлов требуется Adobe Reader или другой PDF-ридер
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;