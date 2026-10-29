// The Saffron Plate - Order Online & Cart System
const MENU_ITEMS = [
  { id: "thali-01", name: "Maharaja Indian Thali", category: "royal-classics", price: 280, tags: ["chef", "jain"], image: "images/indian_thali.jpg", badge: "Royal Banquet", description: "Paneer butter masala, dal makhani, jeera pulao, butter naan, gulab jamun & sweet lassi." },
  { id: "chaap-02", name: "Malai Chaap", category: "royal-classics", price: 180, tags: ["mild"], image: "images/malai_chaap.jpg", badge: "Tandoor Special", description: "Char-grilled soya skewers marinated in clotted cream, cashew paste, and green cardamom." },
  { id: "chole-03", name: "Chole Bhature", category: "royal-classics", price: 120, tags: ["spicy"], image: "images/chole_bhature.jpg", badge: "Old Delhi Heritage", description: "Puffed bhature served with slow-simmered dark chana masala, pickle, and ginger." },
  { id: "golgappe-04", name: "Golgappe", category: "street-specials", price: 80, tags: ["spicy", "jain"], image: "images/golgappe.jpg", badge: "Street Artisan", description: "Crisp semolina puris with spiced potato sprouts, date chutney & chilled digestive mint water." },
  { id: "momos-05", name: "Steamed Vegetable Momos", category: "street-specials", price: 110, tags: ["spicy"], image: "images/momos.jpg", badge: "Himalayan Classic", description: "Thin-skinned dumplings packed with garden greens, served with roasted tomato dip." },
  { id: "hakka-06", name: "Wok-Tossed Hakka Noodles", category: "asian-gourmet", price: 150, tags: ["chef"], image: "images/hakka_noodles.jpg", badge: "Gourmet Asian", description: "Wheat noodles tossed over high flame with crunchy bell peppers, garlic & pure sesame oil." },
  { id: "ramen-07", name: "Artisan Vegetarian Ramen", category: "asian-gourmet", price: 190, tags: ["chef"], image: "images/ramen.jpg", badge: "Signature Bowl", description: "Miso-shiitake broth with hand-pulled noodles, braised tofu, bok choy, and mushrooms." },
  { id: "dosa-08", name: "Mysore Masala Dosa", category: "south-indian", price: 135, tags: ["spicy", "jain"], image: "images/masala_dosa.jpg", badge: "Crispy Delight", description: "Fermented crepe layered with spicy chutney and potato mash, served with sambar." },
  { id: "gulab-09", name: "Shahi Gulab Jamun", category: "desserts", price: 70, tags: ["mild", "jain"], image: "images/gulab_jamun.jpg", badge: "Sweet Legacy", description: "Golden khoya dumplings in pure desi ghee, soaked in warm Kashmiri saffron rose syrup." },
  { id: "rasmalai-10", name: "Kesar Pista Rasmalai", category: "desserts", price: 90, tags: ["mild", "jain"], image: "images/rasmalai.jpg", badge: "Royal Sweet", description: "Cottage cheese patties in thickened saffron milk, garnished with Persian pistachios." },
  { id: "sundae-11", name: "Belgian Hot Fudge Sundae", category: "desserts", price: 140, tags: ["mild"], image: "images/sundae.jpg", badge: "Lounge Dessert", description: "Vanilla bean gelato drenched in warm 70% dark Belgian cocoa fudge and roasted almonds." },
  { id: "shake-12", name: "Strawberry Milkshake", category: "beverages", price: 130, tags: ["mild", "jain"], image: "images/strawberry_shake.jpg", badge: "Chilled Sip", description: "Fresh farm strawberry puree churned with organic milk and fresh cream crown." }
];

let cart = [];
let activeCategory = "all";
let activeDietTag = null;
let searchQuery = "";
let discountAmount = 0;

function loadCart() {
  try { cart = JSON.parse(localStorage.getItem('saffron_cart') || '[]'); }
  catch (e) { cart = []; }
}

function saveCart() {
  localStorage.setItem('saffron_cart', JSON.stringify(cart));
}

function downloadJsonFile(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

function showToast(msg) {
  const toast = document.getElementById("toast-notify");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2200);
}

