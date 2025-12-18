import React from 'react';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div>
            <h1 style={{ marginBottom: '1rem', color: '#1f2937' }}>Профиль</h1>

            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                maxWidth: '600px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>
                        {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h2 style={{ margin: '0 0 0.5rem 0' }}>{user?.full_name || 'Пользователь'}</h2>
                        <p style={{ margin: 0, color: '#6b7280' }}>{user?.email || 'Email не указан'}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Имя и фамилия
                        </label>
                        <input
                            type="text"
                            defaultValue={user?.full_name || ''}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '500',
                            color: '#374151'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            defaultValue={user?.email || ''}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Сохранить изменения
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;