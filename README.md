# Wisper Flow Challenge

Aditya Patel’s interactive portfolio for the Wispr Flow hiring challenge.

Features a rotating 3D wireframe sculpture, project stories for Health.AI, BNP Paribas, and Rocky, and **Signal Run**, a browser game with keyboard, touch, and swipe controls.

## Run locally

No installation or build step is required. From this repository:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173.

## Source

- `dist/index.html`: page structure and content
- `dist/style.css`: styles and responsive layouts
- `dist/app.js`: game and portfolio interactions
- `dist/assets/`: fonts and project images
- `.openai/hosting.json`: Sites deployment configuration

## Game controls

Collect green signals and avoid red crates. Every five signals unlocks a project story. Each run lasts 45 seconds with three lives.

- Left/Right or A/D: steer
- On-screen arrows or horizontal swipe: touch steering
- Space or the middle control: pause/resume

## Build process

The initial interface was built with Codex. The portfolio’s build log identifies the Wispr Flow reflections and process recording as pending.
