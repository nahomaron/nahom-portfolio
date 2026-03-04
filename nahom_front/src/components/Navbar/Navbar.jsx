import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiMenuAlt4, HiMoon, HiSun, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

import { images } from '../../constants';
import './Navbar.scss';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = ['home', 'education', 'work', 'research', 'honors', 'skills', 'contact'];

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedTheme = window.localStorage.getItem('theme');
    const nextIsDark = storedTheme ? storedTheme === 'dark' : true;

    setIsDarkMode(nextIsDark);
    document.body.classList.toggle('theme-dark', nextIsDark);
  }, []);

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

      if (typeof window !== 'undefined' && window.location.hash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
      }
    } else {
      navigate('/', {
        state: { targetSection: section },
        replace: false,
      });
    }

    setToggle(false);
  };

  const handleLogoClick = (event) => handleNavClick(event, 'home');
  const handleThemeToggle = () => {
    const nextIsDark = !isDarkMode;
    setIsDarkMode(nextIsDark);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
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
            <a href={`/#${item}`} onClick={(event) => handleNavClick(event, item)}>
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
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <HiSun /> : <HiMoon />}
        </button>

        <div className="app__navbar-menu">
          <HiMenuAlt4 onClick={() => setToggle(true)} />

          {toggle && (
            <motion.div
              whileInView={{ x: [300, 0] }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
            >
              <HiX onClick={() => setToggle(false)} />
              <ul>
                {navItems.map((item) => (
                  <li key={item}>
                    <a href={`/#${item}`} onClick={(event) => handleNavClick(event, item)}>
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
