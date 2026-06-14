document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================
    // DATA & GLOBAL STATE
    // ==========================================

    // Product List (Array of Objects)
    const products = [
        {
            id: "1",
            name: "Nebula Pro Laptop",
            price: 1499.00,
            badge: "Premium",
            category: "Premium",
            desc: "Intel i9, 32GB RAM, 1TB SSD. Diseñada para cargas de trabajo exigentes y gaming ultra fluido.",
            img: "assets/laptop.webp",
            fallbackImg: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: "2",
            name: "Quantum VR Headset",
            price: 599.00,
            badge: "Popular",
            category: "Popular",
            desc: "Pantallas duales de 4K, 120Hz y seguimiento ocular avanzado. Sumérgete en el metaverso con total realismo.",
            img: "assets/vr.webp",
            fallbackImg: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: "3",
            name: "Nova Wireless Earbuds",
            price: 189.00,
            badge: "Novedad",
            category: "Novedades",
            desc: "Cancelación de ruido activa híbrida, audio espacial 3D y hasta 40 horas de autonomía total.",
            img: "assets/earbuds.webp",
            fallbackImg: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: "4",
            name: "Apex Smartwatch",
            price: 249.00,
            badge: "Nuevo",
            category: "Novedades",
            desc: "Pantalla AMOLED siempre encendida, medición de SpO2, GPS integrado y resistencia al agua 5 ATM.",
            img: "assets/watch.webp",
            fallbackImg: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80"
        }
    ];

    // Favorites List (Array of IDs loaded from localStorage)
    let favorites = [];
    const savedFavorites = localStorage.getItem('nebula_favorites');
    if (savedFavorites) {
        try {
            favorites = JSON.parse(savedFavorites);
        } catch (e) {
            favorites = [];
        }
    }

    // Shopping Cart State
    let cart = [];
    const savedCart = localStorage.getItem('nebula_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartUI();
        } catch (e) {
            cart = [];
        }
    }

    // ==========================================
    // 1. DYNAMIC RENDERING (Requirement 3)
    // ==========================================

    const productsContainer = document.getElementById('products-flexbox');
    const searchInput = document.getElementById('product-search');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Arrow function for checking if a product is favorited
    const isFavorite = (productId) => favorites.includes(productId);

    // Arrow function to save favorites to localStorage and update badge count
    const saveFavorites = () => {
        localStorage.setItem('nebula_favorites', JSON.stringify(favorites));
        updateFavoritesBadge();
    };

    // Update the Favorites Badge in the Header
    const updateFavoritesBadge = () => {
        const favBadge = document.getElementById('favorites-count');
        if (favBadge) {
            const count = favorites.length;
            favBadge.textContent = count;
            if (count > 0) {
                favBadge.style.display = 'flex';
                // Scale animation
                favBadge.style.transform = 'scale(1.2)';
                setTimeout(() => favBadge.style.transform = '', 200);
            } else {
                favBadge.style.display = 'none';
            }
        }
    };

    // Core Dynamic Rendering Function
    const renderProducts = (productsList) => {
        if (!productsContainer) return;

        // Clear container
        productsContainer.innerHTML = '';

        // Check if there are products to show
        if (productsList.length === 0) {
            productsContainer.innerHTML = `
                <div class="no-products-found">
                    <i data-lucide="inbox"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta cambiar el término de búsqueda o selecciona otra categoría.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        // Loop using forEach (Control Structure requirement)
        productsList.forEach(product => {
            const isFav = isFavorite(product.id);
            const card = document.createElement('article');
            card.className = 'product-card';
            card.id = `prod-${product.id}`;

            card.innerHTML = `
                <div class="product-img-wrapper">
                    <div class="product-glow"></div>
                    <img src="${product.img}" alt="${product.name}" class="product-img"
                        onerror="this.src='${product.fallbackImg}'">
                    <span class="product-badge">${product.badge}</span>
                    <button class="btn-favorite ${isFav ? 'active' : ''}" data-id="${product.id}" aria-label="Añadir a favoritos" title="Favorito">
                        <i data-lucide="heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.desc}</p>
                    <div class="product-price-row">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="btn-add-to-cart" data-id="${product.id}" data-name="${product.name}"
                            data-price="${product.price}" aria-label="Añadir ${product.name} al carrito">
                            <i data-lucide="plus"></i>
                        </button>
                    </div>
                </div>
            `;

            productsContainer.appendChild(card);
        });

        // Re-initialize Lucide icons for new content
        lucide.createIcons();

        // Attach event listeners to dynamically rendered elements
        bindProductCardEvents();
    };

    // ==========================================
    // 2. DYNAMIC SEARCH & FILTERS (Requirement 2)
    // ==========================================

    const filterAndRenderProducts = () => {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeBtn = document.querySelector('.filter-btn.active');
        const activeCategory = activeBtn ? activeBtn.getAttribute('data-category') : 'all';

        const filtered = products.filter(product => {
            // Category check
            let matchesCategory = false;
            if (activeCategory === 'all') {
                matchesCategory = true;
            } else if (activeCategory === 'favorites') {
                matchesCategory = isFavorite(product.id);
            } else {
                matchesCategory = product.category === activeCategory;
            }

            // Search text check
            const matchesSearch = product.name.toLowerCase().includes(query) ||
                product.desc.toLowerCase().includes(query);

            return matchesCategory && matchesSearch;
        });

        renderProducts(filtered);
    };

    // Listeners for filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterAndRenderProducts();
        });
    });

    // Listener for search input
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filterAndRenderProducts();
        });
    }

    // ==========================================
    // 3. FAVORITES SYSTEM (Requirement 1)
    // ==========================================

    const toggleFavorite = (productId) => {
        const index = favorites.indexOf(productId);
        if (index > -1) {
            // Remove from favorites if already present
            favorites.splice(index, 1);
        } else {
            // Add to favorites if not present
            favorites.push(productId);
        }

        saveFavorites();

        // Dynamic visual update on the clicked heart button (DOM Manipulation)
        const heartButtons = document.querySelectorAll(`.btn-favorite[data-id="${productId}"]`);
        heartButtons.forEach(btn => {
            if (isFavorite(productId)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // If currently filtering by favorites, re-render immediately to reflect changes
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        if (activeFilterBtn && activeFilterBtn.getAttribute('data-category') === 'favorites') {
            filterAndRenderProducts();
        }
    };

    // Header Favorites Button Listener
    const headerFavToggle = document.getElementById('favorites-toggle-btn');
    if (headerFavToggle) {
        headerFavToggle.addEventListener('click', () => {
            // Scroll to catalog section
            const productsSec = document.getElementById('products-section');
            if (productsSec) {
                productsSec.scrollIntoView({ behavior: 'smooth' });
            }

            // Activate Favorites filter button
            const favFilterBtn = document.getElementById('filter-fav-btn');
            if (favFilterBtn) {
                filterButtons.forEach(b => b.classList.remove('active'));
                favFilterBtn.classList.add('active');
                filterAndRenderProducts();
            }
        });
    }

    // ==========================================
    // EVENT BINDINGS FOR RENDERED CARDS
    // ==========================================

    function bindProductCardEvents() {
        // Add to Cart buttons
        const addButtons = productsContainer.querySelectorAll('.btn-add-to-cart');
        addButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const name = button.getAttribute('data-name');
                const price = parseFloat(button.getAttribute('data-price'));

                // Determine image based on product
                const productObj = products.find(p => p.id === id);
                const img = productObj ? productObj.img : 'assets/laptop.webp';

                addToCart(id, name, price, img);

                // Press down animation
                button.style.transform = 'scale(0.85)';
                setTimeout(() => button.style.transform = '', 150);
            });
        });

        // Favorite Buttons
        const favButtons = productsContainer.querySelectorAll('.btn-favorite');
        favButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = button.getAttribute('data-id');
                toggleFavorite(id);
            });
        });
    }

    // ==========================================
    // THEME TOGGLE (DARK / LIGHT MODE)
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        body.classList.add('light-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
        });
    }

    // ==========================================
    // HEADER SCROLL EFFECT
    // ==========================================
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // ==========================================
    // DRAWERS & MODALS TOGGLERS
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
    const toggleDrawer = (drawer, open = true) => {
        if (!drawer) return;
        if (open) {
            drawer.classList.add('open');
            drawer.setAttribute('aria-hidden', 'false');
            body.style.overflow = 'hidden';
        } else {
            drawer.classList.remove('open');
            drawer.setAttribute('aria-hidden', 'true');
            body.style.overflow = '';
        }
    };

    // Toggle Modal Helper
    const toggleModal = (modal, open = true) => {
        if (!modal) return;
        if (open) {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            body.style.overflow = 'hidden';
        } else {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            body.style.overflow = '';
        }
    };

    // Cart Events
    if (cartBtn) cartBtn.addEventListener('click', () => toggleDrawer(cartDrawer, true));
    if (cartClose) cartClose.addEventListener('click', () => toggleDrawer(cartDrawer, false));
    if (cartOverlay) cartOverlay.addEventListener('click', () => toggleDrawer(cartDrawer, false));

    // User Modal Events
    if (userBtn) userBtn.addEventListener('click', () => toggleModal(loginModal, true));
    if (loginClose) loginClose.addEventListener('click', () => toggleModal(loginModal, false));
    if (loginOverlay) loginOverlay.addEventListener('click', () => toggleModal(loginModal, false));

    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            const headerTitle = loginModal.querySelector('.modal-header h3');
            const headerSubtitle = loginModal.querySelector('.modal-header p');
            const submitBtn = document.getElementById('btn-submit-login');

            if (submitBtn && submitBtn.textContent === 'Entrar') {
                headerTitle.textContent = 'Crear Cuenta';
                headerSubtitle.textContent = 'Regístrate en Nebula Tech y disfruta de beneficios exclusivos';
                submitBtn.textContent = 'Registrarse';
                switchToSignup.textContent = 'Iniciar Sesión';
            } else if (submitBtn) {
                headerTitle.textContent = 'Iniciar Sesión';
                headerSubtitle.textContent = 'Accede a tu cuenta de Nebula Tech';
                submitBtn.textContent = 'Entrar';
                switchToSignup.textContent = 'Crear cuenta';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('login-email');
            const email = emailInput ? emailInput.value : '';
            if (email) {
                alert(`¡Bienvenido a Nebula Tech! Has iniciado sesión como ${email}`);
                toggleModal(loginModal, false);
                loginForm.reset();
            }
        });
    }

    // ==========================================
    // SHOPPING CART FUNCTIONALITY
    // ==========================================

    function addToCart(id, name, price, img) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ id, name, price, img, qty: 1 });
        }

        saveCart();
        updateCartUI();

        // Auto open cart drawer
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

        if (!cartCount) return;

        // Update badge count
        const totalItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);
        cartCount.textContent = totalItemsCount;

        // Badge animation
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => cartCount.style.transform = '', 200);

        if (cart.length === 0) {
            if (emptyCartMsg) emptyCartMsg.classList.remove('hidden');
            if (cartItemsList) cartItemsList.classList.add('hidden');
            if (cartFooter) cartFooter.classList.add('hidden');
        } else {
            if (emptyCartMsg) emptyCartMsg.classList.add('hidden');
            if (cartItemsList) cartItemsList.classList.remove('hidden');
            if (cartFooter) cartFooter.classList.remove('hidden');

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
            if (totalPriceEl) totalPriceEl.textContent = `$${total.toFixed(2)}`;
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
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('¡Gracias por tu simulación de compra! En un entorno real, te redirigiríamos a la pasarela de pago.');
            cart = [];
            saveCart();
            updateCartUI();
            toggleDrawer(cartDrawer, false);
        });
    }

    // ==========================================
    // CONTACT FORM VALIDATION
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formSuccessAlert = document.getElementById('form-success');
    const btnResetForm = document.getElementById('btn-reset-form');

    // Live validation listener
    const formFields = [
        { el: document.getElementById('form-name'), validator: val => val.trim().length >= 3 },
        { el: document.getElementById('form-email'), validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) },
        { el: document.getElementById('form-message'), validator: val => val.trim().length >= 10 }
    ];

    formFields.forEach(field => {
        if (field.el) {
            field.el.addEventListener('input', () => {
                const group = field.el.closest('.form-group');
                if (group && field.validator(field.el.value)) {
                    group.classList.remove('invalid');
                }
            });
        }
    });

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            formFields.forEach(field => {
                if (field.el) {
                    const group = field.el.closest('.form-group');
                    const isValid = field.validator(field.el.value);

                    if (group) {
                        if (!isValid) {
                            group.classList.add('invalid');
                            isFormValid = false;
                        } else {
                            group.classList.remove('invalid');
                        }
                    }
                }
            });

            if (isFormValid) {
                contactForm.classList.add('hidden');
                if (formSuccessAlert) formSuccessAlert.classList.remove('hidden');
            }
        });
    }

    // Reset Form Event
    if (btnResetForm) {
        btnResetForm.addEventListener('click', () => {
            if (contactForm) {
                contactForm.reset();
                contactForm.classList.remove('hidden');
            }
            if (formSuccessAlert) formSuccessAlert.classList.add('hidden');

            formFields.forEach(field => {
                if (field.el) {
                    const group = field.el.closest('.form-group');
                    if (group) group.classList.remove('invalid');
                }
            });
        });
    }

    // Smooth scroll for nav-links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // ==========================================
    // INITIALIZATION RUNS
    // ==========================================
    // Initial render of all products
    renderProducts(products);

    // Initial update of favorites badge
    updateFavoritesBadge();
});
