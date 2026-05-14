const input = document.getElementById('questionInput');
const askBtn = document.getElementById('askBtn');
const clearBtn = document.getElementById('clearBtn');
const charCount = document.getElementById('charCount');
const thinking = document.getElementById('thinkingIndicator');
const answerSection = document.getElementById('answerSection');
const answerText = document.getElementById('answerText');
const questionEcho = document.getElementById('questionEcho');
const errorMsg = document.getElementById('errorMsg');

let selectedSubject = '';

// SUBJECT SELECTION
const chips = document.querySelectorAll('.chip');

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    selectedSubject = chip.dataset.subject;
  });
});

// CHARACTER COUNTER
input.addEventListener('input', () => {
  charCount.textContent = `${input.value.length} / 2000`;
});

// ENTER TO SEND
input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    askQuestion();
  }
});

// CLEAR BUTTON
clearBtn.addEventListener('click', () => {
  input.value = '';
  charCount.textContent = '0 / 2000';
  answerSection.classList.remove('visible');
  errorMsg.classList.remove('show');
});

// ASK QUESTION
askBtn.addEventListener('click', askQuestion);

async function askQuestion() {
  const question = input.value.trim();

  if (!question) return;

  askBtn.disabled = true;
  thinking.classList.add('active');
  answerSection.classList.remove('visible');
  errorMsg.classList.remove('show');

  const systemPrompt = `
You are AcademiQ, an advanced academic AI tutor.

Subject Focus: ${selectedSubject || 'General academics'}

Rules:
- Be accurate
- Explain clearly
- Show steps for math/science
- Use examples
- Use professional academic tone
- Make answers easy to understand
`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: question
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();

    const answer = data.choices[0].message.content;

    questionEcho.textContent = `"${question}"`;

    answerText.innerHTML = answer.replace(
      /\*\*(.*?)\*\*/g,
      '<strong>$1</strong>'
    );

    answerSection.classList.add('visible');

  } catch (error) {
    errorMsg.textContent = error.message;
    errorMsg.classList.add('show');
  }

  finally {
    askBtn.disabled = false;
    thinking.classList.remove('active');
  }
}


---
