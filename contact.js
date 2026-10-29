// ==========================================
// CONTACT INQUIRIES & JSON STORAGE
// ==========================================

const STORAGE_KEY = 'saffron_contacts';

function getContacts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (err) {
    return [];
  }
}

function saveContacts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list, null, 2));
  updateCount();
}

function downloadJson(data, filename = 'contacts.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

function updateCount() {
  const el = document.getElementById('contact-count');
  if (!el) return;
  const count = getContacts().length;
  el.textContent = `${count} inquir${count !== 1 ? 'ies' : 'y'} saved`;
}

updateCount();

const form = document.querySelector('.contact-form');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameEl = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    const subjectEl = document.getElementById('contact-subject');
    const msgEl = document.getElementById('contact-message');

    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const subject = subjectEl ? subjectEl.value.trim() || 'General Inquiry' : 'General Inquiry';
    const message = msgEl ? msgEl.value.trim() : '';

    const oldMsg = form.querySelector('.form-msg');
    if (oldMsg) oldMsg.remove();
    [nameEl, emailEl, msgEl].forEach(el => el && el.classList.remove('input-error'));

    const status = document.createElement('div');

    if (!name || !email || !message) {
      status.className = 'form-msg error';
      status.textContent = 'Please fill out your Name, Email Address, and Message.';
      if (!name && nameEl) nameEl.classList.add('input-error');
      if (!email && emailEl) emailEl.classList.add('input-error');
      if (!message && msgEl) msgEl.classList.add('input-error');
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

    const record = {
      id: `CNT-${Date.now()}`,
      name,
      email,
      subject,
      message,
      submittedAt: new Date().toLocaleString()
    };

    const all = getContacts();
    all.push(record);
    saveContacts(all);
    downloadJson(all, 'contacts.json');

    status.className = 'form-msg success';
    status.innerHTML = `<strong>Message Sent!</strong><br>Thank you, ${name}. Your message has been saved to contacts.json and our team will get back to you shortly.`;
    form.appendChild(status);
    form.reset();
  });
}

const exportBtn = document.getElementById('export-contact-json');
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    const list = getContacts();
    const oldMsg = form ? form.querySelector('.form-msg') : null;
    if (oldMsg) oldMsg.remove();

    const status = document.createElement('div');
    if (!list.length) {
      status.className = 'form-msg error';
      status.textContent = 'No inquiries saved yet to export.';
    } else {
      downloadJson(list, 'contacts.json');
      status.className = 'form-msg success';
      status.textContent = `Downloaded contacts.json with ${list.length} saved inquir${list.length !== 1 ? 'ies' : 'y'}.`;
    }
    if (form) form.appendChild(status);
  });
}