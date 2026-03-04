import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AppWrap } from '../../wrapper';
import { images } from '../../constants';
import './Header.scss';

const statHighlights = [
  { value: '5+', label: 'Years', detail: 'Java full-stack delivery' },
  { value: '99.9%', label: 'Uptime', detail: 'Production reliability focus' },
  { value: '20%', label: 'Faster Releases', detail: 'CI/CD improvement via GitHub Actions' },
];

const leadershipHighlights = [
  {
    title: 'Distributed Systems Builder',
    detail: 'Designed Kafka-backed microservices and gRPC APIs for high-throughput business workflows.',
  },
  {
    title: 'Cloud-Native Operator',
    detail: 'Deployed and maintained workloads on AWS with Docker + Kubernetes and performance-focused tuning.',
  },
  {
    title: 'Quality-Driven Engineer',
    detail: 'Advanced TDD with JUnit, Mockito, and RestAssured to improve confidence and maintainability.',
  },
];

const academicTracks = [
  'Java + Spring Boot',
  'Angular + TypeScript',
  'Microservices + Kafka',
  'CI/CD + GitHub Actions',
  'Docker + Kubernetes',
];

const communitySpotlight = [
  {
    title: 'NATNA Trading (2021-2025)',
    note: 'Delivered a trade and inventory platform supporting $10M+ annual volume with Spring Boot and React.',
  },
  {
    title: 'Freelance SaaS Platform',
    note: 'Built a multi-tenant membership platform serving 50+ organizations and 30K+ users.',
  },
];

const collaborators = [
  { logo: images.java, label: 'Java' },
  { logo: images.springBoot, label: 'Spring Boot' },
  { logo: images.angular, label: 'Angular' },
  { logo: images.kafka, label: 'Kafka' },
  { logo: images.docker, label: 'Docker' },
  { logo: images.javascript, label: 'JavaScript' },
  { logo: images.typescript, label: 'TypeScript' },
  { logo: images.kubernetes, label: 'Kubernetes' },
  { logo: images.codex, label: 'AI Agents (Codex)' },
  { logo: images.githubActions, label: 'GitHub Actions (CI/CD)' },
  { logo: images.amazon, label: 'AWS' },
  { logo: images.git, label: 'Git' },
];

const Header = () => (
  <div className="app__header">
    <motion.section
      whileInView={{ x: [-60, 0], opacity: [0, 1] }}
      transition={{ duration: 0.6 }}
      className="app__header-info"
    >
      <div className="hero-card">
        <p className="hero-card__eyebrow">Open to Software Engineering Roles</p>
        <h1 className="hero-card__title">Hi, I&apos;m Nahom. I build reliable Java microservices and modern full-stack products.</h1>
        <p className="hero-card__copy">
          I&apos;m a Java Full-Stack Engineer focused on Spring Boot, Angular/TypeScript, and event-driven
          microservices. I care about clean architecture, secure APIs, strong test coverage, and fast,
          dependable delivery through CI/CD. I&apos;m currently looking for software engineering opportunities
          where I can help teams ship scalable, production-ready systems.
        </p>
        <div className="focus-tags">
          {academicTracks.map((track) => (
            <span key={track}>{track}</span>
          ))}
        </div>
        <div className="hero-card__actions">
          <Link to="/resume" className="btn btn--primary">
            Resume
          </Link>
          <a href="#work" className="btn btn--ghost">
            View my work
          </a>
          <a href="#contact" className="btn btn--ghost">
            Get in touch
          </a>
        </div>
      </div>

      <div className="stat-grid">
        {statHighlights.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="stat-card__value">{stat.value}</span>
            <span className="stat-card__label">{stat.label}</span>
            <span className="stat-card__detail">{stat.detail}</span>
          </div>
        ))}
      </div>

      <div className="highlight-grid">
        {leadershipHighlights.map((highlight) => (
          <div key={highlight.title} className="highlight-card">
            <h3>{highlight.title}</h3>
            <p>{highlight.detail}</p>
          </div>
        ))}
      </div>

      <div className="profile-highlights">
        <h4>Career Highlights</h4>
        <ul>
          {communitySpotlight.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
    
    <motion.section
      whileInView={{ opacity: [0, 1], y: [40, 0] }}
      transition={{ duration: 0.8, delayChildren: 0.4 }}
      className="app__header-img"
    >
      <div className="profile-visual">
        <img src={images.profile} alt="Yafiet portrait" />
        <motion.img
          whileInView={{ scale: [0, 1] }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          src={images.circle}
          alt="Decorative circle"
          className="overlay_circle"
        />
        <div className="profile-visual__badge">First-gen Scholar</div>
        {/* <div className="profile-visual__badge profile-visual__badge--outline">QuestBridge Finalist</div> */}
      </div>

      <motion.section
        whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
        transition={{ duration: 0.6 }}
        className="app__header-pillars"
      >
        {collaborators.map((group, index) => (
          <div className="pillar-card" key={`${group.label}-${index}`}>
            <img src={group.logo} alt={group.label} />
            <span>{group.label}</span>
          </div>
        ))}
      </motion.section>

    </motion.section>
  </div>
);

export default AppWrap(Header, 'home');
