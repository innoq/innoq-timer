// INNOQ Timer Application - Main JavaScript Logic
// Following progressive enhancement and web standards

class InnoqTimer {
  constructor() {
    // DOM Elements
    this.hourInput = document.getElementById('hour-input');
    this.minuteInput = document.getElementById('minute-input');
    this.startBtn = document.getElementById('start-btn');
    this.stopBtn = document.getElementById('stop-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.timerDisplay = document.getElementById('timer-display');
    this.timerControls = document.getElementById('timer-controls');
    this.inputSection = document.querySelector('.timer__input-section');
    this.displaySection = document.querySelector('.timer__display-section');
    this.targetTimeDisplay = document.getElementById('target-time-display');
    this.countdownTargetTime = document.getElementById('countdown-target-time');
    
    // Timer state
    this.totalSeconds = 0;
    this.remainingSeconds = 0;
    this.isRunning = false;
    this.intervalId = null;
    
    // Initialize the application
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.updateDisplay();
    this.validateInput();
    this.updateTargetTimeDisplay();
  }
  
  bindEvents() {
    // Input validation on change and input
    this.hourInput.addEventListener('input', () => {
      this.validateInput();
      this.updateTargetTimeDisplay();
    });
    this.hourInput.addEventListener('keypress', (e) => this.handleNumericInput(e));
    this.minuteInput.addEventListener('input', () => {
      this.validateInput();
      this.updateTargetTimeDisplay();
    });
    this.minuteInput.addEventListener('keypress', (e) => this.handleNumericInput(e));
    
    // Enter key to start
    this.hourInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && this.validateInput()) this.handleStart();
    });
    this.minuteInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && this.validateInput()) this.handleStart();
    });
    
    // Button event listeners
    this.startBtn.addEventListener('click', () => this.handleStart());
    this.stopBtn.addEventListener('click', () => this.handleStop());
    this.resetBtn.addEventListener('click', () => this.handleReset());
  }
  
  handleNumericInput(e) {
    // Only allow numbers
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Enter') {
      e.preventDefault();
    }
  }
  
  validateInput() {
    const hourValue = this.hourInput.value.trim();
    const minuteValue = this.minuteInput.value.trim();
    
    if (hourValue === '' || minuteValue === '') {
      this.startBtn.disabled = true;
      return false;
    }
    
    const hour = parseInt(hourValue, 10);
    const minute = parseInt(minuteValue, 10);
    
    // Validate ranges
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      this.startBtn.disabled = true;
      return false;
    }
    
    // Enable if both hour and minute are valid
    this.startBtn.disabled = false;
    return true;
  }
  
  parseTimeInput() {
    const hourValue = this.hourInput.value.trim();
    const minuteValue = this.minuteInput.value.trim();
    
    if (!hourValue || !minuteValue) {
      return 0;
    }
    
    // Parse time input
    const hours = parseInt(hourValue, 10);
    const minutes = parseInt(minuteValue, 10);
    
    if (isNaN(hours) || isNaN(minutes)) {
      return 0;
    }
    
    // Create target datetime for today
    const now = new Date();
    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);
    
    // If the target time is in the past today, set it for tomorrow
    if (targetDate <= now) {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    
    const diffInMs = targetDate.getTime() - now.getTime();
    const diffInSeconds = Math.max(0, Math.floor(diffInMs / 1000));
    
    // Return difference in seconds
    return diffInSeconds;
  }
  
  formatTime(seconds) {
    if (seconds <= 0) {
      return '00:00';
    }
    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }
  
  updateDisplay() {
    this.timerDisplay.textContent = this.formatTime(this.remainingSeconds);
  }
  
  updateTargetTimeDisplay() {
    const hourValue = this.hourInput.value.trim();
    const minuteValue = this.minuteInput.value.trim();
    
    if (!hourValue || !minuteValue) {
      this.targetTimeDisplay.textContent = '';
      return;
    }
    
    const hours = parseInt(hourValue, 10);
    const minutes = parseInt(minuteValue, 10);
    
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      this.targetTimeDisplay.textContent = '';
      return;
    }
    
    // Create target datetime
    const now = new Date();
    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);
    
    // If the target time is in the past today, set it for tomorrow
    if (targetDate <= now) {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    
    // Format as HH:MM
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    this.targetTimeDisplay.textContent = formattedTime;
  }
  
  handleStart() {
    if (!this.validateInput()) {
      this.showError('Please select a target time');
      return;
    }
    
    // Fresh start
    this.totalSeconds = this.parseTimeInput();
    this.remainingSeconds = this.totalSeconds;
    
    if (this.totalSeconds <= 0) {
      this.showError('Please select a time');
      return;
    }
    
    // Start timer
    this.isRunning = true;
    
    // UI Updates - Hide input, show display
    this.inputSection.classList.add('timer__input-section--hidden');
    this.displaySection.classList.add('timer__display-section--visible');
    this.timerControls.classList.remove('timer__controls--hidden');
    this.resetBtn.classList.add('timer__button--hidden');
    this.timerDisplay.classList.add('timer__display--running');
    
    // Update countdown target time display
    const hours = parseInt(this.hourInput.value, 10);
    const minutes = parseInt(this.minuteInput.value, 10);
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    this.countdownTargetTime.textContent = formattedTime;
    
    // Start countdown
    this.startCountdown();
  }
  
  
  handleStop() {
    this.isRunning = false;
    clearInterval(this.intervalId);
    
    // Reset to initial state - show input, hide display
    this.remainingSeconds = 0;
    this.inputSection.classList.remove('timer__input-section--hidden');
    this.displaySection.classList.remove('timer__display-section--visible');
    this.updateDisplay();
    this.resetUI();
  }
  
  handleReset() {
    this.isRunning = false;
    this.totalSeconds = 0;
    this.remainingSeconds = 0;
    
    clearInterval(this.intervalId);
    
    // Reset UI completely - show input, hide display
    this.inputSection.classList.remove('timer__input-section--hidden');
    this.displaySection.classList.remove('timer__display-section--visible');
    this.hourInput.value = '';
    this.minuteInput.value = '';
    this.hourInput.disabled = false;
    this.minuteInput.disabled = false;
    this.updateDisplay();
    this.resetUI();
    this.validateInput();
    
    // Remove finished state
    this.timerDisplay.classList.remove('timer__display--finished');
    this.hourInput.focus();
  }
  
  resetUI() {
    // Show input section, hide display section
    this.inputSection.classList.remove('timer__input-section--hidden');
    this.displaySection.classList.remove('timer__display-section--visible');
    this.hourInput.disabled = false;
    this.minuteInput.disabled = false;
    this.startBtn.textContent = 'Start Timer';
    this.timerControls.classList.add('timer__controls--hidden');
    this.resetBtn.classList.add('timer__button--hidden');
    this.timerDisplay.classList.remove('timer__display--running', 'timer__display--finished');
  }
  
  startCountdown() {
    this.intervalId = setInterval(() => {
      this.remainingSeconds--; // Decrement by 1 second
      this.updateDisplay();
      
      if (this.remainingSeconds <= 0) {
        this.handleTimerComplete();
      }
    }, 1000); // Update every second
  }
  
  handleTimerComplete() {
    this.isRunning = false;
    clearInterval(this.intervalId);
    
    // Keep display section visible, keep input section hidden
    this.inputSection.classList.add('timer__input-section--hidden');
    this.displaySection.classList.add('timer__display-section--visible');
    this.timerDisplay.classList.remove('timer__display--running');
    this.timerDisplay.classList.add('timer__display--finished');
    
    // Show reset button prominently, hide other controls
    this.timerControls.classList.add('timer__controls--hidden');
    this.resetBtn.classList.remove('timer__button--hidden');
    
    // Optional: Play notification sound or show browser notification
    this.notifyComplete();
  }
  
  notifyComplete() {
    // Browser notification (requires permission)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('INNOQ Timer', {
        body: 'Timer has finished!',
        icon: '/vite.svg'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('INNOQ Timer', {
            body: 'Timer has finished!',
            icon: '/vite.svg'
          });
        }
      });
    }
  }
  
  showError(message) {
    // Simple error display - could be enhanced with proper UI
    console.error('Timer Error:', message);
    
    // Visual feedback on input
    this.timeInput.style.borderColor = '#ff267a';
    setTimeout(() => {
      this.timeInput.style.borderColor = '';
    }, 2000);
  }
}

// Initialize the timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new InnoqTimer();
});

// Handle browser refresh/close during active timer
window.addEventListener('beforeunload', (event) => {
  const timer = document.querySelector('.timer__display--running');
  if (timer) {
    event.preventDefault();
    return 'Timer is running. Are you sure you want to leave?';
  }
});