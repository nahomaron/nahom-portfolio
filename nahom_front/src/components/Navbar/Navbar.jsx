import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiMenuAlt4, HiMoon, HiSun, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

import { images } from '../../constants';
import './Navbar.scss';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuButton = useRef(null);
  const menuPanel = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    'home',
    'education',
    'work',
    'research',
    'honors',
    'skills',
    'contact',
  ];

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let storedTheme;
    try {
      storedTheme = window.localStorage.getItem('theme');
    } catch {
      /* Storage may be disabled. */
    }
    const nextIsDark = storedTheme ? storedTheme === 'dark' : true;

    setIsDarkMode(nextIsDark);
    document.body.classList.toggle('theme-dark', nextIsDark);
  }, []);

  useEffect(() => {
    if (!toggle) return;
    const panel = menuPanel.current;
    panel?.querySelector('button')?.focus();
    const close = () => {
      setToggle(false);
      menuButton.current?.focus();
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
      if (event.key === 'Tab') {
        const items = panel?.querySelectorAll('button, a[href]');
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const media = window.matchMedia('(min-width: 900px)');
    const handleResize = () => {
      if (media.matches) setToggle(false);
    };
    document.addEventListener('keydown', handleKey);
    media.addEventListener('change', handleResize);
    return () => {
      document.removeEventListener('keydown', handleKey);
      media.removeEventListener('change', handleResize);
    };
  }, [toggle]);

  const handleNavClick = (event, section) => {
    if (event) {
      event.preventDefault();
    }
    const targetHash = `#${section}`;
    const isHome = location.pathname === '/';

    if (isHome && typeof document !== 'undefined') {
      const target = document.getElementById(section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      if (
        typeof window !== 'undefined' &&
        window.location.hash !== targetHash
      ) {
        window.history.replaceState(window.history.state, '', targetHash);
      }
    } else {
      navigate('/', {
        state: { targetSection: section },
        replace: false,
      });
    }

    if (toggle) menuButton.current?.focus();
    setToggle(false);
  };

  const handleLogoClick = (event) => handleNavClick(event, 'home');
  const handleThemeToggle = () => {
    const nextIsDark = !isDarkMode;
    setIsDarkMode(nextIsDark);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
      } catch {
        /* Theme still works without persistence. */
      }
    }

    if (typeof document !== 'undefined') {
      document.body.classList.toggle('theme-dark', nextIsDark);
    }
  };

  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <a href="/#home" onClick={handleLogoClick}>
          <img src={images.logo} alt="logo" />
        </a>
      </div>
      <ul className="app__navbar-links">
        {navItems.map((item) => (
          <li className="app__flex p-text" key={`link-${item}`}>
            <div />
            <a
              href={`/#${item}`}
              onClick={(event) => handleNavClick(event, item)}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      <div className="app__navbar-right">
        <button
          type="button"
          className="app__navbar-theme-toggle"
          onClick={handleThemeToggle}
          aria-label={
            isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
          }
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <HiSun /> : <HiMoon />}
        </button>

        <div className="app__navbar-menu">
          <button
            ref={menuButton}
            type="button"
            className="menu-icon-button"
            aria-label="Open navigation"
            aria-expanded={toggle}
            aria-controls="mobile-navigation"
            onClick={() => setToggle(true)}
          >
            <HiMenuAlt4 aria-hidden="true" />
          </button>

          {toggle && (
            <motion.div
              id="mobile-navigation"
              ref={menuPanel}
              role="dialog"
              aria-label="Mobile navigation"
              whileInView={{ x: [300, 0] }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
            >
              <button
                type="button"
                className="menu-icon-button"
                aria-label="Close navigation"
                onClick={() => {
                  setToggle(false);
                  menuButton.current?.focus();
                }}
              >
                <HiX aria-hidden="true" />
              </button>
              <ul>
                {navItems.map((item) => (
                  <li key={item}>
                    <a
                      href={`/#${item}`}
                      onClick={(event) => handleNavClick(event, item)}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
