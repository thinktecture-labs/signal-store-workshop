# NgRx Signal Store Workshop

Hands-on app for the workshop "@ngrx/signals: Reactive State Management in Angular" at Angular Days. A small movie and TV browser on top of the TMDB API: trending titles, search, details and a watchlist, plus a todo list. Angular 22, NgRx 22.

## Setup

```bash
npm install
npm start
```

Open <http://localhost:4200>. The dev server proxies TMDB requests and uses the workshop API key from `.env.example`. To use your own key, copy `.env.example` to `.env` and replace the token; `.env` takes precedence and is not committed.

## Labs

Each exercise folder has a `README.md` with the task and a `solution/`; the store to complete sits in the app, next to the component that uses it.

| Lab   | Folder                         | Task                                                         |
| ----- | ------------------------------ | ------------------------------------------------------------ |
| 1     | `exercises/01-todo-store`      | Move the todo component's signals into a Signal Store        |
| Bonus | `exercises/02-watchlist-store` | Convert the `WatchlistService` to a Signal Store             |
| 2     | `exercises/03-media-store`     | Replace the RxJS code in `MediaOverview` with a `MediaStore` |

`exercises/cheatsheet.md` is a quick reference for the Signal Store APIs in the order of the slides.

The solutions run inside the app on `/demo/todo` and `/demo/media`, connected to the Redux DevTools browser extension.

The `solution` branch has all three labs wired in. Compare it with your work, or catch up with it:

```bash
git diff main solution -- src/app/components/todo-list   # the lab 1 changes
git switch solution                                       # the finished app
```

## Scripts

```bash
npm start        # dev server with TMDB proxy
npm run build    # production build
npm run lint     # ESLint
npm run format   # Prettier
```
