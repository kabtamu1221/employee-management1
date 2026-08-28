const API_URL = 'http://localhost:5000/api';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formTitle = document.getElementById('formTitle');
const toggleText = document.getElementById('toggleText');
const toggleLink = document.getElementById('toggleLink');
const messageDiv = document.getElementById('message');

let isLogin = true;

// Toggle Login / Register
toggleLink.addEventListener('click', () => {
  isLogin = !isLogin;
  if (isLogin) {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    formTitle.textContent = 'Login';
    toggleText.textContent = "Don't have an account?";
    toggleLink.textContent = 'Register';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    formTitle.textContent = 'Register';
    toggleText.textContent = 'Already have an account?';
    toggleLink.textContent = 'Login';
  }
  messageDiv.style.display = 'none';
});

// Show message
function showMessage(text, isError = true) {
  messageDiv.textContent = text;
  messageDiv.className = isError ? 'error' : 'success';
  messageDiv.style.display = 'block';
}

// ========== LOGIN ==========
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.message || 'Login failed');
      return;
    }

    // Save token and user
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Go to dashboard
    window.location.href = 'dashboard.html';
  } catch (err) {
    console.error(err);
    showMessage('Cannot connect to server. Make sure backend is running on port 5000.');
  }
});

// ========== REGISTER ==========
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.message || 'Registration failed');
      return;
    }

    showMessage(data.message, false);

    // Switch to login after success
    setTimeout(() => {
      isLogin = true;
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      formTitle.textContent = 'Login';
      toggleText.textContent = "Don't have an account?";
      toggleLink.textContent = 'Register';
      messageDiv.style.display = 'none';
      document.getElementById('loginUsername').value = username;
    }, 1500);

  } catch (err) {
    console.error(err);
    showMessage('Cannot connect to server. Make sure backend is running on port 5000.');
  }
});