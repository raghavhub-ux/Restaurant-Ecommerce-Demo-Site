// ==========================================
// TEAM MEMBER PREVIEW POPUP INTERACTION
// The Saffron Plate - 100% Pure Vegetarian
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.team-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const nameEl = card.querySelector('h3');
      const roleEl = card.querySelector('p');

      const name = nameEl ? nameEl.textContent : 'Team Member';
      const role = roleEl ? roleEl.textContent : 'Contributor';
      const imgSrc = img ? img.src : '';

      // Create modal overlay
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-content team-modal-content">
          <button class="modal-close-btn" aria-label="Close modal">&times;</button>
          <div class="team-modal-img-wrap">
            <img src="${imgSrc}" alt="${name}">
          </div>
          <h3>${name}</h3>
          <p class="modal-role">${role}</p>
        </div>
      `;

      // Close modal handler
      function closeModal() {
        document.removeEventListener('keydown', handleKeydown);
        modal.remove();
      }

      function handleKeydown(e) {
        if (e.key === 'Escape') closeModal();
      }

      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeModal();
        });
      }

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      document.addEventListener('keydown', handleKeydown);
      document.body.appendChild(modal);
    });
  });
});