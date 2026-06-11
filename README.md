# Weather Forecast App

Live production app: [View Live App](https://adoring-kowalevski-9714eb.netlify.app/)

## Overview

This project is a responsive weather application that lets users:

- Search weather by city
- View current weather details (temperature, conditions, humidity, wind)
- Use geolocation to fetch weather for their current location
- View a multi-day forecast
- Toggle between Celsius and Fahrenheit

It is designed as a clean front-end weather dashboard with real API data from OpenWeather.

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Axios (HTTP requests)
- Bootstrap 5 (layout/utilities)
- Parcel (bundling/development server)
- Netlify (deployment)

## Project Structure

- `index.html`: Main app markup
- `src/index.js`: Weather logic, API calls, rendering, and interactions
- `src/styles.css`: Styling and responsive layout behavior
- `package.json`: Scripts and build tooling

## API & Security

The app uses OpenWeather endpoints for current weather and forecast data.

- API keys are managed through environment variables
- No API secrets are stored in this README
- Do not commit key values to source control

## Local Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm start
```

Create a production build:

```bash
npm run build
```

## Notes

This project demonstrates:

- Front-end API integration patterns
- DOM state updates from asynchronous data
- User-centric features such as geolocation and unit conversion
- Responsive UI adaptation for mobile and desktop
