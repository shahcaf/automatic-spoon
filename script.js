// Global site interactions
console.log('Welcome to the Biology Learning Website!');

// Smooth scroll to topics when clicking the Start Learning button
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-learning-btn');
  const topicsSection = document.getElementById('topics');

  if (startBtn && topicsSection) {
    startBtn.addEventListener('click', () => {
      topicsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  // Make long topic lists feel lighter: collapse by default with Show more/less.
  setupCompactTopics();
  updateCompactTopics();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateCompactTopics, 150);
  });
});

function getTopicLimit() {
  const w = window.innerWidth;
  if (w >= 1024) return 12; // desktop
  if (w >= 720) return 9; // tablet
  return 6; // mobile
}

function setupCompactTopics() {
  const topicLists = document.querySelectorAll('#topics ul');
  let uid = 0;
  topicLists.forEach((ul) => {
    const items = Array.from(ul.querySelectorAll('li'));
    // Add a count badge to the preceding level header (h3)
    const header = ul.previousElementSibling;
    if (header && header.tagName === 'H3' && !header.querySelector('.topic-count-badge')) {
      const badge = document.createElement('span');
      badge.className = 'topic-count-badge';
      badge.textContent = `${items.length} נושאים`;
      header.appendChild(badge);
    }
    if (items.length <= limit) return; // nothing to collapse

    // Assign an ID for aria-controls
    uid += 1;
    const listId = `topic-list-${uid}`;
    ul.id = ul.id || listId;

    // If already wrapped, skip wrapping
    let wrap = ul.parentElement;
    if (!wrap || !wrap.classList.contains('topics-list-wrap')) {
      wrap = document.createElement('div');
      wrap.className = 'topics-list-wrap is-collapsed';
      ul.parentNode.insertBefore(wrap, ul);
      wrap.appendChild(ul);
    }

    // Mark items beyond limit as collapsible/hidden initially
    const limit = getTopicLimit();
    const hiddenItems = items.slice(limit);
    hiddenItems.forEach(li => li.classList.add('collapsed-item'));
    ul.classList.add('is-collapsed');

    // Gradient fade overlay
    const fade = document.createElement('div');
    fade.className = 'topics-fade-shadow';
    wrap.appendChild(fade);

    // Create centered pill chip toggle
    const hiddenCount = Math.max(0, items.length - limit);
    let btn = wrap.querySelector('.show-more-chip');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'show-more-chip';
      btn.type = 'button';
      btn.setAttribute('aria-controls', ul.id);
      btn.setAttribute('aria-expanded', 'false');
      wrap.appendChild(btn);
    }
    btn.innerHTML = `<span class="chip-icon">▾</span><span class="chip-text">הצג עוד (${hiddenCount} נוספים)</span>`;

    const collapse = () => {
      wrap.classList.add('is-collapsed');
      ul.classList.add('is-collapsed');
      hiddenItems.forEach(li => li.classList.add('collapsed-item'));
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelector('.chip-text').textContent = `הצג עוד (${hiddenCount} נוספים)`;
      btn.querySelector('.chip-icon').textContent = '▾';
    };
    const expand = () => {
      wrap.classList.remove('is-collapsed');
      ul.classList.remove('is-collapsed');
      hiddenItems.forEach(li => li.classList.remove('collapsed-item'));
      btn.setAttribute('aria-expanded', 'true');
      btn.querySelector('.chip-text').textContent = 'הראה פחות';
      btn.querySelector('.chip-icon').textContent = '▴';
    };

    // Initial state: collapsed
    collapse();

    btn.onclick = () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) collapse(); else expand();
    };
  });
}

function updateCompactTopics() {
  const topicLists = document.querySelectorAll('#topics ul');
  topicLists.forEach((ul) => {
    const items = Array.from(ul.querySelectorAll('li'));
    const limit = getTopicLimit();
    const hiddenItems = items.slice(limit);
    const visibleItems = items.slice(0, limit);
    const wrap = ul.parentElement?.classList.contains('topics-list-wrap') ? ul.parentElement : null;
    const btn = wrap ? wrap.querySelector('.show-more-chip') : null;

    // Reset all items to visible, then hide beyond limit if collapsed
    items.forEach(li => li.classList.remove('collapsed-item'));

    const isExpanded = btn && btn.getAttribute('aria-expanded') === 'true';
    if (!isExpanded) {
      hiddenItems.forEach(li => li.classList.add('collapsed-item'));
      ul.classList.add('is-collapsed');
      wrap && wrap.classList.add('is-collapsed');
    }

    // Update button label with new hidden count
    const hiddenCount = Math.max(0, items.length - limit);
    if (btn) {
      btn.querySelector('.chip-text').textContent = isExpanded ? 'הראה פחות' : `הצג עוד (${hiddenCount} נוספים)`;
    }
  });
}
