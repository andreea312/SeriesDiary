# PoC Angular Web Application: SeriesDiary

SeriesDiary is an intuitive and user-friendly Angular web application designed for TV series enthusiasts  
who want to keep track of their favorite shows. Acting like a personal diary, the platform allows  
authenticated users to express their preferences and record thoughts or impressions about the series they  
want, through reviews.

## The application provides:

- User authentication (signup, login, logout) using `localStorage`
- CRUD-style management of TV series with local caching per user via `localStorage`:
  - Searching by substring of title
  - Adding to favorites
  - Removing from favorites
  - Adding reviews

## The application structure contains:

- **Model:** contains entities classes: `UserSignup`, `UserLogin`, and `Series`
- **Routing:** Centralized routing configuration with guard-protected routes
- **Pages:** `Login`, `Signup`, `Home`, `Series`, `Favorites`, `Header` (modular components)
- **Services:**
  - Authentication: `auth.service.ts`
  - Series Management: `series.service.ts`

## For more details see Documentation.pdf
