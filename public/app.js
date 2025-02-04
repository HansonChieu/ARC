async function chat(sex, age, experience, goal) {
  try {
    const response = await fetch('http://localhost:8080/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sex, age, experience, goal }),
    });

    const data = await response.json();
    const answer = data.answer;
    console.log({ answer });
    displayOutput(answer);
  } catch (error) {
    console.error(error);
    displayOutput('<p class="text-red-500">An error occurred. Please try again.</p>');
  } finally {
    toggleSubmitButton();
  }
}

function toggleSubmitButton() {
  const submitButton = document.querySelector('#generate');
  const submitButtonText = submitButton.querySelector('span');
  const submitButtonSpinner = submitButton.querySelector('.loading');

  submitButton.disabled = submitButton.classList.toggle('opacity-50');
  submitButtonText.hidden = !submitButtonText.hidden;
  submitButtonSpinner.hidden = !submitButtonSpinner.hidden;
}

function displayOutput(html) {
  const output = document.querySelector('#workoutOutput');
  output.innerHTML = html;
}

function clearOutput() {
  displayOutput('');
}

function processFormInput(form) {
  const sex = form['gender'].value;
  const age = form['age'].value;
  const experience = form['experience'].value;
  const goal = form['fitnessGoal'].value;

  toggleSubmitButton();
  clearOutput();
  chat(sex, age, experience, goal);
}

function main() {
  document.querySelector('#workoutForm').onsubmit = function (e) {
    e.preventDefault();
    processFormInput(e.target);
  };
}

addEventListener('DOMContentLoaded', main);

