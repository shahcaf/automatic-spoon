// Random activity engine: per-topic quiz or matching puzzle
(function () {
  const AWARD_POINTS = 5;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Activity banks per topic slug (set data-topic on <body>)
  const BANK = {
    cell: {
      quizzes: [
        {
          q: 'מהו ה"מוח" של התא, המכיל את החומר התורשתי?',
          options: ['מיטוכונדריה', 'גרעין התא', 'קרום התא', 'ציטופלזמה'],
          correctIndex: 1,
        },
        {
          q: 'איזה אברון ידוע כ"תחנת הכוח" של התא?',
          options: ['ריבוזום', 'גולג׳י', 'מיטוכונדריה', 'ליזוזום'],
          correctIndex: 2,
        },
      ],
      matches: [
        { left: 'גרעין', right: 'מכיל DNA ושולט בפעילות התא' },
        { left: 'מיטוכונדריה', right: 'הפקת אנרגיה (ATP)' },
        { left: 'קרום התא', right: 'שולט בכניסה ויציאה של חומרים' },
      ],
    },
    plants: {
      quizzes: [
        {
          q: 'איפה מתרחשת עיקר הפוטוסינתזה בצמח?',
          options: ['שורשים', 'עלים', 'פרחים', 'זרעים'],
          correctIndex: 1,
        },
      ],
      matches: [
        { left: 'שורש', right: 'קולט מים ומינרלים' },
        { left: 'עלה', right: 'מבצע פוטוסינתזה' },
        { left: 'גבעול', right: 'תמיכה והובלת חומרים' },
      ],
    },
    genetics: {
      quizzes: [
        {
          q: 'תכונה שמופיעה אם יש לפחות עותק אחד שלה נקראת?',
          options: ['דומיננטית', 'רצסיבית', 'נייטרלית', 'מותנית'],
          correctIndex: 0,
        },
      ],
      matches: [
        { left: 'גן', right: 'יחידת מידע תורשתי' },
        { left: 'אלל', right: 'צורה אפשרית של גן' },
        { left: 'פנוטיפ', right: 'הביטוי הנצפה של התכונה' },
      ],
    },
    photosynthesis: {
      quizzes: [
        {
          q: 'מהם תוצרי הפוטוסינתזה העיקריים?',
          options: ['מים ומלח', 'סוכר וחמצן', 'חנקן וחמצן', 'גלוקוז ופחמן דו-חמצני'],
          correctIndex: 1,
        },
      ],
      matches: [
        { left: 'כלורופיל', right: 'פיגמנט הקולט אור' },
        { left: 'כלורופלסט', right: 'אברון בו מתרחשת פוטוסינתזה' },
        { left: 'אור שמש', right: 'מקור אנרגיה לתהליך' },
      ],
    },
    'molecular-biology': {
      quizzes: [
        {
          q: 'מהו תהליך יצירת RNA על בסיס DNA?',
          options: ['שכפול', 'תעתוק', 'תרגום', 'ביטוי גנים'],
          correctIndex: 1,
        },
      ],
      matches: [
        { left: 'DNA', right: 'מאגר המידע הגנטי' },
        { left: 'RNA', right: 'תוצר התעתוק' },
        { left: 'ריבוזום', right: 'מקום תרגום לחלבון' },
      ],
    },
    'genetic-engineering': {
      quizzes: [
        {
          q: 'CRISPR הוא כלי ל-',
          options: ['מדידת pH', 'עריכת גנים', 'שכפול תאים', 'סימון חלבונים'],
          correctIndex: 1,
        },
      ],
      matches: [
        { left: 'וקטור', right: 'נשא להחדרת גנים' },
        { left: 'CRISPR', right: 'מנגנון עריכת DNA מדויק' },
        { left: 'טרנסג׳ן', right: 'גן שמוכנס לאורגניזם' },
      ],
    },
    DEFAULT: {
      quizzes: [
        {
          q: 'איזה מולקולה היא מאגר המידע התורשתי בתאים?',
          options: ['חלבון', 'DNA', 'גלוקוז', 'ATP'],
          correctIndex: 1,
        },
        {
          q: 'איזה אברון אחראי להפקת רוב ה-ATP בתא?',
          options: ['ריבוזום', 'מיטוכונדריה', 'ליזוזום', 'גרעין'],
          correctIndex: 1,
        },
      ],
      matches: [
        { left: 'אנזים', right: 'מאיץ תגובות כימיות' },
        { left: 'ממברנה', right: 'מחסום בררני סביב התא' },
        { left: 'אוסמוזה', right: 'דיפוזיית מים דרך ממברנה' },
      ],
    },
  };

  function awardOnce(key) {
    const storageKey = `award_${key}`;
    if (localStorage.getItem(storageKey) === '1') return false;
    localStorage.setItem(storageKey, '1');
    if (window.BioUser?.addPoints) {
      window.BioUser.addPoints(AWARD_POINTS);
      window.BioUser.updateRankBadge && window.BioUser.updateRankBadge();
      window.BioUser.updateRankProgress && window.BioUser.updateRankProgress();
      window.BioUser.updateMotivation && window.BioUser.updateMotivation();
    }
    return true;
  }

  function renderQuiz(root, quiz, topicKey) {
    root.innerHTML = '';
    const container = document.createElement('section');
    container.className = 'activity quiz';
    container.innerHTML = `
      <h2>📝 חידון</h2>
      <p class="activity-instructions">בחרו את התשובה הנכונה:</p>
      <h3 class="question">${quiz.q}</h3>
      <div class="answers"></div>
      <button class="activity-submit">בדיקה</button>
      <p class="activity-result" aria-live="polite"></p>
    `;
    root.appendChild(container);

    const answersEl = container.querySelector('.answers');
    const resultEl = container.querySelector('.activity-result');
    const submitBtn = container.querySelector('.activity-submit');

    const options = quiz.options.map((t, i) => ({ t, i }));
    shuffle(options).forEach(({ t, i }) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = t;
      btn.addEventListener('click', () => {
        container.querySelectorAll('.answer-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        btn.dataset.index = i;
      });
      answersEl.appendChild(btn);
    });

    submitBtn.addEventListener('click', () => {
      const sel = container.querySelector('.answer-btn.selected');
      if (!sel) {
        resultEl.textContent = 'אנא בחרו תשובה.';
        resultEl.style.color = 'orange';
        return;
      }
      const idx = Number(sel.dataset.index);
      if (idx === quiz.correctIndex) {
        resultEl.textContent = 'כל הכבוד! תשובה נכונה! ✅';
        resultEl.style.color = 'green';
        const key = `${topicKey}_quiz_${quiz.q.slice(0, 10)}`;
        if (awardOnce(key)) {
          resultEl.textContent += ` +${AWARD_POINTS} נקודות`;
        }
      } else {
        resultEl.textContent = 'לא נכון, נסו שוב. ❌';
        resultEl.style.color = 'red';
      }
    });
  }

  function renderMatch(root, pairs, topicKey) {
    root.innerHTML = '';
    const container = document.createElement('section');
    container.className = 'activity match';
    container.innerHTML = `
      <h2>🧩 התאמת מונחים</h2>
      <p class="activity-instructions">התאימו כל מונח להגדרה המתאימה.</p>
      <div class="match-grid">
        <div class="match-col left"></div>
        <div class="match-col right"></div>
      </div>
      <p class="activity-result" aria-live="polite"></p>
    `;
    root.appendChild(container);

    const leftCol = container.querySelector('.left');
    const rightCol = container.querySelector('.right');
    const resultEl = container.querySelector('.activity-result');

    const left = pairs.map((p, i) => ({ text: p.left, i }));
    const right = pairs.map((p, i) => ({ text: p.right, i }));
    shuffle(left);
    shuffle(right);

    left.forEach(({ text, i }) => {
      const btn = document.createElement('button');
      btn.className = 'match-btn';
      btn.textContent = text;
      btn.dataset.index = i;
      leftCol.appendChild(btn);
    });
    right.forEach(({ text, i }) => {
      const btn = document.createElement('button');
      btn.className = 'match-btn';
      btn.textContent = text;
      btn.dataset.index = i;
      rightCol.appendChild(btn);
    });

    let selLeft = null;
    let selRight = null;

    function clearSelections() {
      container.querySelectorAll('.match-btn').forEach(b => b.classList.remove('selected'));
      selLeft = null;
      selRight = null;
    }

    function checkComplete() {
      const remaining = container.querySelectorAll('.match-btn:not(.matched)').length;
      if (remaining === 0) {
        resultEl.textContent = 'מצוין! כל ההתאמות נכונות! ✅';
        resultEl.style.color = 'green';
        const key = `${topicKey}_match`;
        if (awardOnce(key)) {
          resultEl.textContent += ` +${AWARD_POINTS} נקודות`;
        }
      }
    }

    leftCol.addEventListener('click', (e) => {
      const btn = e.target.closest('.match-btn');
      if (!btn || btn.classList.contains('matched')) return;
      leftCol.querySelectorAll('.match-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selLeft = btn;
      if (selRight) tryMatch();
    });

    rightCol.addEventListener('click', (e) => {
      const btn = e.target.closest('.match-btn');
      if (!btn || btn.classList.contains('matched')) return;
      rightCol.querySelectorAll('.match-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selRight = btn;
      if (selLeft) tryMatch();
    });

    function tryMatch() {
      const iL = Number(selLeft.dataset.index);
      const iR = Number(selRight.dataset.index);
      if (iL === iR) {
        selLeft.classList.add('matched');
        selRight.classList.add('matched');
        selLeft.classList.remove('selected');
        selRight.classList.remove('selected');
        checkComplete();
      } else {
        resultEl.textContent = 'לא תואם, נסו שוב.';
        resultEl.style.color = 'orange';
        setTimeout(() => {
          selLeft && selLeft.classList.remove('selected');
          selRight && selRight.classList.remove('selected');
          selLeft = null; selRight = null;
        }, 400);
      }
    }
  }

  function init() {
    document.addEventListener('DOMContentLoaded', () => {
      const body = document.body;
      const topicKey = body.getAttribute('data-topic');
      let bank = BANK[topicKey];
      if (!bank) bank = BANK.DEFAULT;

      let root = document.getElementById('activity-root');
      if (!root) {
        root = document.createElement('section');
        root.id = 'activity-root';
        body.querySelector('main')?.appendChild(root);
      }

      // Randomly select type
      const types = [];
      if (bank.quizzes?.length) types.push('quiz');
      if (bank.matches?.length) types.push('match');
      const chosen = types[Math.floor(Math.random() * types.length)];

      if (chosen === 'quiz') {
        const quiz = bank.quizzes[Math.floor(Math.random() * bank.quizzes.length)];
        renderQuiz(root, quiz, topicKey);
      } else {
        renderMatch(root, bank.matches, topicKey);
      }
    });
  }

  init();
})();