function renderMenu() {
  const grid = document.getElementById("menu-items-grid");
  const noRes = document.getElementById("no-results-box");
  const countEl = document.getElementById("results-count");
  if (!grid) return;

  const filtered = MENU_ITEMS.filter(item => {
    const matchCat = activeCategory === "all" || item.category === activeCategory;
    const matchTag = !activeDietTag || item.tags.includes(activeDietTag);
    const matchSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery) || 
      item.description.toLowerCase().includes(searchQuery);
    return matchCat && matchTag && matchSearch;
  });

  if (countEl) countEl.textContent = `${filtered.length} Items`;

  if (filtered.length === 0) {
    grid.innerHTML = "";
    if (noRes) noRes.hidden = false;
    return;
  }
  if (noRes) noRes.hidden = true;

  grid.innerHTML = filtered.map(item => {
    const inCart = cart.find(c => c.id === item.id);
    const qty = inCart ? inCart.quantity : 0;
    return `
      <article class="food-card" data-id="${item.id}">
        <div class="card-media">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          <span class="card-badge">${item.badge}</span>
        </div>
        <div class="card-body">
          <div class="card-title-row">
            <h3>${item.name}</h3>
            <span class="card-price">₹${item.price}</span>
          </div>
          <p class="card-desc">${item.description}</p>
          <div class="card-actions">
            ${qty > 0 ? `
              <div class="qty-pill">
                <button class="qty-btn" onclick="updateItemQty('${item.id}', -1)">−</button>
                <span>${qty}</span>
                <button class="qty-btn" onclick="updateItemQty('${item.id}', 1)">+</button>
              </div>
            ` : `
              <button class="btn outline add-btn" onclick="addToCart('${item.id}')">ADD TO CART</button>
            `}
          </div>
        </div>
      </article>
    `;
  }).join("");
}

window.addToCart = function(id) {
  const item = MENU_ITEMS.find(m => m.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) { existing.quantity++; }
  else { cart.push({ ...item, quantity: 1 }); }
  saveCart();
  renderCart();
  renderMenu();
  showToast(`Added ${item.name} to cart`);
};

window.updateItemQty = function(id, delta) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx === -1) return;
  cart[idx].quantity += delta;
  if (cart[idx].quantity <= 0) cart.splice(idx, 1);
  saveCart();
  renderCart();
  renderMenu();
};

window.removeCartItem = function(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
  renderMenu();
};

