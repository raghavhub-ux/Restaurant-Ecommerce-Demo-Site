// ==========================================
// TABLE RESERVATION & JSON STORAGE
// The Saffron Plate - 100% Pure Vegetarian
// ==========================================

const STORAGE_KEY = 'saffron_reservations';

// Set minimum date to today
const dateInput = document.getElementById('date');
if (dateInput) {
  dateInput.min = new Date().toISOString().split('T')[0];
}

// Retrieve saved reservations
function getReservations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (err) {
    return [];
  }
}

// Save reservations
function saveReservations(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list, null, 2));
  updateCount();
}

// Download JSON file
function downloadJson(data, filename = 'reservations.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

// Update count badge
function updateCount() {
  const el = document.getElementById('res-count');
  if (!el) return;
  const count = getReservations().length;
  el.textContent = `${count} reservation${count !== 1 ? 's' : ''} saved`;
}

updateCount();

// Form submit event handler
const form = document.querySelector('.res-form');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameEl = document.getElementById('name');
    const phoneEl = document.getElementById('phone');
    const guestsEl = document.getElementById('guests');
    const timeEl = document.getElementById('time');
    const seatingEl = document.getElementById('seating');
    const occasionEl = document.getElementById('occasion');

    const name = nameEl ? nameEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const guests = guestsEl ? guestsEl.value : '2 Guests (Intimate Table)';
    const date = dateInput ? dateInput.value : '';
    const time = timeEl ? timeEl.value : '08:30 PM (Prime Dinner)';
    const seating = seatingEl ? seatingEl.value : 'All Seating Areas';
    const occasion = occasionEl ? occasionEl.value : 'Standard Fine Dining';

    // Clear previous errors
    const oldMsg = form.querySelector('.form-msg');
    if (oldMsg) oldMsg.remove();
    [nameEl, phoneEl, dateInput].forEach(el => el && el.classList.remove('input-error'));

    const msg = document.createElement('div');

    // Validation
    if (!name || name.length < 2) {
      msg.className = 'form-msg error';
      msg.textContent = 'Please enter a valid guest name.';
      if (nameEl) nameEl.classList.add('input-error');
      form.appendChild(msg);
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      msg.className = 'form-msg error';
      msg.textContent = 'Please enter a valid 10-digit phone number.';
      if (phoneEl) phoneEl.classList.add('input-error');
      form.appendChild(msg);
      return;
    }

    if (!date) {
      msg.className = 'form-msg error';
      msg.textContent = 'Please select a reservation date.';
      if (dateInput) dateInput.classList.add('input-error');
      form.appendChild(msg);
      return;
    }

    // Reservation record
    const record = {
      id: `RES-${Date.now()}`,
      name,
      phone,
      guests,
      date,
      time,
      seatingSpace: seating,
      diningOccasion: occasion,
      submittedAt: new Date().toLocaleString()
    };

    const all = getReservations();
    all.push(record);
    saveReservations(all);

    // Auto download JSON
    downloadJson(all, 'reservations.json');

    // Display confirmation
    msg.className = 'form-msg success';
    msg.innerHTML = `<strong>Table Reserved Successfully!</strong><br>Reserved for ${guests} in <em>${seating}</em> on ${date} at ${time}. (${occasion}). Saved to reservations.json!`;
    form.appendChild(msg);
    form.reset();
  });
}

// Manual JSON export button
const exportBtn = document.getElementById('export-res-json');
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    const list = getReservations();
    const oldMsg = form ? form.querySelector('.form-msg') : null;
    if (oldMsg) oldMsg.remove();

    const msg = document.createElement('div');
    if (!list.length) {
      msg.className = 'form-msg error';
      msg.textContent = 'No reservations saved yet to export.';
    } else {
      downloadJson(list, 'reservations.json');
      msg.className = 'form-msg success';
      msg.textContent = `Downloaded reservations.json with ${list.length} saved record${list.length !== 1 ? 's' : ''}.`;
    }
    if (form) form.appendChild(msg);
  });
}
