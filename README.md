# 생성형 AI 특강

Lecture deck (reveal.js) and attendee practice handout for a generative-AI workshop.

## Live site

Deployed to GitHub Pages on every push to `main` (`.github/workflows/pages.yml`).

- Deck: https://kadragon.github.io/genai-lecture/
- Practice handout: https://kadragon.github.io/genai-lecture/practice.html

## Run locally

```sh
npm ci
npm run vendor
python3 -m http.server 8000
```

Then open http://localhost:8000/ (deck) or http://localhost:8000/practice.html (handout).
