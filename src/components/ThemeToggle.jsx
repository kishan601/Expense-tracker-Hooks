import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    } else {
      setDarkMode(false);
      document.body.classList.remove('dark-mode');
    }
  }, []);
  
  const toggleTheme = () => {
    if (darkMode) {
      // Switch to light mode
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to dark mode
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };
  
  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle-btn"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        backgroundColor: darkMode ? '#f1f5f9' : '#1e293b',
        color: darkMode ? '#1e293b' : '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        border: 'none',
        boxShadow: 'var(--shadow-lg)',
        cursor: 'pointer',
        transition: 'var(--transition)',
        zIndex: 100
      }}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}