// Пути к JSON-файлам
const questionsURL = './data/test.json';
const professionsURL = './data/professions.json';


// DOM-элементы
const quizForm = document.getElementById('quiz-form');
const submitBtn = document.getElementById('submit-btn');
const resultContainer = document.getElementById('quiz-result');

// Глобальные переменные
let professions = [];
let questions = [];

// Функция загрузки JSON
async function loadJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Ошибка загрузки ${url}: ${res.statusText}`);
  return res.json();
}

// Рендер вопросов
function renderQuiz(savedAnswers = []) {
  console.log('renderQuiz called, questions.length =', questions.length);

  quizForm.innerHTML = '';
  questions.forEach((q, i) => {
    const checkedYes = savedAnswers[i] === '1' ? 'checked' : '';
    const checkedNo = savedAnswers[i] === '0' ? 'checked' : '';

    const div = document.createElement('div');
    div.classList.add('quiz-question');
    div.style.marginBottom = '15px';
    div.innerHTML = `
      <p>${i + 1}. ${q.question}</p>
      <label><input type="radio" name="q${i}" value="1" ${checkedYes} required> Да</label>
      <label style="margin-left: 15px;"><input type="radio" name="q${i}" value="0" ${checkedNo} required> Нет</label>
    `;
    quizForm.appendChild(div);
  });

  quizForm.style.display = 'block';
  submitBtn.style.display = 'inline-block';
  resultContainer.style.display = 'none';
  resultContainer.innerHTML = '';
}

// Подсчёт результатов
function calculateResults() {
  const answers = [];
  for (let i = 0; i < questions.length; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (!selected) {
      alert(`Пожалуйста, ответьте на вопрос №${i + 1}`);
      return null;
    }
    answers.push(selected.value);
  }

  const scores = {};
  answers.forEach((ans, i) => {
    if (ans === '1') {
      const tags = questions[i].tags || [];
      tags.forEach(tag => {
        scores[tag] = (scores[tag] || 0) + 1;
      });
    }
  });

  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return { answers, sortedScores };
}

// Показ результатов — теперь результаты под тестом, профессии кликабельны
function showResults(sortedScores) {
  quizForm.style.display = 'none';      // скрываем форму
  submitBtn.style.display = 'none';     // скрываем кнопку "узнать результат"
  resultContainer.style.display = 'block'; // показываем результат

  if (sortedScores.length === 0) {
    resultContainer.innerHTML = `<p>По вашим ответам не удалось подобрать подходящую профессию.</p>`;
    return;
  }

  let html = `<h3>Ваши наиболее подходящие профессии:</h3><ul>`;
  sortedScores.slice(0, 3).forEach(([tag, score]) => {
    const prof = professions.find(p => p.id === tag);
    const title = prof ? prof.title : `Неизвестная профессия (${tag})`;
    const link = prof ? `profession-library.html#${prof.id}` : '#';

    html += `<li><a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a> — совпадений: ${score}</li>`;
  });
  html += `</ol><button id="retake-btn" class="test-submit-btn" style="margin-top:20px;">Пройти тест заново</button>`;


  resultContainer.innerHTML = html;

  const retakeBtn = document.getElementById('retake-btn');
  retakeBtn.addEventListener('click', () => {
    localStorage.removeItem('testAnswers');
    localStorage.removeItem('testScores');
    resultContainer.style.display = 'none';
    renderQuiz();
  });
}


// Кнопка "узнать результат"
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const res = calculateResults();
  if (!res) return;

  localStorage.setItem('testAnswers', JSON.stringify(res.answers));
  localStorage.setItem('testScores', JSON.stringify(res.sortedScores));

  showResults(res.sortedScores);
});

// Инициализация
async function init() {
  try {
    professions = await loadJSON(professionsURL);
    const questionsData = await loadJSON(questionsURL);
    questions = questionsData;

    console.log('professions loaded:', professions);
    console.log('questions loaded:', questions);

    const savedAnswers = JSON.parse(localStorage.getItem('testAnswers'));
    const savedScores = JSON.parse(localStorage.getItem('testScores'));

    if (savedScores && savedScores.length > 0) {
      showResults(savedScores);
    } else {
      renderQuiz(savedAnswers || []);
    }

  } catch (e) {
    quizForm.innerHTML = `<p style="color:red;">Ошибка загрузки данных: ${e.message}</p>`;
    submitBtn.style.display = 'none';
  }
}

window.addEventListener('load', init);
