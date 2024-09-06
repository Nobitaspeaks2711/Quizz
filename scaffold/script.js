//Write your javascript code here
// Variables
let score = 0;
let timer;
let timeLeft = 30;
let currentQuestion;

// DOM Elements
const startQuizButton = document.getElementById('startQuiz');
const quizScreen = document.getElementById('quizScreen');
const endScreen = document.getElementById('endScreen');
const questionElement = document.getElementById('question');
const answerButtons = document.querySelectorAll('.answer');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const playAgainButton = document.getElementById('playAgain');
const endMessage = document.getElementById('endMessage');

const apiURL = 'https://opentdb.com/api.php?amount=1';

startQuizButton.addEventListener('click', startQuiz);

function startQuiz() {
    score = 0;
    timeLeft = 30;
    scoreElement.textContent = score;
    showScreen(quizScreen);
    fetchQuestion();
    startTimer();
}
function fetchQuestion() {
    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.results && data.results.length > 0) {
                displayQuestion(data.results[0]);
            } else {
                throw new Error('No question data available');
            }
        })
        .catch(error => {
            console.error('Error fetching the question:', error);
            showError();
        });
}

function displayQuestion(questionData) {
    currentQuestion = questionData;
    questionElement.textContent = currentQuestion.question;
    
    const answers = [
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer
    ];

    answers.sort(() => Math.random() - 0.5);

    answerButtons.forEach((button, index) => {
        button.textContent = answers[index];
        button.disabled = false;
        button.onclick = () => checkAnswer(button.textContent);
    });
}
function checkAnswer(selectedAnswer) {
    const correctAnswer = currentQuestion.correct_answer;

    if (selectedAnswer === correctAnswer) {
        score += 10;
        scoreElement.textContent = score;
    }
    setTimeout(() => {
        fetchQuestion();
    }, 500);
}
function startTimer() {
    timeLeft = 30;
    timerElement.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000);
}
function endQuiz() {
    clearInterval(timer);
    finalScoreElement.textContent = score;

    if (score >= 50) {
        endMessage.textContent = 'Great job!';
    } else {
        endMessage.textContent = 'Keep practicing!';
    }

    showScreen(endScreen);
}

playAgainButton.addEventListener('click', () => {
    showScreen(document.getElementById('startScreen'));
});

function showError() {
    questionElement.textContent = 'Error fetching the question. Please try again.';
    answerButtons.forEach(button => button.disabled = true);
}

function showScreen(screenToShow) {
    document.querySelectorAll('.container > div').forEach(screen => {
        screen.classList.add('hidden');
    });
    screenToShow.classList.remove('hidden');
}