function renderCart() {
  const listEl = document.getElementById("cart-items-list");
  const emptyEl = document.getElementById("cart-empty-state");
  const subtotalEl = document.getElementById("bill-subtotal");
  const deliveryEl = document.getElementById("bill-delivery");
  const taxEl = document.getElementById("bill-tax");
  const totalEl = document.getElementById("bill-total");
  const counterEl = document.getElementById("cart-counter");
  const quickTotalEl = document.getElementById("cart-quick-total");
  const summarySub = document.getElementById("cart-summary-subtitle");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = totalItems > 0 ? 40 : 0;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = Math.max(0, subtotal - discountAmount + delivery + tax);

  if (counterEl) counterEl.textContent = totalItems;
  if (quickTotalEl) quickTotalEl.textContent = `₹${grandTotal}`;
  if (summarySub) summarySub.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''} selected`;

  if (totalItems === 0) {
    if (emptyEl) emptyEl.hidden = false;
    if (listEl) listEl.innerHTML = "";
  } else {
    if (emptyEl) emptyEl.hidden = true;
    if (listEl) {
      listEl.innerHTML = cart.map(item => `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <span class="cart-item-price">₹${item.price} each</span>
            <div class="qty-pill">
              <button class="qty-btn" onclick="updateItemQty('${item.id}', -1)">−</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" onclick="updateItemQty('${item.id}', 1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeCartItem('${item.id}')" title="Remove">&times;</button>
        </div>
      `).join("");
    }
  }

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (deliveryEl) deliveryEl.textContent = `₹${delivery}`;
  if (taxEl) taxEl.textContent = `₹${tax}`;
  if (totalEl) totalEl.textContent = `₹${grandTotal}`;

  const payModalTotal = document.getElementById("modal-payable-amount");
  if (payModalTotal) payModalTotal.textContent = `₹${grandTotal}`;
}

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderMenu();
  renderCart();

  // Search
  const searchInput = document.getElementById("menu-search-input");
  const clearBtn = document.getElementById("search-clear-btn");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderMenu();
    });
  }
  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchQuery = "";
      renderMenu();
    });
  }

  // Categories
  document.querySelectorAll(".cat-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.category || "all";
      const title = document.getElementById("current-category-title");
      if (title) title.textContent = btn.textContent;
      renderMenu();
    });
  });

  // Dietary tags
  document.querySelectorAll(".diet-tag").forEach(tag => {
    tag.addEventListener("click", () => {
      if (activeDietTag === tag.dataset.tag) {
        tag.classList.remove("active");
        activeDietTag = null;
      } else {
        document.querySelectorAll(".diet-tag").forEach(t => t.classList.remove("active"));
        tag.classList.add("active");
        activeDietTag = tag.dataset.tag;
      }
      renderMenu();
    });
  });

  // Drawer
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("cart-backdrop");
  const openCartBtn = document.getElementById("open-cart-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");

  const toggleCart = (open) => {
    if (drawer) drawer.classList.toggle("open", open);
    if (backdrop) backdrop.classList.toggle("open", open);
  };

  if (openCartBtn) openCartBtn.addEventListener("click", () => toggleCart(true));
  if (closeCartBtn) closeCartBtn.addEventListener("click", () => toggleCart(false));
  if (backdrop) backdrop.addEventListener("click", () => toggleCart(false));

  // Promo code
  const applyPromoBtn = document.getElementById("apply-promo-btn");
  const promoInput = document.getElementById("promo-code-input");
  const promoMsg = document.getElementById("promo-feedback-msg");
  const rowDiscount = document.getElementById("row-discount");
  const billDiscount = document.getElementById("bill-discount");

  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener("click", () => {
      const code = promoInput.value.trim().toUpperCase();
      const subtotal = cart.reduce((sum, it) => sum + (it.price * it.quantity), 0);
      if (code === "SAFFRON20" || code === "ROYAL10") {
        const pct = code === "SAFFRON20" ? 0.20 : 0.10;
        discountAmount = Math.round(subtotal * pct);
        if (rowDiscount) rowDiscount.hidden = false;
        if (billDiscount) billDiscount.textContent = `-₹${discountAmount}`;
        if (promoMsg) {
          promoMsg.style.color = "var(--gold)";
          promoMsg.textContent = `Promo ${code} applied successfully!`;
        }
      } else {
        discountAmount = 0;
        if (rowDiscount) rowDiscount.hidden = true;
        if (promoMsg) {
          promoMsg.style.color = "#f87171";
          promoMsg.textContent = "Invalid promo code. Try SAFFRON20";
        }
      }
      renderCart();
    });
  }

  // Checkout modal
  const checkoutModal = document.getElementById("checkout-modal");
  const proceedBtn = document.getElementById("proceed-checkout-btn");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const checkoutForm = document.getElementById("checkout-form");
  const successModal = document.getElementById("order-success-modal");

  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
      }
      toggleCart(false);
      if (checkoutModal) checkoutModal.showModal();
    });
  }

  if (closeModalBtn && checkoutModal) {
    closeModalBtn.addEventListener("click", () => checkoutModal.close());
  }

  // Order submission
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("cust-name")?.value.trim() || "";
      const phone = document.getElementById("cust-phone")?.value.trim() || "";
      const address = document.getElementById("cust-address")?.value.trim() || "";
      const time = document.getElementById("cust-time")?.value || "Immediate";
      const notes = document.getElementById("order-notes")?.value.trim() || "";

      if (!name || phone.replace(/\D/g, "").length < 10 || !address) {
        alert("Please enter a valid name, 10-digit phone number, and address.");
        return;
      }

      const orderRef = "SP-" + Math.floor(10000 + Math.random() * 90000);
      const subtotal = cart.reduce((s, it) => s + (it.price * it.quantity), 0);
      const tax = Math.round(subtotal * 0.05);
      const total = Math.max(0, subtotal - discountAmount + 40 + tax);

      const orderData = {
        orderId: `#${orderRef}`,
        placedAt: new Date().toLocaleString(),
        customer: { name, phone, address, deliverySlot: time },
        items: [...cart],
        bill: { subtotal: `₹${subtotal}`, discount: `₹${discountAmount}`, deliveryFee: "₹40", taxGst: `₹${tax}`, totalPaid: `₹${total}` },
        notes
      };

      try {
        const orders = JSON.parse(localStorage.getItem("saffron_orders") || "[]");
        orders.push(orderData);
        localStorage.setItem("saffron_orders", JSON.stringify(orders, null, 2));
      } catch (err) {
        console.error("Order save error:", err);
      }

      downloadJsonFile(orderData, `order_${orderRef}.json`);

      cart = [];
      discountAmount = 0;
      saveCart();
      renderCart();
      renderMenu();

      if (checkoutModal) checkoutModal.close();

      const refCodeEl = document.getElementById("order-ref-code");
      const confNameEl = document.getElementById("confirmed-name");
      const confAddrEl = document.getElementById("confirmed-address");
      const confTotalEl = document.getElementById("confirmed-total");

      if (refCodeEl) refCodeEl.textContent = `#${orderRef}`;
      if (confNameEl) confNameEl.textContent = name;
      if (confAddrEl) confAddrEl.textContent = address;
      if (confTotalEl) confTotalEl.textContent = `₹${total}`;

      if (successModal) successModal.showModal();
    });
  }

  const contBtn = document.getElementById("continue-shopping-btn");
  if (contBtn && successModal) {
    contBtn.addEventListener("click", () => successModal.close());
  }

  const exportBtn = document.getElementById("export-orders-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const orders = JSON.parse(localStorage.getItem("saffron_orders") || "[]");
      if (orders.length === 0) alert("No orders placed yet to export.");
      else downloadJsonFile(orders, "saffron_orders.json");
    });
  }
});
