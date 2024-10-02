document.addEventListener('DOMContentLoaded', () => {
  const eventNameInput = document.getElementById('event-name');
  const dateTimeInput = document.getElementById('date-time');
  const startButton = document.getElementById('start-button');
  const countdownDisplay = document.getElementById('countdown-display');

  let countdownInterval;

  // Load saved event data
  chrome.storage.local.get(['eventName', 'eventDateTime'], (result) => {
    if (result.eventName && result.eventDateTime) {
      eventNameInput.value = result.eventName;
      dateTimeInput.value = result.eventDateTime;
      startCountdown();
    }
  });

  startButton.addEventListener('click', () => {
    if (eventNameInput.value === '' || dateTimeInput.value === '') {
      alert('Please enter an event name and select a date and time.');
      return;
    }

    // Save event data
    chrome.storage.local.set({
      eventName: eventNameInput.value,
      eventDateTime: dateTimeInput.value
    });

    startCountdown();
  });

  function startCountdown() {
    clearInterval(countdownInterval);

    const eventName = eventNameInput.value;
    const eventDateTime = new Date(dateTimeInput.value);

    if (isNaN(eventDateTime)) {
      countdownDisplay.textContent = 'Invalid date/time.';
      return;
    }

    countdownInterval = setInterval(() => {
      const now = new Date();
      const timeRemaining = eventDateTime - now;

      if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        countdownDisplay.textContent = `${eventName} has occurred!`;
        return;
      }

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
      const seconds = Math.floor((timeRemaining / 1000) % 60);

      countdownDisplay.textContent = `${eventName} in ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }
});

