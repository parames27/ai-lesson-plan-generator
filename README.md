# AI Lesson Plan Generator

A beginner-friendly website that helps teachers create a structured lesson plan from a few details.

> **Template version:** This project does **not** use a live AI model or API. Plans are built from fixed text templates in `script.js` that insert your subject, topic, level, duration and objectives. Always review and adapt the plan before using it in class.

## Features

- Inputs: subject, topic, student level, lesson duration, learning objectives
- Input validation with clear messages next to each field
- Generated plan with: learning objectives, required materials, introduction and warm-up, main teaching activities, practical examples, student assessment, homework, and suggested timing for every activity
- Timing always adds up exactly to the chosen lesson length
- Print button (prints only the plan) and Reset button
- Responsive design for phones and computers

## Technology

HTML, CSS and vanilla JavaScript. No libraries, no backend, no API keys.

## Project structure

```
ai-lesson-plan-generator/
├── index.html
├── style.css
├── script.js
├── README.md
├── LICENSE
└── screenshots/
```

## Setup

1. Download or clone the repository.
2. Open `index.html` in a modern browser.
3. Fill in the form and click **Generate Lesson Plan**.

## Host with GitHub Pages

1. Push the files to a public GitHub repository.
2. Open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then **Save**.
5. Your site appears at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/` after a minute or two.

## Limitations

- Content comes from general templates, so plans are generic starting points and not subject-specific expert content.
- Plans are not saved. Use Print (or Save as PDF in the print dialog) to keep one.
- Only four student levels and four durations are supported.
- English only.

## Ideas for future versions

- Connect a real AI model through a secure backend
- Add subject-specific templates
- Save and export plans (PDF or Word)
- Add curriculum standards

## Screenshots

Add images to `screenshots/` and link them here:

```
![Form](screenshots/form.png)
![Generated plan](screenshots/plan.png)
```

## License

Released under the [MIT License](LICENSE).
