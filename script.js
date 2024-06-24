const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const movesElement = document.getElementById('moves');
const timerElement = document.getElementById('timer');
const winningMessage = document.getElementById('winning-message');
const letters = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let moves = 0;
let timer;
let time = 0;

resetButton.addEventListener('click', resetGame);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  shuffle(letters);
  gameBoard.innerHTML = '';
  letters.forEach(letter => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="front">?</div>
      <div class="back">${letter}</div>
    `;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesElement.textContent = moves;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.querySelector('.back').textContent === secondCard.querySelector('.back').textContent;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
  checkForWin();
}

function unflipCards() {
  lockBoard = true;
  firstCard.classList.add('incorrect');
  secondCard.classList.add('incorrect');
  setTimeout(() => {
    firstCard.classList.remove('flip', 'incorrect');
    secondCard.classList.remove('flip', 'incorrect');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function checkForWin() {
  const allFlipped = document.querySelectorAll('.card.flip').length === letters.length;
  if (allFlipped) {
    clearInterval(timer);
    winningMessage.classList.remove('hidden');
  }
}

function startTimer() {
  timer = setInterval(() => {
    time++;
    timerElement.textContent = time;
  }, 1000);
}

function resetGame() {
  clearInterval(timer);
  time = 0;
  timerElement.textContent = time;
  moves = 0;
  movesElement.textContent = moves;
  createBoard();
  winningMessage.classList.add('hidden');
  resetButton.textContent = 'Reset';
  startTimer();
}

createBoard();
startTimer();
