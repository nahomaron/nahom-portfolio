import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { AppWrap, MotionWrap } from '../../wrapper';
import './Research.scss';
import { urlFor, client } from '../../client';

const Research = () => {
  const [researches, setResearches] = useState([]);

  useEffect(() => {
    const query = '*[_type == "researches"]';

    client
      .fetch(query)
      .then((data) => {
        setResearches(data);
      })
      .catch((error) => {
        console.error('Failed to fetch researches:', error);
        setResearches([]);
      });
  }, []);

  return (
    <>
      <h2 className="head-text">Greate Work Emerges from<br/><span>Greate Research</span></h2>

      <div className="app__profiles">
        {researches.map((research, index) => (
          <motion.div
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5, type: 'tween' }}
            className="app__profile-item"
            key={research.title + index}
          >
            <a href={research.paperUrl} target="_blank" rel="noreferrer">
              <img src={urlFor(research.imgUrl)} alt={research.title} />
            </a>
            <h2 className="bold-text" style={{ marginTop: 20 }}>{research.title}</h2>
            <p className="p-text" style={{ marginTop: 10 }}>{research.description}</p>
          </motion.div>
        ))}
        </div>
    </>
  );
};

export default AppWrap(
  MotionWrap(Research, 'app__research'),
  'research',
  'app__whitebg',
);
