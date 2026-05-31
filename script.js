document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================
    // 1. THEME TOGGLE (DARK / LIGHT MODE)
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
    });

    // ==========================================
    // 2. HEADER SCROLL EFFECT
    // ==========================================
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 3. DRAWERS & MODALS TOGGLERS
    // ==========================================
    // Cart Drawer Elements
    const cartBtn = document.getElementById('cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');

    // Login Modal Elements
    const userBtn = document.getElementById('user-btn');
    const loginModal = document.getElementById('login-modal');
    const loginClose = document.getElementById('login-close');
    const loginOverlay = document.getElementById('login-overlay');
    const switchToSignup = document.getElementById('switch-to-signup');
    const loginForm = document.getElementById('login-form');

    // Toggle Drawer Helper
    function toggleDrawer(drawer, open = true) {
        if (open) {
            drawer.classList.add('open');
            drawer.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevents background scrolling
        } else {
            drawer.classList.remove('open');
            drawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    // Toggle Modal Helper
    function toggleModal(modal, open = true) {
        if (open) {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        } else {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    // Cart Events
    cartBtn.addEventListener('click', () => toggleDrawer(cartDrawer, true));
    cartClose.addEventListener('click', () => toggleDrawer(cartDrawer, false));
    cartOverlay.addEventListener('click', () => toggleDrawer(cartDrawer, false));

    // User Modal Events
    userBtn.addEventListener('click', () => toggleModal(loginModal, true));
    loginClose.addEventListener('click', () => toggleModal(loginModal, false));
    loginOverlay.addEventListener('click', () => toggleModal(loginModal, false));

    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        const headerTitle = loginModal.querySelector('.modal-header h3');
        const headerSubtitle = loginModal.querySelector('.modal-header p');
        const submitBtn = document.getElementById('btn-submit-login');
        
        if (submitBtn.textContent === 'Entrar') {
            headerTitle.textContent = 'Crear Cuenta';
            headerSubtitle.textContent = 'Regístrate en Nebula Tech y disfruta de beneficios exclusivos';
            submitBtn.textContent = 'Registrarse';
            switchToSignup.textContent = 'Iniciar Sesión';
        } else {
            headerTitle.textContent = 'Iniciar Sesión';
            headerSubtitle.textContent = 'Accede a tu cuenta de Nebula Tech';
            submitBtn.textContent = 'Entrar';
            switchToSignup.textContent = 'Crear cuenta';
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        if (email) {
            alert(`¡Bienvenido a Nebula Tech! Has iniciado sesión como ${email}`);
            toggleModal(loginModal, false);
            loginForm.reset();
        }
    });

    // ==========================================
    // 4. SHOPPING CART FUNCTIONALITY
    // ==========================================
    let cart = [];

    // Load Cart from localStorage
    const savedCart = localStorage.getItem('nebula_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartUI();
        } catch (e) {
            cart = [];
        }
    }

    // Add To Cart Event
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
            // Generate standard image path matching cards
            let img = 'assets/laptop.webp';
            if (id === '2') img = 'assets/vr.webp';
            if (id === '3') img = 'assets/earbuds.webp';
            if (id === '4') img = 'assets/watch.webp';

            addToCart(id, name, price, img);
            
            // Add subtle click animation/scale to the button
            button.style.transform = 'scale(0.85)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
    });

    function addToCart(id, name, price, img) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ id, name, price, img, qty: 1 });
        }
        
        saveCart();
        updateCartUI();
        
        // Auto open cart drawer to display the added item
        toggleDrawer(cartDrawer, true);
    }

    function saveCart() {
        localStorage.setItem('nebula_cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const emptyCartMsg = document.getElementById('empty-cart-message');
        const cartItemsList = document.getElementById('cart-items-list');
        const cartFooter = document.getElementById('cart-footer');
        const totalPriceEl = document.getElementById('cart-total-price');
        
        // Update badge count
        const totalItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);
        cartCount.textContent = totalItemsCount;
        
        // Badge animation
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCount.style.transform = '';
        }, 200);

        if (cart.length === 0) {
            emptyCartMsg.classList.remove('hidden');
            cartItemsList.classList.add('hidden');
            cartFooter.classList.add('hidden');
        } else {
            emptyCartMsg.classList.add('hidden');
            cartItemsList.classList.remove('hidden');
            cartFooter.classList.remove('hidden');
            
            // Render Items
            cartItemsList.innerHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                total += item.price * item.qty;
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                itemEl.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=100&q=80'">
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                        <div class="cart-item-controls">
                            <button class="cart-qty-btn decrease" data-id="${item.id}">-</button>
                            <span class="cart-item-qty">${item.qty}</span>
                            <button class="cart-qty-btn increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="btn-remove-item" data-id="${item.id}" aria-label="Eliminar item">
                        <i data-lucide="trash-2"></i>
                    </button>
                `;
                cartItemsList.appendChild(itemEl);
            });
            
            // Format total price
            totalPriceEl.textContent = `$${total.toFixed(2)}`;
            lucide.createIcons(); // Load icons in dynamically created items
            
            // Add listeners to new items
            addCartControlsListeners();
        }
    }

    function addCartControlsListeners() {
        // Increase Button
        document.querySelectorAll('.cart-qty-btn.increase').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item) {
                    item.qty += 1;
                    saveCart();
                    updateCartUI();
                }
            });
        });

        // Decrease Button
        document.querySelectorAll('.cart-qty-btn.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item) {
                    item.qty -= 1;
                    if (item.qty <= 0) {
                        cart = cart.filter(i => i.id !== id);
                    }
                    saveCart();
                    updateCartUI();
                }
            });
        });

        // Trash/Remove Button
        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                cart = cart.filter(i => i.id !== id);
                saveCart();
                updateCartUI();
            });
        });
    }

    // Checkout Button Click
    const checkoutBtn = document.getElementById('btn-checkout');
    checkoutBtn.addEventListener('click', () => {
        alert('¡Gracias por tu simulación de compra! En un entorno real, te redirigiríamos a la pasarela de pago.');
        cart = [];
        saveCart();
        updateCartUI();
        toggleDrawer(cartDrawer, false);
    });

    // ==========================================
    // 5. CONTACT FORM VALIDATION (Prompt 4)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formSuccessAlert = document.getElementById('form-success');
    const btnResetForm = document.getElementById('btn-reset-form');

    // Live validation listener for cleaner UX
    const formFields = [
        { el: document.getElementById('form-name'), validator: val => val.trim().length >= 3 },
        { el: document.getElementById('form-email'), validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) },
        { el: document.getElementById('form-message'), validator: val => val.trim().length >= 10 }
    ];

    formFields.forEach(field => {
        field.el.addEventListener('input', () => {
            const group = field.el.closest('.form-group');
            if (field.validator(field.el.value)) {
                group.classList.remove('invalid');
            }
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;

        formFields.forEach(field => {
            const group = field.el.closest('.form-group');
            const isValid = field.validator(field.el.value);
            
            if (!isValid) {
                group.classList.add('invalid');
                isFormValid = false;
            } else {
                group.classList.remove('invalid');
            }
        });

        if (isFormValid) {
            // Hide Form and Show Success Alert
            contactForm.classList.add('hidden');
            formSuccessAlert.classList.remove('hidden');
        }
    });

    // Reset Form Event
    btnResetForm.addEventListener('click', () => {
        contactForm.reset();
        formSuccessAlert.classList.add('hidden');
        contactForm.classList.remove('hidden');
        // Clear invalid classes
        formFields.forEach(field => {
            field.el.closest('.form-group').classList.remove('invalid');
        });
    });

    // Smooth scroll for nav-links with active state updating
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});
