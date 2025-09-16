// Simple user progress and rank system using localStorage
(function () {
  const STORAGE_KEY = 'biolearn_points_v1';

  function getPoints() {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? parseInt(v, 10) : 0;
  }

  function setPoints(p) {
    localStorage.setItem(STORAGE_KEY, String(Math.max(0, p)));
  }

  function addPoints(delta) {
    setPoints(getPoints() + (delta || 0));
  }

  function resetPoints() {
    setPoints(0);
  }

  function getRank(points) {
    const p = points != null ? points : getPoints();
    if (p >= 30) return { name: 'מומחה', level: 'expert' };
    if (p >= 10) return { name: 'ביניים', level: 'intermediate' };
    return { name: 'מתחיל', level: 'newbie' };
  }

  // Badge UI
  function ensureRankBadge() {
    const header = document.querySelector('header');
    if (!header) return null;
    let badge = header.querySelector('.rank-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'rank-badge';
      header.appendChild(badge);
    }
    return badge;
  }

  function updateRankBadge() {
    const badge = ensureRankBadge();
    if (!badge) return;
    const points = getPoints();
    const rank = getRank(points);
    badge.textContent = `דרגה: ${rank.name} • נקודות: ${points}`;
    badge.setAttribute('data-rank', rank.level);
  }

  // Progress bar UI
  function ensureRankProgress() {
    const header = document.querySelector('header');
    if (!header) return null;
    let wrap = header.querySelector('.rank-progress');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'rank-progress';
      wrap.innerHTML = `
        <div class="rank-progress-label" aria-live="polite"></div>
        <div class="rank-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="rank-progress-fill" style="width:0%"></div>
        </div>`;
      header.appendChild(wrap);
    }
    return wrap;
  }

  function computeProgress(points) {
    // Returns {lower, upper, percent, label}
    const p = points;
    if (p < 10) {
      return { lower: 0, upper: 10, percent: (p - 0) / 10, label: 'אל דרגת ביניים' };
    }
    if (p < 30) {
      return { lower: 10, upper: 30, percent: (p - 10) / 20, label: 'אל דרגת מומחה' };
    }
    // Expert: rolling milestones every 20 pts beyond 30
    const offset = p - 30;
    const block = Math.floor(offset / 20);
    const lower = 30 + block * 20;
    const upper = lower + 20;
    const percent = (p - lower) / (upper - lower);
    return { lower, upper, percent, label: 'ליעד המומחה הבא' };
  }

  function updateRankProgress() {
    const wrap = ensureRankProgress();
    if (!wrap) return;
    const labelEl = wrap.querySelector('.rank-progress-label');
    const bar = wrap.querySelector('.rank-progress-bar');
    const fill = wrap.querySelector('.rank-progress-fill');
    const points = getPoints();
    const { lower, upper, percent, label } = computeProgress(points);
    const pct = Math.max(0, Math.min(1, percent));
    fill.style.width = (pct * 100).toFixed(0) + '%';
    bar.setAttribute('aria-valuenow', String(Math.round(pct * 100)));
    labelEl.textContent = `${label}: ${points}/${upper} (יעד הבא)`;
  }

  // Motivation tip UI
  function ensureMotivation() {
    const header = document.querySelector('header');
    if (!header) return null;
    let tip = header.querySelector('.motivation-tip');
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'motivation-tip';
      header.appendChild(tip);
    }
    return tip;
  }

  function getMotivation(points) {
    if (points < 5) return 'התחלה מעולה! נסו להשלים פעילות אחת היום ✨';
    if (points < 10) return 'כמעט בדרגת ביניים! עוד קצת ותעלו רמה 🚀';
    if (points < 20) return 'יפה! שמרו על רצף למידה — אתם בדרך הנכונה 💪';
    if (points < 30) return 'עוד מעט דרגת מומחה! המשיכו כך ⭐';
    if (points < 50) return 'מומחה בפעולה! נסו לאתגר את עצמכם בנושאים מתקדמים 🧠';
    return 'אלופים! נסו לבנות רצף יומי ולשבור שיאים אישיים 🏆';
  }

  function updateMotivation() {
    const tip = ensureMotivation();
    if (!tip) return;
    const points = getPoints();
    tip.textContent = getMotivation(points);
  }

  // Expose API globally
  window.BioUser = {
    getPoints,
    addPoints,
    resetPoints,
    getRank,
    updateRankBadge,
    updateRankProgress,
    updateMotivation,
  };

  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    updateRankBadge();
    updateRankProgress();
    updateMotivation();
  });
})();
