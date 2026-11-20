import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppWrap, MotionWrap } from '../../wrapper';
import { urlFor, client } from '../../client';
import './Work.scss';

const Work = () => {
  const [works, setWorks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    client
      .fetch('*[_type == "works"] | order(_createdAt desc)')
      .then((data) => {
        if (active) setWorks(data || []);
      })
      .catch(() => {
        if (active)
          setError('Projects could not be loaded. Please try again later.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const filtered =
    activeFilter === 'All'
      ? works
      : works.filter((work) => work.tags?.includes(activeFilter));
  return (
    <>
      <h2 className="head-text">
        Selected <span>Projects</span>
      </h2>
      <div className="app__work-filter" aria-label="Filter projects">
        {['AI', 'Web', 'Cyber Security', 'Teaching', 'All'].map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setActiveFilter(item)}
            aria-pressed={activeFilter === item}
            className={`app__work-filter-item app__flex p-text ${activeFilter === item ? 'item-active' : ''}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div
        className="app__work-portfolio"
        aria-live="polite"
        aria-busy={loading}
      >
        {loading && <p>Loading projects…</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && !filtered.length && (
          <p>No projects in this category yet.</p>
        )}
        {filtered.map((work) => {
          const image = work.imgUrl?.asset
            ? work.imgUrl
            : work.coverImage?.asset
              ? work.coverImage
              : null;
          const detailUrl = work.slug?.current
            ? `/projects/${encodeURIComponent(work.slug.current)}`
            : null;
          return (
            <article className="app__work-item app__flex" key={work._id}>
              {image && (
                <div className="app__work-img app__flex">
                  <img
                    src={urlFor(image).width(600).auto('format').url()}
                    alt={work.title || 'Project preview'}
                    loading="lazy"
                  />
                </div>
              )}
              <div className="app__work-content app__flex">
                <h3 className="bold-text">
                  {detailUrl ? (
                    <Link to={detailUrl}>{work.title}</Link>
                  ) : (
                    work.title
                  )}
                </h3>
                <p className="p-text" style={{ marginTop: 10 }}>
                  {work.description}
                </p>
                <div className="project-card-actions">
                  {detailUrl && <Link to={detailUrl}>View details</Link>}
                  {work.projectLink && (
                    <a href={work.projectLink} target="_blank" rel="noreferrer">
                      Live project
                    </a>
                  )}
                  {work.codeLink && (
                    <a href={work.codeLink} target="_blank" rel="noreferrer">
                      Source code
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
};
export default AppWrap(
  MotionWrap(Work, 'app__works'),
  'work',
  'app__primarybg',
);
