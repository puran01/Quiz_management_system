# PLAN

## Assumptions

- The application is intended to cover only the core quiz functionality without additional complexity.
- The system is expected to handle a small number of users and quizzes.
- Quizzes are assumed to be publicly accessible, without user authentication.
- The database is assumed to run locally during development.
- Advanced performance, security, and scaling concerns are intentionally out of scope.

---

## Scope

- The project focuses on building a simple quiz application with a frontend and a backend API.
- The frontend handles quiz interaction and result display.
- The backend is responsible for quiz data management and result storage.
- The database schema is designed to be extendable for future features.

---

## Approach

- A REST-based architecture is used to keep the frontend and backend loosely coupled.
- The frontend is built using React with JSX to allow quick iteration and UI-driven API design.
- The frontend was implemented first so backend endpoints could be designed to directly support user flows.
- The backend is implemented using FastAPI, paired with PostgreSQL for structured data storage.
- The overall structure is kept modular to allow future enhancements without major refactoring.

---

## Scope Changes During Implementation

- A heavier backend framework(Django) was initially considered.
- FastAPI was chosen instead because the project required a lightweight API layer, and simpler tooling allowed faster development and clearer request handling.

---

## Reflection: What I Would Do With More Time

If I had more time, I would:
- Improve the UI with better styling and responsiveness
- Make the database schema more scalable and flexible
- Add caching to support higher load scenarios
- Strengthen backend validations and error handling
- Enhance the UI with pagination, improved navigation, and better feedback for users
