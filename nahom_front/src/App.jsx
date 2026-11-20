import React, { lazy, Suspense, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  About,
  Footer,
  Header,
  Honors,
  Research,
  Skills,
  Testimonial,
  Work,
} from './container';
import { Navbar } from './components';
const ProjectDetail = lazy(() => import('./pages/ProjectDetail/ProjectDetail'));
const Resume = lazy(() => import('./pages/Resume/Resume'));
import './App.scss';

const scrollToSection = (sectionId) => {
  if (typeof document === 'undefined' || !sectionId) {
    return false;
  }

  const target = document.getElementById(sectionId);
  if (!target) {
    return false;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
};

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stateTarget = location.state?.targetSection;
    const hashTarget = location.hash ? location.hash.replace('#', '') : '';
    const targetSection = stateTarget || hashTarget;

    if (!targetSection) {
      return;
    }

    const didScroll = scrollToSection(targetSection);

    if (didScroll && typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        window.history.replaceState(
          window.history.state,
          '',
          `#${targetSection}`,
        );
      });
    }

    if (stateTarget) {
      navigate(
        { pathname: '/', hash: `#${targetSection}` },
        { replace: true, state: null },
      );
    }
  }, [location, navigate]);

  return (
    <div className="app">
      <Navbar />
      <Header />
      <About />
      <Work />
      <Research />
      <Honors />
      <Skills />
      <Testimonial />
      <Footer />
    </div>
  );
};

const ProjectDetailPage = () => (
  <div className="app app__project-detail-page">
    <Navbar />
    <ProjectDetail />
    <Footer />
  </div>
);

const ResumePage = () => (
  <div className="app app__resume-page">
    <Navbar />
    <Resume />
    <Footer />
  </div>
);

const App = () => (
  <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <Suspense
        fallback={
          <p role="status" style={{ padding: '10rem 2rem' }}>
            Loading page…
          </p>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route
            path="*"
            element={
              <div className="app">
                <Navbar />
                <main style={{ padding: '10rem 2rem' }}>
                  <h1>Page not found</h1>
                  <a href="/">Return to portfolio</a>
                </main>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </MotionConfig>
);

export default App;
