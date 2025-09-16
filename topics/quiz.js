document.addEventListener('DOMContentLoaded', () => {
    const correctAnswer = 'גרעין התא';
    const answerButtons = document.querySelectorAll('.answer-btn');
    const submitButton = document.getElementById('submit-btn');
    const resultElement = document.getElementById('result');
    const QUIZ_AWARD_KEY = 'quiz_cell_awarded_v1';

    let selectedAnswer = null;

    answerButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'selected' class from all buttons
            answerButtons.forEach(btn => btn.classList.remove('selected'));
            // Add 'selected' class to the clicked button
            button.classList.add('selected');
            selectedAnswer = button.textContent;
        });
    });

    submitButton.addEventListener('click', () => {
        if (!selectedAnswer) {
            resultElement.textContent = 'אנא בחר תשובה!';
            resultElement.style.color = 'orange';
            return;
        }

        if (selectedAnswer === correctAnswer) {
            // Award points only once per user per quiz using localStorage
            const alreadyAwarded = localStorage.getItem(QUIZ_AWARD_KEY) === '1';
            let message = 'כל הכבוד! תשובה נכונה! ✅';
            if (!alreadyAwarded && window.BioUser && typeof window.BioUser.addPoints === 'function') {
                window.BioUser.addPoints(5); // award 5 points for correct answer
                window.BioUser.updateRankBadge && window.BioUser.updateRankBadge();
                localStorage.setItem(QUIZ_AWARD_KEY, '1');
                message += ' +5 נקודות';
            }
            resultElement.textContent = message;
            resultElement.style.color = 'green';
        } else {
            resultElement.textContent = 'תשובה לא נכונה. נסו שוב! ❌';
            resultElement.style.color = 'red';
        }
        
        // Reset selection after checking
        selectedAnswer = null;
        answerButtons.forEach(btn => btn.classList.remove('selected'));
    });
});
