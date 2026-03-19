# macOS Style Portfolio

This project is a web-based portfolio designed to mimic the look and feel of a macOS desktop environment. It uses modern web technologies including React, Vite, and CSS to recreate the appearance of windows, icons, and controls. The codebase is structured with components for common interface elements such as a dock, menu bar, and application windows.

Users can navigate between different "apps" like Finder, Terminal, and Safari, each represented by React components within the `src/windows` directory. The project also includes context menus, audio controls, and a store for managing state related to window positions, theme, and other settings. Constants and project helpers are organized under `src/constants`, while higher-order components and context providers support reusable functionality.

To run the project locally, install dependencies with `npm install` and start the development server using `npm run dev`. The application is intended as a creative portfolio and demo, showcasing the ability to emulate a desktop interface in a browser.
