# Nahom Portfolio Monorepo

This repository contains both:

- `nahom_front`: React portfolio frontend
- `nahom_back`: Sanity Studio backend/content management

## Project Structure

```text
nahom_new/
  nahom_front/   # Frontend app
  nahom_back/    # Sanity Studio schemas/content
```

## Local Development

### 1) Start Sanity Studio (backend)

```bash
cd nahom_back
npm install
npm run start
```

### 2) Start Frontend

```bash
cd nahom_front
npm install
npm start
```

## Notes

- Resume and portfolio content are sourced from Sanity.
- Configure environment variables in `nahom_front/.env`.
- Keep this as a single Git repository for coordinated frontend/backend changes.
