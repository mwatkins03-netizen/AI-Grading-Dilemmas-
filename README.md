# When AI Grading Arrives — Dilemmas to Consider

An interactive reflection for **faculty and students** on what we give up when we let
AI grade. Pick a path, sit with six provocative dilemmas, take a stance, write a short
metacognitive reflection, then export a keepsake of where you stood.

Built in the colors and type spirit of the **University of Mississippi** (Lyceum Red
`#CE1126`, Oxford Blue `#14213D`). Scenarios adapted from **Marc Watkins**, _"What We
Give Up When We Let AI Decide,"_ Rhetorica (January 2026):
<https://marcwatkins.substack.com/p/what-we-give-up-when-we-let-ai-decide>

---

## What's inside

| File | Purpose |
| --- | --- |
| `index.html` | Entry point — loads fonts, styles, and the app |
| `styles.css` | All styling: UM brand, three tone themes, print/PDF layout |
| `src/data.js` | The six dilemmas, framed for both faculty and student paths |
| `src/components.jsx` | UI components & screens (landing, path select, scenario) |
| `src/app.jsx` | App state machine, persistence, summary screen, Tweaks |
| `src/export.js` | Generates the shareable visual HTML "card" |
| `tweaks-panel.jsx` | Optional in-page Tweaks controls (tone, motif, motion) |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

Everything is **static** — no build step, no server. React + Babel load from a CDN and
the JSX is transpiled in the browser.

## Features

- **Two paths** — Faculty and Student framings of the same six situations.
- **The red button motif** — the recurring "press it and the thinking is done for you" image.
- **Take a stance + reflect** — each dilemma surfaces a counter-weight tension and guided
  metacognitive prompts. Responses are saved in the browser (`localStorage`) — nothing is
  ever transmitted.
- **Export three ways** — download a self-contained visual HTML card, Save as PDF, or Print.
- **Tweaks** — tone (editorial / stark / warm), red-button emphasis, and motion.
- **AI disclosure label** and full attribution to Marc Watkins, per the essay's own call
  for disclosure.

---

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `ai-grading-dilemmas`).
2. Upload **all** of these files, keeping the `src/` folder structure intact.
   ```
   index.html
   styles.css
   tweaks-panel.jsx
   .nojekyll
   src/data.js
   src/export.js
   src/components.jsx
   src/app.jsx
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select branch **`main`** and folder **`/ (root)`**, then **Save**.
6. Wait ~1 minute. Your site will be live at
   `https://<your-username>.github.io/<repo-name>/`.

### Command-line alternative

```bash
git init
git add .
git commit -m "AI Grading Dilemmas"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
# then enable Pages in Settings → Pages (Deploy from a branch → main → /root)
```

### Run locally

Because the browser loads the `.jsx` and `.js` files over `fetch`, open it through a
local server rather than double-clicking the file:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

---

## Credits & disclosure

- **Scenarios:** adapted from "What We Give Up When We Let AI Decide" by **Marc Watkins**,
  Rhetorica (2026).
- **AI disclosure:** this experience was designed and built with the assistance of
  generative AI. The scenario text is adapted from the human-authored essay; any
  reflections a participant writes are their own and stay on their device.
- Created for reflection at the University of Mississippi. Not affiliated with or
  endorsed by the University. University colors and trademarks belong to their owners.
