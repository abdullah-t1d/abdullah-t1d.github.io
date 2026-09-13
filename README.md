# Abdullah Alahmadi — Portfolio

Personal portfolio of Abdullah Alahmadi, a Software Engineering student at the University of Jeddah working across software systems, artificial intelligence, research and IoT.

A single-page site with research papers, project documents and a short overview of activities and skills.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Motion](https://motion.dev/) for animation
- [Fontsource](https://fontsource.org/): Newsreader, Geist and Geist Mono
- Plain CSS

## Run Locally

Requires Node.js 20.19+ or 22.12+.

```bash
git clone https://github.com/abdullah-t1d/abdullah-t1d.github.io.git
cd abdullah-t1d.github.io
npm install
npm run dev
```

Then open the local URL printed in the terminal (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # optional: serve the production build locally
```

The static site is generated in `dist/`. Asset paths are relative, so it can be hosted at a domain root or on GitHub Pages.

## Project Structure

```
public/
  projects/     Project documents (Think-Up, Masadir)
  research/     IoTutorMine paper and ATTD poster
  favicon.svg
src/
  App.jsx       Content, sections and animations
  styles.css    All styles
index.html
vite.config.js
```

## Portfolio Content

- **Software Engineering**: the foundation of the work
- **AI**: LLM-based systems and evaluation
- **Research**: IoTutorMine (ASE '26) and a ChatGPT vs. healthcare professionals study presented at ATTD
- **IoT**: wearable and sensor integration
- **repoCare**: capstone project, an AI-assisted personal health platform
- **IoTutorMine**: mining hardware Bills of Materials from IoT tutorial videos with LLMs
- **Think-Up**: AI-assisted collaborative study platform
