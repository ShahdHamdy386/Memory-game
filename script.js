const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Dark blue', 'Light blue', 'Purple', 'Pink'];
let allcards = [...colors, ...colors];

// Shuffle
allcards.sort(() => Math.random() - 0.5);

const board = document.querySelector('.cards');

let flippedCards = [];
let moves = 0;
let timeLeft = 5*60;
let timerStarted = false;
let timerInterval;


allcards.forEach(color => {
    const card = document.createElement('div');
    card.classList.add('card');

    // for front part
    const front = document.createElement('div');
    front.classList.add('front');
    front.textContent = color;
    front.style.display = 'none';

    card.appendChild(front);
    board.appendChild(card);

    // when we click the card
    card.addEventListener('click', () => {
        // Start the timer 
        if (!timerStarted) {
            startTimer();
            timerStarted = true;
        }

        // Prevent clicking same card twice or more than 2 at a time
        if (flippedCards.length === 2 || front.style.display === 'block') return;

        // Show the card
        front.style.display = 'block';
        card.classList.add('flipped');
        card.style.background = 'white';
        card.style.color = 'purple';

        flippedCards.push({ element: card, color: front.textContent });

        if (flippedCards.length === 2) {
            updateMoves();
            updateStars();

            // if the cards are matched
            if (flippedCards[0].color === flippedCards[1].color) {
                flippedCards = [];
                checkWin();
            } else {
                // Hiding if the cards are unmatched
                setTimeout(() => {
                    flippedCards.forEach(item => {
                        const frontEl = item.element.querySelector('.front');
                        frontEl.style.display = 'none';
                        item.element.classList.remove('flipped');
                        item.element.style.background = 'var(--pink)';
                        item.element.style.color = 'white';
                    });
                    flippedCards = [];
                }, 800);
            }
        }
    });
});

// Timer function
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = String(Math.floor(timeLeft / 60));
        const seconds = String(timeLeft % 60);
        document.getElementById('timer').textContent = `${minutes}:${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(false);
        }
    }, 1000);
}

// Update moves
function updateMoves() {
    moves++;
    document.getElementById('moves').textContent = moves;
}

// Update stars
function updateStars() {
    let starsCount = 5;
    if (moves > 16) starsCount = 1;
    else if (moves > 14) starsCount = 2;
    else if (moves > 12) starsCount = 3;
    else if (moves > 10) starsCount = 4;

    document.getElementById('stars').textContent = '★'.repeat(starsCount) + '☆'.repeat(5 - starsCount);
}

// Check win
function checkWin() {
    const allFronts = document.querySelectorAll('.front');
    const allVisible = Array.from(allFronts).every(front => front.style.display === 'block');
    if (allVisible) {
        clearInterval(timerInterval);
        endGame(true);
    }
}

// End game
function endGame(win) {
    const stars = document.getElementById('stars').textContent;
    const message = win
        ? `You Win!\nMoves: ${moves}\nStars: ${stars}`
        : `Time's up! You Lose.\nMoves: ${moves}`;
    setTimeout(() => alert(message), 300);
}


document.querySelector('.restart').addEventListener('click', () => {
    location.reload();
});
