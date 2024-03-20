const container = document.querySelector('#container');
const imageContainer = document.querySelector('#image-container');
const buttons = document.querySelectorAll('.button');
const allButtons = document.querySelector('#allButtons');
const startQuizButton = document.querySelector('#startQuizButton');
const nextQuestionButton = document.querySelector('#nextQ');
const newGameButton = document.querySelector('#newgame');
const rightOrWrong = document.querySelector('#rightorwrong');
const guesses = document.querySelector('#guesses');
const howManyCorrect = document.querySelector('#manyright');
const questionContainer = document.querySelector('#umberofquestions')

let numAttempts = 0;
let allRandomStudents = [];
let quizStarted = false;
let chosenStudent = {};
let rightAnswers = 0;
let totalGuessesAllowed = 0;
let correctGuess = false;
let allStudentsForButtons = [];

students.forEach(student => {
  student.used = false;
});

function randomStudents(students) {
  return students.sort(() => Math.random() - 0.5);
}

function getSelectedValue() {
  const radioButtons = document.querySelectorAll('input[name="questions"]');
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      return radioButton.value;
    }
  }
}

function createImage(imageUrl) {
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = 'student image';
  imageContainer.appendChild(img);
}

function createButtons(student) {
  const button = document.createElement('button');
  button.innerHTML = student.name;
  button.id = 'button';
  button.onclick = () => buttonClicked(student.id);
  allButtons.appendChild(button);
}

function selectObjectsWithoutRepetition(array, count, excludeName) {
  let selectedObjects = [];
  let arrayCopy = array.slice();

  count = Math.min(count, array.length);

  for (let i = 0; i < count; i++) {
    if (arrayCopy.length === 0) {
      break;
    }

    let randomIndex = Math.floor(Math.random() * arrayCopy.length);
    let randomObject = arrayCopy.splice(randomIndex, 1)[0];

    if (randomObject && randomObject.name && !selectedObjects.some(obj => obj.name === randomObject.name) && randomObject.name !== excludeName) {
      selectedObjects.push(randomObject);
    } else {
      i--;
    }
  }

  return selectedObjects;
}

let guessedCurrentImage = false;

function pickRandomStudent() {
  correctGuess = false;
  guessedCurrentImage = false;
  enableButtons();
  nextQuestionButton.disabled = true; // Disable nextQuestionButton before picking a new random student

  let availableStudents = allRandomStudents.filter(student => !student.used);

  if (availableStudents.length === 0) {
    endGame();
    return;
  }

  chosenStudent = selectObjectsWithoutRepetition(availableStudents, 1)[0];
  chosenStudent.used = true;

  createImage(chosenStudent.image);

  let additionalStudentsCount = Math.min(4 - 1, availableStudents.length);
  let additionalStudents = selectObjectsWithoutRepetition(availableStudents, additionalStudentsCount, chosenStudent.name);
  let allStudentsForButtons = [chosenStudent, ...additionalStudents];

  while (allStudentsForButtons.length < 4) {
    let remainingCount = 4 - allStudentsForButtons.length;
    let remainingStudents = selectObjectsWithoutRepetition(allRandomStudents, remainingCount, chosenStudent.name);

    remainingStudents = remainingStudents.filter(student => !allStudentsForButtons.some(buttonStudent => buttonStudent.id === student.id));

    allStudentsForButtons.push(...remainingStudents);

    if (remainingStudents.length === 0) {
      break;
    }
  }

  allStudentsForButtons = randomStudents(allStudentsForButtons);

  allButtons.innerHTML = '';

  allStudentsForButtons.forEach(student => {
    createButtons(student);
  });

  if (numAttempts >= totalGuessesAllowed) {
    endGame();
  }
}

function startQuiz() {
  clearGame();
  quizStarted = true;
  startQuizButton.style.display = 'none';
  allRandomStudents = randomStudents(students);
  nextQuestionButton.style.display = 'block';
  newGameButton.style.display = 'block';
  rightOrWrong.style.display = 'block';

  const selectedValue = getSelectedValue();
  if (selectedValue === 'all') {
    totalGuessesAllowed = students.length;
  } else if (selectedValue === '10') {
    totalGuessesAllowed = 10;
  } else {
    totalGuessesAllowed = 20;
  }

  pickRandomStudent();
}

function endGame() {
  quizStarted = false;
  nextQuestionButton.style.display = 'block';
  imageContainer.innerHTML = '';
  allButtons.innerHTML = '';
  nextQuestionButton.style.display = 'none';
  disableButtons();
}

nextQuestionButton.addEventListener('click', (e) => {
  rightOrWrong.style.display = 'none';

  imageContainer.innerHTML = '';
  allButtons.innerHTML = '';
  pickRandomStudent();

  correctGuess = false;
  enableButtons();
  nextQuestionButton.disabled = true; // Disable nextQuestionButton before picking a new random student
});

function buttonClicked(id) {
  if (correctGuess || guessedCurrentImage) {
    return;
  }

  numAttempts++;
  guesses.innerHTML = `You have guessed ${numAttempts} times`;
  rightOrWrong.style.display = 'block';

  const clickedStudent = students.find(student => student.id === id);

  if (clickedStudent.id === chosenStudent.id && !correctGuess) {
    rightOrWrong.innerHTML = 'Congratulations, you guessed right!';
    howManyCorrect.innerHTML = `Your score: ${rightAnswers + 1} / ${numAttempts}`;

    chosenStudent.used = true;

    rightAnswers++;

    correctGuess = true;

    disableButtons();

    if (rightAnswers >= totalGuessesAllowed) {
      endGame();
    }
  } else {
    rightOrWrong.innerHTML = 'Sorry, you guessed wrong.';
    guessedCurrentImage = true;
    disableButtons();
  }

  howManyCorrect.innerHTML = `Your score: ${rightAnswers} / ${numAttempts}`;
  nextQuestionButton.disabled = false;
}

function enableButtons() {
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => {
    button.disabled = false;
  });
}

function disableButtons() {
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => {
    button.disabled = true;
  });

  nextQuestionButton.disabled = false;
}

function clearGame() {
  numAttempts = 0;
  allRandomStudents = [];
  quizStarted = false;
  chosenStudent = {};
  rightAnswers = 0;
  totalGuessesAllowed = 0;
  correctGuess = false;
  allStudentsForButtons = [];

  nextQuestionButton.style.display = 'none';
  newGameButton.style.display = 'none';
  rightOrWrong.style.display = 'none';
  imageContainer.innerHTML = '';
  allButtons.innerHTML = '';
  rightOrWrong.innerHTML = '';
  howManyCorrect.innerHTML = 'How many right answers';
  guesses.innerHTML = 'How many guesses';
}

function newGame() {
  clearGame();
  location.reload();
  startQuizButton.style.display = 'block';
}

startQuizButton.addEventListener('click', startQuiz);
newGameButton.addEventListener('click', newGame);