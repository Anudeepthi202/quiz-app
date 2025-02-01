document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const nextBtn = document.getElementById('next-btn');
  const questionElement = document.getElementById('question');
  const answersElement = document.getElementById('answers');
  const quizBox = document.getElementById('quiz-box');
  const resultBox = document.getElementById('result-box');
  const scoreElement = document.getElementById('score');
  const timerElement = document.getElementById('timer');
  const scoreAnimation = document.getElementById('score-animation');
  const badgeContainer = document.getElementById('badge-container');

  let currentQuestionIndex = 0;
  let score = 0;
  let quizData = [];
  let timer;
  let timeLeft = 15;

  const correctSound = new Audio('correct.mp3');
  const wrongSound = new Audio('wrong.mp3');

  startBtn.addEventListener('click', startQuiz);
  nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
  });

  async function fetchQuizData() {
    try {
      const response = await fetch('https://api.jsonserve.com/Uw5CrX');
      const data = await response.json();
      quizData = data.questions;
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
  }

  async function startQuiz() {
    startBtn.classList.add('hide');
    quizBox.classList.remove('hide');
    await fetchQuizData();
    currentQuestionIndex = 0;
    score = 0;
    setNextQuestion();
  }

  function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < quizData.length) {
      showQuestion(quizData[currentQuestionIndex]);
      startTimer();
    } else {
      showResult();
    }
  }

  function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
      const button = document.createElement('button');
      button.innerText = answer.text;
      button.classList.add('answer-btn');
      if (answer.correct) {
        button.dataset.correct = answer.correct;
      }
      button.addEventListener('click', selectAnswer);
      answersElement.appendChild(button);
    });
  }

  function resetState() {
    clearStatusClass(document.body);
    nextBtn.classList.add('hide');
    answersElement.innerHTML = '';
    clearInterval(timer);
    timerElement.innerText = '';
    timeLeft = 15;
  }

  function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    setStatusClass(selectedButton, correct);
    Array.from(answersElement.children).forEach(button => {
      setStatusClass(button, button.dataset.correct);
    });
    if (correct) {
      score += 10;
      correctSound.play();
      animateScore();
    } else {
      wrongSound.play();
    }
    clearInterval(timer);
    nextBtn.classList.remove('hide');
  }

  function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
      element.classList.add('correct');
    } else {
      element.classList.add('wrong');
    }
  }

  function clearStatusClass(element) {
    element.classList.remove('correct', 'wrong');
  }

  function showResult() {
    quizBox.classList.add('hide');
    resultBox.classList.remove('hide');
    scoreElement.innerText = score;
    displayBadge();
  }

  function animateScore() {
    scoreAnimation.style.display = 'block';
    setTimeout(() => {
      scoreAnimation.style.display = 'none';
    }, 1000);
  }

  function displayBadge() {
    let badge = '';
    if (score >= 80) {
      badge = '🏆 Gold Badge!';
    } else if (score >= 50) {
      badge = '🥈 Silver Badge!';
    } else {
      badge = '🥉 Bronze Badge!';
    }
    badgeContainer.innerText = badge;
  }

  function startTimer() {
    timerElement.innerText = `Time left: ${timeLeft}s`;
    timer = setInterval(() => {
      timeLeft--;
      timerElement.innerText = `Time left: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        nextBtn.classList.remove('hide');
      }
    }, 1000);
  }
});

