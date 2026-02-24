# Blueprint: Lotto Number Generator

## Overview

A simple, visually appealing web application that generates and displays a set of random lottery numbers. The application is built using modern, framework-less web technologies, including Web Components for modular UI.

## Core Features & Design

### Implemented Features:

*   **Random Number Generation:**
    *   Generates a set of 6 unique main numbers and 1 bonus number from a specified range (1-45).
    *   A "Generate Numbers" button allows the user to request a new set of numbers at any time.
*   **Visual Design:**
    *   **Layout:** A centered, clean layout that focuses on the generated numbers.
    *   **Typography:** Uses the "Poppins" font for a modern and readable look.
    *   **Color Scheme:**
        *   Features a vibrant, gradient background.
        *   Numbers are color-coded based on their value range for quick visual distinction.
        *   Uses a "glassmorphism" effect for the main component, giving it a semi-transparent, blurred background.
    *   **Animations:** Numbers "pop in" with a subtle animation when generated.
*   **Web Component (`<lotto-generator>`):**
    *   The entire user interface for the number generation is encapsulated within a custom element.
    *   Uses Shadow DOM to prevent style conflicts with the main page.
*   **Dark/Light Mode Toggle:**
    *   A toggle button allows users to switch between a light theme and a dark theme.
    *   The user's preference is saved in `localStorage` and applied automatically on future visits.
    *   The entire UI, including the `lotto-generator` component, adapts to the selected theme.

### Current Plan:

This section outlines the plan for the *current* requested change.

1.  **Update `blueprint.md`:** Document the plan to add a dark/light mode feature.
2.  **Add Theme Toggle Button:** Add a button to `index.html` for switching themes.
3.  **Update CSS:** Create CSS variables in `style.css` for both light and dark themes to manage colors easily.
4.  **Implement Toggle Logic:** Add JavaScript in `main.js` to handle the theme-switching logic and save the user's preference.
5.  **Update Web Component:** Modify the `LottoGenerator` component to use the new CSS variables, making it theme-aware.
6.  **Deploy:** Commit the changes and push them to the GitHub repository to complete the deployment.

