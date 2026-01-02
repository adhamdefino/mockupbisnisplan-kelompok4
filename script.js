const menuItems = [
  {
    name: 'Kopi Susu Strong',
    description: 'Kopi hitam + susu sedikit (rasa kopi dominan)',
    price: 15000,
    strength: 'strong',
    rating: 4.7,
    image: 'images/kopi-strong.jpg'
  },
  {
    name: 'Kopi Susu Medium',
    description: 'Seimbang antara kopi & susu',
    price: 13000,
    strength: 'medium',
    rating: 4.8,
    image: 'images/kopi-medium.jpg'
  },
  {
    name: 'Kopi Susu Soft',
    description: 'Lebih creamy, cocok pemula',
    price: 12000,
    strength: 'soft',
    rating: 4.6,
    image: 'images/kopi-soft.jpg'
  },
  {
    name: 'Kopi Susu Gula Aren',
    description: 'Manis alami dari gula aren pilihan',
    price: 14000,
    strength: 'medium',
    rating: 4.9,
    image: 'images/kopi-gula-aren.jpg'
  },
  {
    name: 'Kopi Susu Santai',
    description: 'Signature house blend, smooth & balance',
    price: 16000,
    strength: 'medium',
    rating: 4.8,
    image: 'images/kopi-santai.jpg'
  },
  {
    name: 'Kopi Custom',
    description: 'Buat kopi sesuai seleramu',
    price: 15000,
    strength: 'custom',
    rating: 5.0,
    image: 'images/kopi-custom.jpg',
    isCustom: true
  }
];

let cart = [];
let currentUser = null;

window.onload = () => {
  renderMenu();
  updateCart();
  renderRecommendations();
};

function renderMenu() {
  const grid = document.getElementById('menuGrid');

  grid.innerHTML = menuItems.map(item => `
    <div class="menu-card">

      <div class="menu-image">
        <img src="${item.image}" alt="${item.name}">
        <span class="strength-badge badge-${item.strength}">
          ${item.strength.toUpperCase()}
        </span>
      </div>

      <div class="menu-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>

        <div class="menu-meta">
          <span class="price">Rp ${item.price.toLocaleString('id-ID')}</span>
          <span class="rating">⭐ ${item.rating}</span>
        </div>
      </div>

      <div class="menu-action">
        ${
          item.isCustom
          ? `<button class="btn btn-primary" onclick="openCustomModal()">Custom</button>`
          : `<button class="btn btn-primary" onclick="addToCart('${item.name}', ${item.price})">Tambah</button>`
        }
      </div>

    </div>
  `).join('');
}


function showPage(page) {
  if (page === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
    alert('Akses ditolak');
    return;
  }

  ['home','menu','recommendation','auth','admin'].forEach(p => {
    document.getElementById(p + 'Page').classList.add('hidden');
  });

  document.getElementById(page + 'Page').classList.remove('hidden');
}

function login() {
  const email = document.querySelector('#loginForm input[type="email"]').value;
  const password = document.querySelector('#loginForm input[type="password"]').value;

  if (email === 'admin@kopisantai.com' && password === 'admin123') {
    currentUser = { role: 'admin', email };
    updateNavByRole();
    showPage('admin');
    alert('Login sebagai Admin');
    return;
  }

  if (email === 'user@kopisantai.com' && password === 'user123') {
    currentUser = { role: 'user', email };
    updateNavByRole();
    showPage('home');
    alert('Login sebagai Customer');
    return;
  }

  alert('Email atau password salah (demo)');
}


function logout() {
  currentUser = null;
  updateNavByRole();
  showPage('home');
}

function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
}

function updateCart() {
  document.getElementById('cartBadge').textContent = cart.length;

  const list = document.getElementById('cartItems');

  if (cart.length === 0) {
    list.innerHTML = `<p style="text-align:center;padding:2rem;">Keranjang masih kosong</p>`;
    document.getElementById('cartTotal').textContent = 'Rp 0';
    return;
  }

  list.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <div>Rp ${item.price.toLocaleString('id-ID')}</div>
      </div>
      <button class="cart-remove" onclick="removeFromCart(${i})">✕</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, i) => sum + i.price, 0);
  document.getElementById('cartTotal').textContent =
    'Rp ' + total.toLocaleString('id-ID');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function toggleCart() {
  document.getElementById('cartPanel').classList.toggle('active');
}

function checkout() {
  alert('Checkout berhasil!');
  cart = [];
  updateCart();
}

let custom = {
  level: 'Medium',
  sugar: 50,
  temp: 'Hot',
  qty: 1,
  basePrice: 15000
};

function openCustomModal() {
  resetCustom();
  document.getElementById('customModal').classList.add('active');
}

function closeCustomModal() {
  document.getElementById('customModal').classList.remove('active');
}

function resetCustom() {
  custom = { level:'Medium', sugar:50, temp:'Hot', qty:1, basePrice:15000 };
  updateCustomUI();
}

function updateCustomUI() {
  document.getElementById('qty').innerText = custom.qty;
  document.getElementById('sugarValue').innerText = custom.sugar;
  document.getElementById('customTotal').innerText =
    'Rp ' + (custom.qty * custom.basePrice).toLocaleString('id-ID');
}

function setLevel(lvl) {
  custom.level = lvl;
  document.querySelectorAll('.option-group.level button')
    .forEach(b => b.classList.toggle('active', b.dataset.value === lvl));
}

