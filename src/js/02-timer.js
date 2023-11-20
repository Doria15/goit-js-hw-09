// Described in documentation
import flatpickr from 'flatpickr';
// Additional styles import
import 'flatpickr/dist/flatpickr.min.css';
// Notiflix
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const datetimePickerEl = document.querySelector('#datetime-picker');
const startButtonEl = document.querySelector('button[data-start]');
const daysEl = document.querySelector('span[data-days]');
const hoursEl = document.querySelector('span[data-hours]');
const minutesEl = document.querySelector('span[data-minutes]');
const secondsEl = document.querySelector('span[data-seconds]');

startButtonEl.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const dateNow = Date.now();

    if (selectedDate < dateNow) {
      Notify.failure('Please choose a date in the future');
      startButtonEl.disabled = true;
      return;
    }

    startButtonEl.disabled = false;

    let timerID = null;

    function handleCountdown() {
      startButtonEl.disabled = true;
      datetimePickerEl.disabled = true;

      timerID = setInterval(() => {
        const currentTime = Date.now();

        if (selectedDate < currentTime) {
          clearInterval(timerID);
          datetimePickerEl.disabled = false;
          return;
        }

        const timeDifference = selectedDate - currentTime;

        const { days, hours, minutes, seconds } = convertMs(timeDifference);

        daysEl.textContent = addLeadingZero(days);
        hoursEl.textContent = addLeadingZero(hours);
        minutesEl.textContent = addLeadingZero(minutes);
        secondsEl.textContent = addLeadingZero(seconds);
      }, 1000);
    }
    startButtonEl.addEventListener('click', handleCountdown);
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
