// ==========================================
// USER AUTHENTICATION & SESSION JSON STORAGE
// The Saffron Plate - 100% Pure Vegetarian
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.auth-form');

  // Helper to download JSON
  function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  }

  // Check if already signed in
  const currentUser = localStorage.getItem('saffron_current_user');
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser);
      const card = document.querySelector('.auth-card');
      if (card && user.email) {
        const welcomeBadge = document.createElement('div');
        welcomeBadge.className = 'form-msg success';
        welcomeBadge.style.marginBottom = '20px';
        welcomeBadge.innerHTML = `Currently signed in as <strong>${user.email}</strong>. <a href="#" id="auth-signout" style="text-decoration: underline; margin-left: 8px; color: var(--gold);">Sign Out</a>`;
        card.insertBefore(welcomeBadge, form);

        document.getElementById('auth-signout')?.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('saffron_current_user');
          window.location.reload();
        });
      }
    } catch (e) {}
  }

  // Sign In form submit handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailEl = document.getElementById('email');
      const passEl = document.getElementById('password');

      const email = emailEl ? emailEl.value.trim() : '';
      const password = passEl ? passEl.value.trim() : '';

      // Clear previous error messages
      const oldMsg = form.querySelector('.form-msg');
      if (oldMsg) oldMsg.remove();
      [emailEl, passEl].forEach(el => el && el.classList.remove('input-error'));

      const status = document.createElement('div');

      // Validation
      if (!email || !password) {
        status.className = 'form-msg error';
        status.textContent = 'Please provide both your email and password.';
        if (!email && emailEl) emailEl.classList.add('input-error');
        if (!password && passEl) passEl.classList.add('input-error');
        form.appendChild(status);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.className = 'form-msg error';
        status.textContent = 'Please enter a valid email address.';
        if (emailEl) emailEl.classList.add('input-error');
        form.appendChild(status);
        return;
      }

      if (password.length < 6) {
        status.className = 'form-msg error';
        status.textContent = 'Password must be at least 6 characters long.';
        if (passEl) passEl.classList.add('input-error');
        form.appendChild(status);
        return;
      }

      // Save user session
      const sessionData = {
        email,
        role: 'Royal Patron Member',
        loggedInAt: new Date().toLocaleString()
      };

      localStorage.setItem('saffron_current_user', JSON.stringify(sessionData));

      // Save user to registered users list
      try {
        const users = JSON.parse(localStorage.getItem('saffron_users') || '[]');
        if (!users.some(u => u.email === email)) {
          users.push(sessionData);
          localStorage.setItem('saffron_users', JSON.stringify(users, null, 2));
        }
      } catch (e) {}

      // Download user session JSON file
      downloadJson(sessionData, 'user_session.json');

      status.className = 'form-msg success';
      status.innerHTML = `<strong>Welcome back!</strong><br>Successfully signed in as <code>${email}</code>. Downloaded user_session.json!`;
      form.appendChild(status);

      setTimeout(() => {
        form.reset();
      }, 1500);
    });
  }

  // Export User Session button
  const exportBtn = document.getElementById('export-user-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const savedUser = localStorage.getItem('saffron_current_user');
      if (!savedUser) {
        alert('No active session found. Please sign in first.');
      } else {
        downloadJson(JSON.parse(savedUser), 'user_session.json');
      }
    });
  }
});