# Repository Guidelines

## Project Structure & Module Organization

This is a React Native app named `FitNation`. The app entry points are `index.js` and `App.tsx`. Feature code lives under `src/`: screens in `src/screens`, reusable UI in `src/components`, navigation setup in `src/navigation`, API clients in `src/api`, shared context in `src/context`, utilities in `src/utils`, and images in `src/assets/images`. Native platform projects are in `android/` and `ios/`. Jest tests are kept in `__tests__/`, with the current smoke test in `__tests__/App.test.tsx`.

## Build, Test, and Development Commands

Use npm, since `package-lock.json` is committed.

- `npm install`: install JavaScript dependencies.
- `npm start`: start the Metro bundler.
- `npm run android`: build and launch the Android app.
- `npm run ios`: build and launch the iOS app.
- `npm test`: run Jest tests with the React Native preset.
- `npm run lint`: run ESLint across the repository.

For iOS native dependencies, run `bundle install` if needed, then install pods from `ios/` using the workflow documented in `README.md`.

## Coding Style & Naming Conventions

The project uses TypeScript/TSX for most app code, with some JavaScript modules in `src/api` and `src/context`. Follow the React Native ESLint config in `.eslintrc.js` and Prettier settings in `.prettierrc.js`: single quotes, trailing commas, and omitted parentheses for single-argument arrow functions. Keep components and screens in PascalCase file exports. Existing screen filenames use names such as `Home_Screen.tsx` and `FitnessProgram_Screen.tsx`; match local naming when adding sibling files.

## Testing Guidelines

Jest is configured through `jest.config.js` with the `react-native` preset. Place unit or render tests in `__tests__/` or near the module if the project later adopts colocated tests. Use clear names like `ComponentName.test.tsx` for React components and `moduleName.test.ts` for utilities. Add tests for navigation, API-state handling, and user-visible behavior when changing screens or shared components.

## Commit & Pull Request Guidelines

Recent commits use short, descriptive messages such as `Half cart apis integrated` and `Remove cart api integrated`. Keep commits focused and written in a concise imperative or descriptive style. Pull requests should include a summary of the change, test results (`npm test`, `npm run lint`, and platform run if relevant), linked issues, and screenshots or screen recordings for UI changes.

## Security & Configuration Tips

Do not commit API secrets, credentials, or environment-specific values. Keep base API configuration centralized in `src/api/axiosInstance.js`, and prefer platform-safe storage such as Async Storage only for non-sensitive client state unless a secure storage dependency is added.
