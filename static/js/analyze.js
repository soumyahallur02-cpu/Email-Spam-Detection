const textarea = document.getElementById('message');

const chars = document.getElementById('characters');

const words = document.getElementById('words');

textarea.addEventListener('input', () => {
  chars.innerHTML = 'Characters : ' + textarea.value.length;

  words.innerHTML =
    'Words : ' + textarea.value.trim().split(/\s+/).filter(Boolean).length;
});

document.getElementById('spamBtn').onclick = () => {
  textarea.value = `Congratulations!

You have won $5000.

Click the link below immediately to claim your prize.

Offer expires today.

`;

  textarea.dispatchEvent(new Event('input'));
};

document.getElementById('safeBtn').onclick = () => {
  textarea.value = `Hi Team,

The project meeting has been rescheduled to tomorrow at 10 AM.

Please review the attached agenda before joining.

Regards,

Manager`;

  textarea.dispatchEvent(new Event('input'));
};

document.getElementById('textfile').addEventListener('change', function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      textarea.value = e.target.result;

      textarea.dispatchEvent(new Event('input'));
    };

    reader.readAsText(file);
  }
});
const form = document.getElementById('analyzeForm');

form.addEventListener('submit', function (e) {
  const message = textarea.value.trim();

  const file = document.getElementById('textfile').files.length;

  if (message === '' && file === 0) {
    alert('Please paste a message or upload a file.');

    e.preventDefault();

    return;
  }

  e.preventDefault();

  document.getElementById('loadingOverlay').style.display = 'flex';

  const status = document.getElementById('loadingStatus');

  const bar = document.getElementById('loadingBar');

  const percent = document.getElementById('loadingPercent');

  const steps = [
    'Loading AI Model...',

    'Cleaning Email...',

    'Removing Stop Words...',

    'Tokenizing Text...',

    'Creating Feature Vector...',

    'Running Naive Bayes Model...',

    'Calculating Confidence...',

    'Generating Report...',
  ];

  let progress = 0;

  let step = 0;

  const timer = setInterval(function () {
    progress += 12.5;

    bar.style.width = progress + '%';

    percent.innerHTML = Math.round(progress) + '%';

    if (step < steps.length) {
      status.innerHTML = steps[step];

      step++;
    }

    if (progress >= 100) {
      clearInterval(timer);

      HTMLFormElement.prototype.submit.call(form);
    }
  }, 400);
});
