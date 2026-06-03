# Frontend Structure

This project uses a feature-based React structure:

- `app/`: application bootstrap, providers, and router.
- `features/`: business modules such as auth, dashboard, interviews, and history.
- `layouts/`: route layouts shared by pages.
- `shared/`: reusable components, hooks, constants, utilities, and API clients.
- `config/`: app-level configuration.
- `assets/`: static assets imported by React components.

Keep domain-specific code inside its feature folder. Move code to `shared/` only when it is truly reused by multiple features.
