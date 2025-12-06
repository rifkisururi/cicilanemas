'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('system');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        }
    }, []);

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement;

        if (newTheme === 'system') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', newTheme);
        }
    };

    const handleThemeChange = () => {
        const themes: Theme[] = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];

        setTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
        applyTheme(nextTheme);
    };

    if (!mounted) {
        return (
            <button className="theme-toggle" aria-label="Toggle theme">
                <span className="theme-icon">🌙</span>
            </button>
        );
    }

    const getIcon = () => {
        switch (theme) {
            case 'light':
                return '☀️';
            case 'dark':
                return '🌙';
            case 'system':
                return '💻';
        }
    };

    const getLabel = () => {
        switch (theme) {
            case 'light':
                return 'Light';
            case 'dark':
                return 'Dark';
            case 'system':
                return 'Auto';
        }
    };

    return (
        <button
            onClick={handleThemeChange}
            className="theme-toggle"
            aria-label={`Current theme: ${theme}. Click to change.`}
            title={`Theme: ${getLabel()}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
            }}
        >
            <span className="theme-icon">{getIcon()}</span>
            <span className="theme-label" style={{ display: 'none' }}>
                {getLabel()}
            </span>
        </button>
    );
}
