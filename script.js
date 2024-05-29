document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-pomodoro');
    const resetButton = document.getElementById('reset-pomodoro');
    const settingsButton = document.getElementById('open-settings');
    const setPomodoroButton = document.getElementById('set-pomodoro');
    const pomodoroModeButton = document.getElementById('pomodoro-mode');
    const shortBreakModeButton = document.getElementById('short-break-mode');
    const longBreakModeButton = document.getElementById('long-break-mode');
    const pomodoroMinutesInput = document.getElementById('pomodoro-minutes');
    const shortBreakMinutesInput = document.getElementById('short-break-minutes');
    const longBreakMinutesInput = document.getElementById('long-break-minutes');
    const colorSelection = document.getElementById('color-selection');

    let interval;
    let timerRunning = false;
    let remainingTime = 0;
    let pomodoroMinutes = parseInt(pomodoroMinutesInput.value);
    let shortBreakMinutes = parseInt(shortBreakMinutesInput.value);
    let longBreakMinutes = parseInt(longBreakMinutesInput.value);

    // Load settings from localStorage
    loadSettings();

    startButton.addEventListener('click', startPomodoro);
    resetButton.addEventListener('click', resetPomodoro);
    settingsButton.addEventListener('click', toggleSettings);
    setPomodoroButton.addEventListener('click', setPomodoroSettings);
    pomodoroModeButton.addEventListener('click', () => setMode('pomodoro'));
    shortBreakModeButton.addEventListener('click', () => setMode('short-break'));
    longBreakModeButton.addEventListener('click', () => setMode('long-break'));
    colorSelection.addEventListener('change', changeBackgroundColor);

    function startPomodoro() {
        if (!timerRunning) {
            timerRunning = true;
            const currentMode = document.querySelector('.buttons button.active').id;

            if (currentMode === 'pomodoro-mode') {
                remainingTime = pomodoroMinutes * 60;
            } else if (currentMode === 'short-break-mode') {
                remainingTime = shortBreakMinutes * 60;
            } else if (currentMode === 'long-break-mode') {
                remainingTime = longBreakMinutes * 60;
            }

            interval = setInterval(updateTimer, 1000);
        }
    }

    function resetPomodoro() {
        clearInterval(interval);
        timerRunning = false;
        const currentMode = document.querySelector('.buttons button.active').id;

        if (currentMode === 'pomodoro-mode') {
            remainingTime = pomodoroMinutes * 60;
        } else if (currentMode === 'short-break-mode') {
            remainingTime = shortBreakMinutes * 60;
        } else if (currentMode === 'long-break-mode') {
            remainingTime = longBreakMinutes * 60;
        }

        updateTimerDisplay();
    }

    function toggleSettings() {
        const settings = document.getElementById('settings');
        settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
        const buttonText = settings.style.display === 'none' ? '設定' : '閉じる';
        setPomodoroButton.textContent = buttonText;
    }

    function setPomodoroSettings() {
        pomodoroMinutes = parseInt(pomodoroMinutesInput.value);
        shortBreakMinutes = parseInt(shortBreakMinutesInput.value);
        longBreakMinutes = parseInt(longBreakMinutesInput.value);

        localStorage.setItem('pomodoroMinutes', pomodoroMinutes);
        localStorage.setItem('shortBreakMinutes', shortBreakMinutes);
        localStorage.setItem('longBreakMinutes', longBreakMinutes);

        updateTimerDisplay();

        toggleSettings();
    }

    function loadSettings() {
        pomodoroMinutes = parseInt(localStorage.getItem('pomodoroMinutes')) || 25;
        shortBreakMinutes = parseInt(localStorage.getItem('shortBreakMinutes')) || 5;
        longBreakMinutes = parseInt(localStorage.getItem('longBreakMinutes')) || 15;

        pomodoroMinutesInput.value = pomodoroMinutes;
        shortBreakMinutesInput.value = shortBreakMinutes;
        longBreakMinutesInput.value = longBreakMinutes;

        updateTimerDisplay();
    }

    function setMode(mode) {
        document.querySelectorAll('.buttons button').forEach(button => button.classList.remove('active'));

        if (mode === 'pomodoro') {
            pomodoroModeButton.classList.add('active');
            updateTimerDisplay(pomodoroMinutes);
        } else if (mode === 'short-break') {
            shortBreakModeButton.classList.add('active');
            updateTimerDisplay(shortBreakMinutes);
        } else if (mode === 'long-break') {
            longBreakModeButton.classList.add('active');
            updateTimerDisplay(longBreakMinutes);
        }
    }

    function updateTimer() {
        remainingTime--;
        updateTimerDisplay(Math.floor(remainingTime / 60), remainingTime % 60);

        if (remainingTime <= 0) {
            clearInterval(interval);
            timerRunning = false;
        }
    }

    function updateTimerDisplay(minutes = 0, seconds = 0) {
        document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function changeBackgroundColor() {
        const color = colorSelection.value;
        document.body.style.background = color;
    }
});
