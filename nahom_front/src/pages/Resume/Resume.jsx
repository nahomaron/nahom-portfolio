import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { client } from '../../client';
import './Resume.scss';

const Resume = () => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client
      .fetch('*[_type == "resume"][0]')
      .then((data) => {
        setResume(data || null);
      })
      .catch(() => {
        setError('Unable to load resume right now.');
      })
      .finally(() => setLoading(false));
  }, []);

  const contactLine = useMemo(() => {
    if (!resume) return '';

    return [resume.location, resume.phone, resume.email, resume.linkedin]
      .filter(Boolean)
      .join(' • ');
  }, [resume]);

  const resumePdfUrl = resume?.resumePdf?.asset?.url || '';

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/#home');
  };

  if (loading) {
    return (
      <main className="resume-page resume-page--state">
        <p className="p-text">Loading resume…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="resume-page resume-page--state">
        <p className="p-text">{error}</p>
      </main>
    );
  }

  if (!resume) {
    return (
      <main className="resume-page resume-page--state">
        <p className="p-text">No resume content found in Sanity yet.</p>
      </main>
    );
  }

  return (
    <main className="resume-page">
      <div className="resume-page__topbar">
        <button type="button" className="resume-btn resume-btn--ghost" onClick={handleBack}>
          Back
        </button>
      </div>

      <section className="resume-card">
        <header className="resume-header">
          <h1>{resume.fullName}</h1>
          {resume.title && <p className="resume-header__title">{resume.title}</p>}
          {contactLine && <p className="resume-header__contact">{contactLine}</p>}
          {resume.authorization && <p className="resume-header__auth">{resume.authorization}</p>}
          <div className="resume-header__actions">
            {resumePdfUrl && (
              <a
                className="resume-btn resume-btn--primary"
                href={resumePdfUrl}
                target="_blank"
                rel="noreferrer"
              >
                Download PDF
              </a>
            )}
          </div>
        </header>

        {resume.summary && (
          <section className="resume-section">
            <h2>Summary</h2>
            <p>{resume.summary}</p>
          </section>
        )}

        {resume.technicalSkills && (
          <section className="resume-section">
            <h2>Technical Skills</h2>
            <div className="resume-skill-list">
              {resume.technicalSkills.languagesAndFrameworks && (
                <p>
                  <strong>Languages &amp; Frameworks:</strong>{' '}
                  {resume.technicalSkills.languagesAndFrameworks}
                </p>
              )}
              {resume.technicalSkills.toolsAndQuality && (
                <p>
                  <strong>Tools &amp; Quality:</strong> {resume.technicalSkills.toolsAndQuality}
                </p>
              )}
              {resume.technicalSkills.cloudAndDatabases && (
                <p>
                  <strong>Cloud &amp; Databases:</strong> {resume.technicalSkills.cloudAndDatabases}
                </p>
              )}
            </div>
          </section>
        )}

        {Array.isArray(resume.workExperience) && resume.workExperience.length > 0 && (
          <section className="resume-section">
            <h2>Work Experience</h2>
            <div className="resume-timeline">
              {resume.workExperience.map((job) => (
                <article className="resume-item" key={job._key || `${job.role}-${job.company}`}>
                  <div className="resume-item__head">
                    <h3>{job.role}</h3>
                    <p>{[job.company, job.location].filter(Boolean).join(' | ')}</p>
                    <span>{job.period}</span>
                  </div>
                  {Array.isArray(job.highlights) && job.highlights.length > 0 && (
                    <ul>
                      {job.highlights.map((point, index) => (
                        <li key={`${job._key || job.role}-point-${index}`}>{point}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {Array.isArray(resume.projects) && resume.projects.length > 0 && (
          <section className="resume-section">
            <h2>Projects</h2>
            <div className="resume-timeline">
              {resume.projects.map((project) => (
                <article
                  className="resume-item"
                  key={project._key || `${project.name}-${project.period}`}
                >
                  <div className="resume-item__head">
                    <h3>{project.name}</h3>
                    <p>{project.context}</p>
                    <span>{project.period}</span>
                  </div>
                  {Array.isArray(project.highlights) && project.highlights.length > 0 && (
                    <ul>
                      {project.highlights.map((point, index) => (
                        <li key={`${project._key || project.name}-point-${index}`}>{point}</li>
                      ))}
                    </ul>
                  )}
                  {project.techStack && (
                    <p className="resume-item__stack">
                      <strong>Tech Stack:</strong> {project.techStack}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {Array.isArray(resume.education) && resume.education.length > 0 && (
          <section className="resume-section">
            <h2>Education</h2>
            <div className="resume-timeline">
              {resume.education.map((school) => (
                <article className="resume-item" key={school._key || `${school.degree}-${school.school}`}>
                  <div className="resume-item__head">
                    <h3>{school.degree}</h3>
                    <p>{school.school}</p>
                    <span>{school.period}</span>
                  </div>
                  {Array.isArray(school.highlights) && school.highlights.length > 0 && (
                    <ul>
                      {school.highlights.map((point, index) => (
                        <li key={`${school._key || school.school}-point-${index}`}>{point}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
};

export default Resume;