function setTemp(t) {
  custom.temp = t;
  document.querySelectorAll('.option-group.temp button')
    .forEach(b => b.classList.toggle('active', b.dataset.value === t));
}

function changeQty(n) {
  custom.qty = Math.max(1, custom.qty + n);
  updateCustomUI();
}

function addCustomToCart() {
  const note = document.getElementById('customNote').value.trim();

  cart.push({
    name: `Kopi Custom (${custom.level}, ${custom.sugar}% gula, ${custom.temp})`,
    price: custom.basePrice * custom.qty,
    note: note || '-'
  });

  updateCart();
  closeCustomModal();
}

let checkoutMethod = 'qris';

function openCheckout() {
  if (cart.length === 0) {
    alert('Keranjang masih kosong');
    return;
  }

  document.getElementById('checkoutTotal').innerText =
    'Rp ' + cart.reduce((s, i) => s + i.price, 0).toLocaleString('id-ID');

  document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('active');
}

function selectCheckoutPayment(el, method) {
  checkoutMethod = method;

  document.querySelectorAll('.payment-item').forEach(item => {
    item.classList.remove('active');
    item.querySelector('input[type="radio"]').checked = false;
  });

  el.classList.add('active');
  el.querySelector('input[type="radio"]').checked = true;

  document.getElementById('checkoutQR').style.display =
    method === 'qris' ? 'block' : 'none';
}


function confirmCheckout() {
  alert(
    checkoutMethod === 'qris'
      ? 'Silakan selesaikan pembayaran via QRIS'
      : 'Pesanan dicatat, bayar tunai saat diterima'
  );

  cart = [];
  updateCart();
  closeCheckout();
  toggleCart();
}

const moodRecommendations = [
  {
    mood: 'Happy & Chill',
    subtitle: 'Lagi senang dan ingin bersantai',
    emoji: '😊',
    product: {
      name: 'Kopi Susu Soft',
      desc: 'Lebih creamy, cocok pemula',
      price: 12000,
      image: 'images/kopi-soft.jpg'
    },
    reason: 'Rasa creamy yang smooth cocok untuk menemani momen santaimu'
  },
  {
    mood: 'Need Energy',
    subtitle: 'Butuh dorongan semangat',
    emoji: '💪',
    product: {
      name: 'Kopi Susu Strong',
      desc: 'Kopi hitam + susu sedikit',
      price: 15000,
      image: 'images/kopi-strong.jpg'
    },
    reason: 'Rasa kopi yang kuat memberi energi ekstra'
  },
  {
    mood: 'Zen & Focus',
    subtitle: 'Ingin fokus dan tenang',
    emoji: '🧘‍♂️',
    product: {
      name: 'Kopi Susu Santai',
      desc: 'Signature house blend, smooth',
      price: 16000,
      image: 'images/kopi-santai.jpg'
    },
    reason: 'Rasa balanced cocok untuk bekerja atau meditasi'
  },
  {
    mood: 'Sweet Mood',
    subtitle: 'Ingin sesuatu yang manis',
    emoji: '❤️',
    product: {
      name: 'Kopi Susu Gula Aren',
      desc: 'Manis alami, favorit lokal',
      price: 14000,
      image: 'images/kopi-gula-aren.jpg'
    },
    reason: 'Gula aren memberi rasa manis alami yang menenangkan'
  },
  {
    mood: 'Balanced',
    subtitle: 'Ingin yang seimbang',
    emoji: '🎯',
    product: {
      name: 'Kopi Susu Medium',
      desc: 'Seimbang antara kopi & susu',
      price: 13000,
      image: 'images/kopi-medium.jpg'
    },
    reason: 'Perpaduan kopi & susu paling aman untuk semua mood'
  }
];

function renderRecommendations() {
  const grid = document.getElementById('moodGrid');

  grid.innerHTML = moodRecommendations.map(m => `
    <div class="mood-card">

      <div class="mood-header">
        <span class="mood-icon">${m.emoji}</span>
        <div>
          <h3>${m.mood}</h3>
          <p>${m.subtitle}</p>
        </div>
      </div>

      <div class="recommend-item">
        <strong>❤️ Kami Rekomendasikan:</strong>

        <div class="recommend-product">
          <img src="${m.product.image}" alt="${m.product.name}">
          <div>
            <h4>${m.product.name}</h4>
            <p>${m.product.desc}</p>
            <span class="price">
              Rp ${m.product.price.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div class="recommend-reason">
          <strong>☕️</strong> ${m.reason}
        </div>

        <button class="btn btn-primary"
          onclick="addToCart('${m.product.name}', ${m.product.price})">
          Tambah ke Keranjang
        </button>
      </div>

    </div>
  `).join('');
}

function updateNavByRole() {
  const isAdmin = currentUser && currentUser.role === 'admin';

  document.getElementById('navMenu').classList.toggle('hidden', isAdmin);
  document.getElementById('navRecommendation').classList.toggle('hidden', isAdmin);
  document.getElementById('navCart').classList.toggle('hidden', isAdmin);

  document.getElementById('navDashboard').classList.toggle('hidden', !isAdmin);
  document.getElementById('navStock').classList.toggle('hidden', !isAdmin);

  document.getElementById('navUser').classList.toggle('hidden', !!currentUser);
  document.getElementById('navLogout').classList.toggle('hidden', !currentUser);
}

function switchTab(tab) {
  const tabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  tabs.forEach(t => t.classList.remove('active'));

  if (tab === 'login') {
    tabs[0].classList.add('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    tabs[1].classList.add('active');
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  }
}
