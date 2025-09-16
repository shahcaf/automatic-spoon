# Biology Learning Website

An interactive, mobile-friendly biology learning site with clear explanations, step-by-step content, quizzes, puzzles, fun facts, and a gamified rank system (no login required).

## Features
- Topics organized by level (Beginners, Intermediate, Experts)
- Random activity engine per topic: quiz or matching puzzle
- Points and rank system stored in localStorage (Newbie → Intermediate → Expert)
- Rank badge, progress bar toward next rank, and motivational tips
- Compact, elegant topics list with Show More chip and gradient fade
- Mobile-first, accessible design with RTL support

## Project Structure
```
biology-learning-website/
├─ index.html              # Home page with topics and CTA
├─ style.css               # Mobile-first styles and components
├─ script.js               # Smooth scroll, compact topics UI
├─ user.js                 # Points, ranks, progress bar, motivation
├─ topics/
│  ├─ cell.html            # Sample topic (cell basics)
│  ├─ plants.html          # Sample topic (plants)
│  ├─ genetics.html        # Sample topic (genetics)
│  ├─ photosynthesis.html  # Sample topic (photosynthesis)
│  ├─ molecular-biology.html
│  ├─ genetic-engineering.html
│  ├─ quiz.js              # (Legacy) quiz logic for early cell page (now using activity.js)
│  ├─ activity.js          # Random activity engine + banks (+ DEFAULT fallback)
│  └─ topic.html           # Generic topic page: topics/topic.html?topic=<slug>
└─ .gitignore
```

## Local Development
Use any static server. Example with Python:

```bash
# Windows
py -m http.server 8000
# macOS/Linux
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

## Deployment
This site is static and can be hosted on GitHub Pages, Netlify, Vercel, etc.

## Customization
- Edit `index.html` to add or reorder topics.
- Add per-topic activity banks in `topics/activity.js` under the BANK object.
- Adjust default items shown per list (mobile/tablet/desktop) in `script.js` → `getTopicLimit()`.
- Tune ranks/progress in `user.js`.

## License
MIT (or your preferred license).
