/**
 * Bright Path Academy
 * Course Finder Quiz & Speed Math Arcade Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initCourseQuiz();
  initSpeedMathArcade();
});

/* ==========================================================================
   1. Interactive Course Finder Quiz
   ========================================================================== */
function initCourseQuiz() {
  const quizContainer = document.getElementById('course-quiz-container');
  if (!quizContainer) return;

  const quizData = {
    step: 1,
    answers: {
      age: '',
      goal: '',
      board: ''
    }
  };

  const steps = [
    {
      id: 'age',
      title: 'How old is your child?',
      subtitle: 'We customize curriculum based on cognitive developmental milestones.',
      options: [
        { label: '4 to 6 Years', value: '4-6', icon: '🐣', tag: 'Junior Foundation' },
        { label: '7 to 10 Years', value: '7-10', icon: '🚀', tag: 'Elementary Growth' },
        { label: '11 to 15 Years', value: '11-15', icon: '🎯', tag: 'Middle / High School' }
      ]
    },
    {
      id: 'goal',
      title: 'What is your primary focus for them?',
      subtitle: 'Select the primary skill or improvement area you desire most.',
      options: [
        { label: 'Phonics, English Reading & Spellings', value: 'phonics', icon: '🔤', tag: 'Phonics Fun' },
        { label: 'Lightning Mental Math & Calculation Speed', value: 'abacus', icon: '🧮', tag: 'Abacus / Vedic' },
        { label: 'School Subject Tuitions & Exam Scores', value: 'tuition', icon: '📚', tag: 'CBSE / ICSE / SSC' },
        { label: 'Neat Handwriting & Speed Writing', value: 'handwriting', icon: '✍️', tag: 'Handwriting Mastery' },
        { label: 'Mandala Art & Creative Focus', value: 'art', icon: '🎨', tag: 'Mindfulness & Art' }
      ]
    },
    {
      id: 'board',
      title: 'Which syllabus / board does your child study?',
      subtitle: 'Our certified tutors teach tailored syllabus for each board.',
      options: [
        { label: 'CBSE Curriculum', value: 'cbse', icon: '🇮🇳' },
        { label: 'ICSE / ISC Board', value: 'icse', icon: '📖' },
        { label: 'SSC / Telangana State Board', value: 'ssc', icon: '🏛️' },
        { label: 'Preschool / Kindergarten', value: 'kindergarten', icon: '🎨' }
      ]
    }
  ];

  function renderQuizStep() {
    if (quizData.step <= 3) {
      const current = steps[quizData.step - 1];
      quizContainer.innerHTML = `
        <div class="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100 max-w-xl mx-auto transition-all">
          <!-- Step Progress Tracker -->
          <div class="flex items-center justify-between mb-6">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Step ${quizData.step} of 3</span>
            <div class="flex gap-1.5">
              <span class="w-8 h-2 rounded-full ${quizData.step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}"></span>
              <span class="w-8 h-2 rounded-full ${quizData.step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}"></span>
              <span class="w-8 h-2 rounded-full ${quizData.step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}"></span>
            </div>
          </div>

          <h3 class="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-2">${current.title}</h3>
          <p class="text-sm text-slate-500 mb-6">${current.subtitle}</p>

          <div class="space-y-3">
            ${current.options.map(opt => `
              <button 
                type="button" 
                class="quiz-option-btn w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between transition-all group text-left"
                data-key="${current.id}" 
                data-value="${opt.value}"
              >
                <div class="flex items-center gap-3">
                  <span class="text-2xl group-hover:scale-110 transition">${opt.icon}</span>
                  <div>
                    <div class="font-bold text-slate-800 text-sm sm:text-base">${opt.label}</div>
                    ${opt.tag ? `<div class="text-xs text-blue-600 font-semibold">${opt.tag}</div>` : ''}
                  </div>
                </div>
                <span class="text-slate-300 group-hover:text-blue-600 text-lg font-bold">→</span>
              </button>
            `).join('')}
          </div>

          ${quizData.step > 1 ? `
            <div class="mt-6 pt-4 border-t border-slate-100">
              <button id="quiz-back-btn" class="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                ← Back to previous question
              </button>
            </div>
          ` : ''}
        </div>
      `;

      // Event listeners
      quizContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-key');
          const val = btn.getAttribute('data-value');
          quizData.answers[key] = val;
          quizData.step++;
          renderQuizStep();
        });
      });

      const backBtn = quizContainer.querySelector('#quiz-back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          quizData.step--;
          renderQuizStep();
        });
      }
    } else {
      renderRecommendation();
    }
  }

  function renderRecommendation() {
    const { age, goal, board } = quizData.answers;
    let rec = {
      title: 'Soroban Abacus & Mental Math Mastery',
      badge: 'Best Match for Cognitive Growth',
      description: 'Accelerate left and right brain coordination, mental arithmetic speed, and deep concentration through Bright Path Academy’s proven Soroban Abacus curriculum.',
      highlights: ['8 Structured Progressive Levels', 'Small Batches (Max 8 students)', 'Interactive Soroban Tool Included', 'State & National Competition Readiness'],
      programLink: 'programs.html#abacus'
    };

    if (goal === 'phonics') {
      rec = {
        title: 'Phonics Fun & English Reading Mastery',
        badge: 'Top Pick for Reading & Spelling Fluency',
        description: 'Empower your child with joyful reading confidence, 44 phonics sounds, multi-sensory blending, and decoded spelling rules (e.g. C vs K, -k vs -ck).',
        highlights: ['Independent Book Reading', 'Spelling Rules Demystified', '3D Vocabulary Building', 'Online & Offline Batches'],
        programLink: 'programs.html#phonics'
      };
    } else if (goal === 'art') {
      rec = {
        title: 'Mandala Art Classes for Kids & Traditional Art',
        badge: 'Creative Mindfulness Booster',
        description: 'Cultivate deep focus, fine motor precision, symmetry, and patience through captivating mandala geometry and traditional art styles.',
        highlights: ['Mindfulness & Digital Detox', 'Geometric Symmetry & Pen Techniques', 'Student Art Showcase', 'Weekend Studio Batches'],
        programLink: 'programs.html#art'
      };
    } else if (goal === 'tuition' || age === '11-15') {
      rec = {
        title: 'Mastery Academic Tuitions & Concept Coaching',
        badge: 'Top Choice for Academic Excellence',
        description: `Comprehensive school syllabus coaching for ${board.toUpperCase()} students with daily homework assistance, chapter tests, and strong fundamentals in Maths and Science.`,
        highlights: ['Individual Doubt Clearing', 'Weekly Chapter Mock Tests', 'CBSE / ICSE / SSC Specialized Mentors', 'Regular Parent Progress Reports'],
        programLink: 'programs.html#tuition'
      };
    } else if (goal === 'handwriting') {
      rec = {
        title: '30-Day Handwriting & Calligraphy Mastery',
        badge: 'Fast Results Program',
        description: 'Transform illegible writing into beautiful cursive with scientific grip posture, letter-spacing techniques, and speed writing exercises.',
        highlights: ['Guaranteed Improvement in 30 Days', 'Posture & Grip Correction', 'Speed + Legibility Balance', 'Exam-Ready Presentation Style'],
        programLink: 'programs.html#handwriting'
      };
    }

    const whatsappText = encodeURIComponent(
      `Hello Bright Path Academy! I took your Course Quiz for my child (Age: ${age}, Goal: ${goal}, Board: ${board}). I would like to book a Free Demo Class for "${rec.title}".`
    );

    quizContainer.innerHTML = `
      <div class="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-6 sm:p-10 rounded-3xl shadow-2xl max-w-xl mx-auto border border-blue-700/50 relative overflow-hidden">
        <div class="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl"></div>
        
        <div class="relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-full mb-4 shadow">
            ★ ${rec.badge}
          </div>

          <h3 class="text-2xl sm:text-3xl font-bold font-display text-white mb-3">${rec.title}</h3>
          <p class="text-blue-100 text-sm leading-relaxed mb-6">${rec.description}</p>

          <div class="bg-white/10 backdrop-blur rounded-2xl p-4 sm:p-5 mb-6 border border-white/15">
            <h4 class="text-xs uppercase tracking-wider font-bold text-amber-300 mb-3">Key Features of this Course:</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-200">
              ${rec.highlights.map(h => `
                <div class="flex items-center gap-2">
                  <span class="text-emerald-400 font-bold">✓</span> ${h}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- CTAs -->
          <div class="space-y-3">
            <a 
              href="https://wa.me/919703822227?text=${whatsappText}" 
              target="_blank"
              class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-center flex items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              Book Free Demo on WhatsApp
            </a>
            
            <button 
              id="quiz-restart-btn" 
              class="w-full py-2.5 text-center text-xs text-blue-200 hover:text-white font-semibold transition"
            >
              ↺ Retake Quiz for Another Child
            </button>
          </div>
        </div>
      </div>
    `;

    quizContainer.querySelector('#quiz-restart-btn').addEventListener('click', () => {
      quizData.step = 1;
      quizData.answers = { age: '', goal: '', board: '' };
      renderQuizStep();
    });
  }

  renderQuizStep();
}

/* ==========================================================================
   2. Interactive Speed Math Flashcard Arcade
   ========================================================================== */
function initSpeedMathArcade() {
  const gameContainer = document.getElementById('speed-math-game');
  if (!gameContainer) return;

  let gameState = {
    isRunning: false,
    score: 0,
    streak: 0,
    timeLeft: 30,
    timerId: null,
    currentQuestion: null,
    difficulty: 'easy' // 'easy', 'medium', 'hard'
  };

  function generateQuestion(diff) {
    let num1, num2, op, answer;
    if (diff === 'easy') {
      // 1-digit or simple 2-digit addition/subtraction
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = Math.floor(Math.random() * 9) + 1;
      op = Math.random() > 0.5 ? '+' : '-';
      if (op === '-' && num1 < num2) [num1, num2] = [num2, num1];
      answer = op === '+' ? num1 + num2 : num1 - num2;
    } else if (diff === 'medium') {
      // 2-digit arithmetic
      num1 = Math.floor(Math.random() * 45) + 10;
      num2 = Math.floor(Math.random() * 45) + 10;
      const opChoice = Math.random();
      if (opChoice < 0.6) {
        op = '+';
        answer = num1 + num2;
      } else {
        op = '-';
        if (num1 < num2) [num1, num2] = [num2, num1];
        answer = num1 - num2;
      }
    } else {
      // Multiplication or 3-digit mental addition
      if (Math.random() > 0.4) {
        num1 = Math.floor(Math.random() * 12) + 2;
        num2 = Math.floor(Math.random() * 9) + 2;
        op = '×';
        answer = num1 * num2;
      } else {
        num1 = Math.floor(Math.random() * 80) + 20;
        num2 = Math.floor(Math.random() * 80) + 20;
        op = '+';
        answer = num1 + num2;
      }
    }

    // Generate 3 distractors
    const choices = new Set([answer]);
    while (choices.size < 4) {
      const delta = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const fake = Math.max(0, answer + delta);
      choices.add(fake);
    }

    return {
      num1,
      num2,
      op,
      answer,
      options: Array.from(choices).sort(() => Math.random() - 0.5)
    };
  }

  function renderGameUI() {
    if (!gameState.isRunning) {
      gameContainer.innerHTML = `
        <div class="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl text-center shadow-xl border border-indigo-800/40">
          <div class="w-16 h-16 bg-amber-400 text-slate-900 rounded-2xl mx-auto flex items-center justify-center text-3xl font-extrabold mb-4 shadow-lg shadow-amber-400/20">
            ⚡
          </div>
          <h3 class="text-2xl font-bold font-display text-white mb-2">30-Second Speed Math Drill</h3>
          <p class="text-sm text-slate-300 max-w-md mx-auto mb-6">
            Test how fast your brain can calculate arithmetic problems before enrolling in our Abacus training!
          </p>

          <div class="flex justify-center gap-2 mb-6">
            <button class="diff-btn px-4 py-2 rounded-xl text-xs font-bold transition ${gameState.difficulty === 'easy' ? 'bg-amber-400 text-slate-900 shadow' : 'bg-white/10 text-slate-300'}" data-diff="easy">Junior (Ages 4-7)</button>
            <button class="diff-btn px-4 py-2 rounded-xl text-xs font-bold transition ${gameState.difficulty === 'medium' ? 'bg-amber-400 text-slate-900 shadow' : 'bg-white/10 text-slate-300'}" data-diff="medium">Master (Ages 8-11)</button>
            <button class="diff-btn px-4 py-2 rounded-xl text-xs font-bold transition ${gameState.difficulty === 'hard' ? 'bg-amber-400 text-slate-900 shadow' : 'bg-white/10 text-slate-300'}" data-diff="hard">Super Champ (12+)</button>
          </div>

          <button id="start-game-btn" class="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 font-bold rounded-2xl text-white shadow-lg transition transform hover:scale-105">
            Start Challenge! ⏱️
          </button>
        </div>
      `;

      gameContainer.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          gameState.difficulty = btn.getAttribute('data-diff');
          renderGameUI();
        });
      });

      const startBtn = gameContainer.querySelector('#start-game-btn');
      if (startBtn) {
        startBtn.addEventListener('click', startGame);
      }
    } else {
      const q = gameState.currentQuestion;
      gameContainer.innerHTML = `
        <div class="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-800/40">
          <!-- Top bar: Timer, Score, Streak -->
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-white/10 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400">Score:</span>
              <span class="text-xl font-bold font-mono text-amber-400">${gameState.score}</span>
              ${gameState.streak >= 3 ? `<span class="text-xs bg-orange-500/30 text-orange-400 px-2 py-0.5 rounded-full font-bold">🔥 ${gameState.streak} Streak!</span>` : ''}
            </div>
            <div class="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
              <span class="text-xs text-slate-300">Time:</span>
              <span class="text-base font-bold font-mono ${gameState.timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}">${gameState.timeLeft}s</span>
            </div>
          </div>

          <!-- Problem Display -->
          <div class="py-6 text-center">
            <div class="text-4xl sm:text-5xl font-mono font-extrabold tracking-wider text-white">
              ${q.num1} ${q.op} ${q.num2} = <span class="text-amber-400">?</span>
            </div>
          </div>

          <!-- Multiple Choice Buttons -->
          <div class="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            ${q.options.map(opt => `
              <button 
                type="button"
                class="choice-btn py-3 sm:py-4 bg-white/10 hover:bg-amber-400 hover:text-slate-900 text-white font-mono font-bold text-xl sm:text-2xl rounded-2xl border border-white/10 transition-all active:scale-95"
                data-val="${opt}"
              >
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      gameContainer.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const chosen = parseInt(btn.getAttribute('data-val'));
          handleAnswer(chosen);
        });
      });
    }
  }

  function startGame() {
    gameState.isRunning = true;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.timeLeft = 30;
    gameState.currentQuestion = generateQuestion(gameState.difficulty);
    renderGameUI();

    clearInterval(gameState.timerId);
    gameState.timerId = setInterval(() => {
      gameState.timeLeft--;
      if (gameState.timeLeft <= 0) {
        endGame();
      } else {
        const timeEl = gameContainer.querySelector('.font-mono.text-emerald-400, .font-mono.text-rose-400');
        if (timeEl) {
          timeEl.textContent = `${gameState.timeLeft}s`;
          if (gameState.timeLeft <= 5) {
            timeEl.className = 'text-base font-bold font-mono text-rose-400 animate-pulse';
          }
        }
      }
    }, 1000);
  }

  function handleAnswer(val) {
    if (val === gameState.currentQuestion.answer) {
      gameState.score += 10 + gameState.streak * 2;
      gameState.streak++;
    } else {
      gameState.streak = 0;
    }
    gameState.currentQuestion = generateQuestion(gameState.difficulty);
    renderGameUI();
  }

  function endGame() {
    clearInterval(gameState.timerId);
    gameState.isRunning = false;

    gameContainer.innerHTML = `
      <div class="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl text-center shadow-xl border border-indigo-800/40">
        <div class="text-4xl mb-2">🎉</div>
        <h3 class="text-2xl font-bold font-display text-white mb-1">Time’s Up!</h3>
        <p class="text-slate-400 text-sm mb-4">Great mental workout!</p>

        <div class="bg-white/10 rounded-2xl p-4 max-w-xs mx-auto mb-6">
          <div class="text-xs uppercase tracking-wider text-amber-300 font-bold mb-1">Final Score</div>
          <div class="text-4xl font-extrabold font-mono text-white">${gameState.score} Points</div>
        </div>

        <p class="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto mb-6">
          With just 3 months of Bright Path Academy Abacus training, students multiply their calculation speed by <span class="text-amber-400 font-bold">5x to 10x</span>!
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-3">
          <button id="retry-game-btn" class="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm transition">
            ↺ Play Again
          </button>
          <a href="https://wa.me/919703822227?text=Hi%2C%20I%20just%20played%20the%20Speed%20Math%20challenge%20on%20your%20website%20and%20scored%20${gameState.score}%20points!%20I%20want%20to%20enroll%20my%20child%20for%20a%20Free%20Demo%20Session." target="_blank" class="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition shadow-lg">
            Claim Free Demo Class
          </a>
        </div>
      </div>
    `;

    const retryBtn = gameContainer.querySelector('#retry-game-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', startGame);
    }
  }

  renderGameUI();
}
