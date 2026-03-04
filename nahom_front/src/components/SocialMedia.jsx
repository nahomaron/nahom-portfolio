import React from 'react';
import { BsInstagram, BsGithub, BsFacebook, BsLinkedin } from 'react-icons/bs';

const SocialMedia = () => (
  <div className="app__social">
    <div>
      <a href='https://github.com/nahomaron'
        target="_blank" rel="noreferrer">
        <BsGithub />
      </a>
      
    </div>
    <div>
      <a href='https://www.linkedin.com/in/nahomaron/'
        target="_blank" rel="noreferrer">
        <BsLinkedin />
      </a>
    </div>
    <div>
      <a href='https://www.instagram.com/nahom734/'
        target="_blank" rel="noreferrer">
        <BsInstagram />
      </a>
    </div>
  </div>
);

export default SocialMedia;
