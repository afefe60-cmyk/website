document.addEventListener('DOMContentLoaded', () => {
    initSplashScreen();
    initParticlesCanvas();
    initHeroAudio();
    initCategoryFilters();
    initShowcaseVideoControls();
    initCartDrawer();
    initModalHandlers();
    initWhatsAppWidget();
    initCheckout();
    initGoldClickSparkles();
});

function currentLang() {
    return document.documentElement.lang === 'ar' ? 'ar' : 'en';
}

/* Luxury Splash Screen Animation */
function initSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;

    const hideSplash = () => {
        splash.classList.add('is-hidden');
        setTimeout(() => {
            splash.remove();
        }, 850);
    };

    if (document.readyState === 'complete') {
        setTimeout(hideSplash, 1800);
    } else {
        window.addEventListener('load', () => {
            setTimeout(hideSplash, 1600);
        });
        setTimeout(hideSplash, 2400);
    }
}

/* Floating Luxury Particles Canvas */
function initParticlesCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            color: Math.random() > 0.4 ? 'rgba(200, 164, 93, ' : 'rgba(229, 205, 141, ',
            alpha: Math.random() * 0.5 + 0.2,
            speedY: -Math.random() * 0.5 - 0.1,
            speedX: (Math.random() - 0.5) * 0.3
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
            p.y += p.speedY;
            p.x += p.speedX;

            if (p.y < 0) {
                p.y = height;
                p.x = Math.random() * width;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* Hero Audio Toggle */
function initHeroAudio() {
    const toggleBtn = document.getElementById('hero-audio-toggle');
    const heroVideo = document.getElementById('hero-video');
    if (!toggleBtn || !heroVideo) return;

    toggleBtn.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        const textSpan = toggleBtn.querySelector('.audio-text');
        const isAr = currentLang() === 'ar';
        if (heroVideo.muted) {
            textSpan.textContent = isAr ? 'تشغيل الصوت' : 'Unmute Video';
            toggleBtn.style.background = 'rgba(13, 10, 9, 0.7)';
        } else {
            textSpan.textContent = isAr ? 'كتم الصوت' : 'Mute Video';
            toggleBtn.style.background = 'rgba(200, 164, 93, 0.3)';
        }
    });
}

/* Video Showcase Switcher & Play/Pause */
function initShowcaseVideoControls() {
    const playBtn = document.getElementById('showcase-play-btn');
    const video = document.getElementById('showcase-video');
    if (!playBtn || !video) return;

    playBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
}

function switchShowcaseVideo(src, btnElement) {
    const video = document.getElementById('showcase-video');
    const playBtn = document.getElementById('showcase-play-btn');
    if (!video) return;

    video.src = src;
    video.play();
    if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';

    document.querySelectorAll('.video-playlist-btn').forEach((btn) => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
}

/* Category Filter Tabs */
function initCategoryFilters() {
    const tabs = document.querySelectorAll('.tab-btn');
    const products = document.querySelectorAll('.product-card');

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;

            products.forEach((prod) => {
                if (filter === 'all' || prod.dataset.category === filter) {
                    prod.style.display = 'flex';
                } else {
                    prod.style.display = 'none';
                }
            });
        });
    });
}

/* Fragrance Pyramid Interactive Details */
const pyramidData = {
    top: {
        title: { ar: 'المكونات العليا (Top Notes)', en: 'Top Notes' },
        time: { ar: 'الـ 15 دقيقة الأولى', en: 'First 15 Minutes' },
        desc: {
            ar: 'افتتاحية ناصعة ومشرقة من البرغموت والزعفران والروائح الهوائية المنعشة التي تلفت الانتباه من اللحظة الأولى.',
            en: 'Bright opening notes of bergamot, saffron, and fresh air accords that make an immediate statement.'
        }
    },
    heart: {
        title: { ar: 'قلب العطر (Heart Notes)', en: 'Heart Notes' },
        time: { ar: 'من ساعة إلى 4 ساعات', en: '1 to 4 Hours' },
        desc: {
            ar: 'روح العطر المشرقة بالورد الدمشقي، العود الكامبودي، الياسمين واللافندر التي تمنح العطر شخصيته المتزنة والعميقة.',
            en: 'The heart of the fragrance with Damask rose, Cambodian oud, jasmine, and lavender giving signature character.'
        }
    },
    base: {
        title: { ar: 'القاعدة العطرية (Base Notes)', en: 'Base Notes' },
        time: { ar: 'تثبت حتى 24 ساعة', en: 'Up to 24 Hours' },
        desc: {
            ar: 'عمق فاخر ودافئ من العنبر الأشهب، أخشاب الأرز، المسك الأبيض والصندل، مما يضمن ثباتاً عالياً وبصمة مسائية لا تُنسى.',
            en: 'Rich base of ambergris, cedarwood, white musk, and sandalwood ensuring incredible longevity.'
        }
    }
};

function selectPyramidLevel(levelKey, element) {
    document.querySelectorAll('.pyramid-level').forEach((lvl) => lvl.classList.remove('active'));
    if (element) element.classList.add('active');

    const data = pyramidData[levelKey];
    if (!data) return;

    const lang = currentLang();
    document.getElementById('pyramid-details-title').textContent = data.title[lang];
    document.getElementById('pyramid-details-time').textContent = data.time[lang];
    document.getElementById('pyramid-details-desc').textContent = data.desc[lang];
}

/* Quiz Logic */
const quizAnswers = { 1: null, 2: null, 3: null };

function selectQuizAnswer(step, value) {
    quizAnswers[step] = value;

    const currentStepEl = document.getElementById(`quiz-step-${step}`);
    if (currentStepEl) currentStepEl.classList.remove('active');

    const progressBar = document.getElementById('quiz-progress-bar');

    if (step < 3) {
        const nextStepEl = document.getElementById(`quiz-step-${step + 1}`);
        if (nextStepEl) nextStepEl.classList.add('active');
        if (progressBar) progressBar.style.width = `${((step + 1) / 3) * 100}%`;
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    const resultStep = document.getElementById('quiz-result');
    const progressBar = document.getElementById('quiz-progress-bar');
    if (resultStep) resultStep.classList.add('active');
    if (progressBar) progressBar.style.width = '100%';

    const isAr = currentLang() === 'ar';

    let match = 'council';
    let matchName = isAr ? 'كاونسل' : 'Council';
    let matchImg = '/images/products/council.jpeg';
    let matchPrice = isAr ? '480 درهم' : 'AED 480';

    if (quizAnswers[1] === 'soft') {
        match = 'first-lady';
        matchName = isAr ? 'فيرست ليدي' : 'First Lady';
        matchImg = '/images/products/first-lady.jpeg';
        matchPrice = isAr ? '450 درهم' : 'AED 450';
    } else if (quizAnswers[1] === 'fresh') {
        match = 'chairman';
        matchName = isAr ? 'تشيرمان' : 'Chairman';
        matchImg = '/images/products/chairman.jpeg';
        matchPrice = isAr ? '540 درهم' : 'AED 540';
    } else if (quizAnswers[2] === 'formal') {
        match = 'president';
        matchName = isAr ? 'بريزدنت' : 'President';
        matchImg = '/images/products/president.jpeg';
        matchPrice = isAr ? '520 درهم' : 'AED 520';
    }

    document.getElementById('quiz-recommended-name').textContent = matchName;
    document.getElementById('quiz-recommended-img').src = matchImg;
    document.getElementById('quiz-recommended-price').textContent = matchPrice;

    const addBtn = document.getElementById('quiz-add-btn');
    if (addBtn) {
        addBtn.onclick = () => {
            addToCart({
                id: match,
                name: matchName,
                price: matchPrice,
                image: matchImg
            });
        };
    }
}

function resetQuiz() {
    quizAnswers[1] = quizAnswers[2] = quizAnswers[3] = null;
    document.querySelectorAll('.quiz-step').forEach((s) => s.classList.remove('active'));
    document.getElementById('quiz-step-1').classList.add('active');
    const progressBar = document.getElementById('quiz-progress-bar');
    if (progressBar) progressBar.style.width = '33.33%';
}

/* Cart Storage & Drawer Engine */
const CART_KEY = 'ajmanLuxuryCart';

function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
}

function addToCart(product) {
    const cart = readCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    writeCart(cart);
    openCartDrawer();
    showToast(currentLang() === 'ar' ? 'تمت إضافة العطر إلى سلتك الفاخرة ✨' : 'Added to your luxury cart ✨');
}

function updateCartUI() {
    const cart = readCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelectorAll('[data-cart-count]').forEach((badge) => {
        badge.textContent = count;
    });

    const cartItemsWrap = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    if (!cartItemsWrap) return;

    let subtotal = 0;

    if (cart.length === 0) {
        cartItemsWrap.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 2rem 0;">${currentLang() === 'ar' ? 'السلة فارغة حالياً' : 'Your cart is empty'}</p>`;
        if (cartSubtotal) cartSubtotal.textContent = '0 د.إ';
        return;
    }

    cartItemsWrap.innerHTML = cart.map((item) => {
        const itemPriceNum = Number(String(item.price).replace(/[^\d.]/g, '')) || 0;
        subtotal += itemPriceNum * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.image || '/images/logo.png'}" class="cart-item-img" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                    <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.4rem;">
                        <button onclick="changeQty('${item.id}', -1)" style="background: rgba(200,164,93,0.2); border: none; color: var(--gold-light); width: 24px; height: 24px; border-radius: 50%; cursor: pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty('${item.id}', 1)" style="background: rgba(200,164,93,0.2); border: none; color: var(--gold-light); width: 24px; height: 24px; border-radius: 50%; cursor: pointer;">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart('${item.id}')" style="background: transparent; border: none; color: #ff5555; cursor: pointer;"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }).join('');

    if (cartSubtotal) {
        cartSubtotal.textContent = `${subtotal} ${currentLang() === 'ar' ? 'د.إ' : 'AED'}`;
    }
}

function changeQty(id, delta) {
    const cart = readCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        writeCart(cart.filter((i) => i.id !== id));
    } else {
        writeCart(cart);
    }
}

function removeFromCart(id) {
    const cart = readCart();
    writeCart(cart.filter((i) => i.id !== id));
}

function initCartDrawer() {
    const toggleBtn = document.getElementById('cart-toggle-btn');
    const closeBtn = document.getElementById('close-cart-btn');
    const overlay = document.getElementById('cart-overlay');

    if (toggleBtn) toggleBtn.addEventListener('click', openCartDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeCartDrawer();
        });
    }

    document.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart({
                id: btn.dataset.productId,
                name: btn.dataset.productName,
                price: btn.dataset.productPrice,
                priceFils: Number(btn.dataset.productPriceFils) || 0,
                image: btn.dataset.productImage
            });
        });
    });

    updateCartUI();
}

function openCartDrawer() {
    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.classList.add('active');
}

function closeCartDrawer() {
    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.classList.remove('active');
}

/* Scent Radar Toggle */
function toggleRadar(productId) {
    const panel = document.getElementById(`radar-${productId}`);
    if (!panel) return;
    
    const isOpening = !panel.classList.contains('active');
    panel.classList.toggle('active', isOpening);
    
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.toggle('active', isOpening);
    }
}

/* Quick View Modal Handler with Scent Radar */
const productDB = {
    council: {
        name: { ar: 'كاونسل', en: 'Council' },
        price: { ar: '480 درهم', en: 'AED 480' },
        img: '/images/products/council.jpeg',
        notes: { ar: 'زعفران، برغموت، عود، عنبر، جلد', en: 'Saffron, Bergamot, Oud, Amber, Leather' },
        radar: { sillage: '96%', longevity: '98%', depth: '95%', warmth: '92%' }
    },
    'first-lady': {
        name: { ar: 'فيرست ليدي', en: 'First Lady' },
        price: { ar: '450 درهم', en: 'AED 450' },
        img: '/images/products/first-lady.jpeg',
        notes: { ar: 'كمثرى، ورد، ياسمين، فانيلا، مسك', en: 'Pear, Rose, Jasmine, Vanilla, Musk' },
        radar: { sillage: '86%', longevity: '90%', depth: '94%', warmth: '82%' }
    },
    president: {
        name: { ar: 'بريزدنت', en: 'President' },
        price: { ar: '520 درهم', en: 'AED 520' },
        img: '/images/products/president.jpeg',
        notes: { ar: 'جريب فروت، هيل، أرز، عنبر رمادي', en: 'Grapefruit, Cardamom, Cedar, Ambergris' },
        radar: { sillage: '94%', longevity: '96%', depth: '92%', warmth: '88%' }
    },
    parliament: {
        name: { ar: 'بارليامنت', en: 'Parliament' },
        price: { ar: '500 درهم', en: 'AED 500' },
        img: '/images/products/parliament.jpeg',
        notes: { ar: 'برغموت، ورد أبيض، آيرس، مسك', en: 'Bergamot, White Rose, Iris, Musk' },
        radar: { sillage: '84%', longevity: '88%', depth: '90%', warmth: '80%' }
    },
    chairman: {
        name: { ar: 'تشيرمان', en: 'Chairman' },
        price: { ar: '540 درهم', en: 'AED 540' },
        img: '/images/products/chairman.jpeg',
        notes: { ar: 'ليمون، نعناع، لافندر، نفحات بحرية', en: 'Lemon, Mint, Lavender, Marine Notes' },
        radar: { sillage: '90%', longevity: '92%', depth: '85%', warmth: '95%' }
    }
};

function openQuickView(productId) {
    const modal = document.getElementById('quick-view-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;

    const isAr = currentLang() === 'ar';
    const prod = productDB[productId] || {
        name: { ar: 'عطر فاخر', en: 'Luxury Perfume' },
        price: { ar: '480 درهم', en: 'AED 480' },
        img: '/images/products/council.jpeg',
        notes: { ar: 'زيوت نادرة وخلاصات نقية', en: 'Rare oils and pure extracts' },
        radar: { sillage: '90%', longevity: '92%', depth: '90%', warmth: '85%' }
    };

    content.innerHTML = `
        <div style="display: grid; grid-template-columns: minmax(160px, 220px) 1fr; gap: 2rem; align-items: center;">
            <img src="${prod.img}" alt="${prod.name[currentLang()]}" style="width: 100%; border-radius: 16px; border: 1px solid var(--border-glass); object-fit: cover;" onerror="this.onerror=null; this.src='/images/logo.png';">
            <div>
                <h2 class="font-title gold-text" style="font-size: 1.8rem; margin-bottom: 0.3rem;">${prod.name[currentLang()]}</h2>
                <div class="gold-text" style="font-size: 1.3rem; font-weight: bold; margin-bottom: 0.8rem;">${prod.price[currentLang()]}</div>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                    <strong>${isAr ? 'النوتات الرئيسية:' : 'Key Notes:'}</strong> ${prod.notes[currentLang()]}
                </p>

                <!-- Mini Radar in Quick View -->
                <div style="background: rgba(13,10,9,0.6); padding: 0.8rem; border-radius: 12px; border: 1px solid var(--border-glass); margin-bottom: 1.2rem;">
                    <div style="font-size: 0.8rem; color: var(--gold-light); font-weight: bold; margin-bottom: 0.5rem;"><i class="fas fa-chart-pie gold-icon"></i> ${isAr ? 'رادار الطابع العطري:' : 'Scent Profile Radar:'}</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; font-size: 0.78rem;">
                        <div>${isAr ? 'الفوحان:' : 'Sillage:'} <strong class="gold-text">${prod.radar.sillage}</strong></div>
                        <div>${isAr ? 'الثبات:' : 'Longevity:'} <strong class="gold-text">${prod.radar.longevity}</strong></div>
                        <div>${isAr ? 'العمق:' : 'Depth:'} <strong class="gold-text">${prod.radar.depth}</strong></div>
                        <div>${isAr ? 'الدفء:' : 'Warmth:'} <strong class="gold-text">${prod.radar.warmth}</strong></div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
                    <button class="btn btn-primary btn-sm" onclick="addToCart({ id: '${productId}', name: '${prod.name[currentLang()]}', price: '${prod.price[currentLang()]}', image: '${prod.img}' }); closeModal();">
                        <i class="fas fa-shopping-bag"></i> ${isAr ? 'أضف للسلة' : 'Add to Bag'}
                    </button>
                    <a href="/product/${productId}?lang=${currentLang()}" class="btn btn-outline btn-sm">${isAr ? 'التفاصيل الكاملة' : 'Full Details'}</a>
                </div>
            </div>
        </div>
    `;
    modal.classList.add('active');
}

function initModalHandlers() {
    const closeBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('quick-view-modal');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}

function closeModal() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) modal.classList.remove('active');
}

/* Toast Notifications */
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3200);
}

/* WhatsApp Widget & Live Chat */
function initWhatsAppWidget() {
    const widget = document.querySelector('[data-whatsapp-widget]');
    if (!widget) return;

    const toggle = widget.querySelector('[data-whatsapp-toggle]');
    const closeButton = widget.querySelector('[data-whatsapp-close]');
    const panel = widget.querySelector('[data-whatsapp-panel]');
    const form = widget.querySelector('[data-whatsapp-form]');
    const status = widget.querySelector('[data-whatsapp-status]');
    const messages = widget.querySelector('[data-whatsapp-messages]');
    const lang = widget.dataset.lang === 'ar' ? 'ar' : 'en';

    function setOpen(isOpen) {
        panel.hidden = !isOpen;
        widget.classList.toggle('is-open', isOpen);
    }

    function addBubble(text, type = 'user') {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${type}`;
        bubble.textContent = text;
        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;
    }

    if (toggle) toggle.addEventListener('click', () => setOpen(panel.hidden));
    if (closeButton) closeButton.addEventListener('click', () => setOpen(false));

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());
            payload.lang = lang;

            addBubble(payload.message);
            if (status) status.textContent = lang === 'ar' ? 'جاري الإرسال...' : 'Sending...';

            try {
                const response = await fetch('/api/whatsapp-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                addBubble(result.reply, 'support');
                if (status) status.textContent = lang === 'ar' ? 'تم الإرسال' : 'Sent';
                form.querySelector('[name="message"]').value = '';
            } catch (error) {
                addBubble(lang === 'ar' ? 'تعذر الإرسال حالياً.' : 'Unable to send.', 'support error');
            }
        });
    }
}

/* Checkout Logic Compatibility */
function initCheckout() {
    const checkoutPage = document.querySelector('[data-checkout-page]');
    if (!checkoutPage) return;

    const itemsWrap = checkoutPage.querySelector('[data-checkout-items]');
    const emptyCart = checkoutPage.querySelector('[data-empty-cart]');
    const totalWrap = checkoutPage.querySelector('[data-checkout-total-wrap]');
    const totalNode = checkoutPage.querySelector('[data-checkout-total]');
    const form = checkoutPage.querySelector('[data-checkout-form]');
    const lang = checkoutPage.dataset.lang === 'ar' ? 'ar' : 'en';

    function renderCheckout() {
        const cart = readCart();
        const total = cart.reduce((sum, item) => {
            const priceNum = Number(String(item.price).replace(/[^\d.]/g, '')) || 0;
            return sum + priceNum * item.quantity;
        }, 0);

        if (emptyCart) emptyCart.hidden = cart.length > 0;
        if (totalWrap) totalWrap.hidden = cart.length === 0;
        if (form) form.hidden = cart.length === 0;
        if (totalNode) totalNode.textContent = `${total} AED`;

        if (itemsWrap) {
            itemsWrap.innerHTML = cart.map((item) => `
                <div class="checkout-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border-glass);">
                    <div>
                        <strong>${item.name}</strong> × ${item.quantity}
                    </div>
                    <span>${item.price}</span>
                </div>
            `).join('');
        }
    }

    renderCheckout();
}

/* Golden Sparkle Click Micro-Interactions (Feature 6) */
function initGoldClickSparkles() {
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.btn, [data-add-to-cart], .tab-btn, .icon-btn, .scent-radar-toggle-btn, .pyramid-level, .quiz-opt, .quick-view-btn, .lang-switch');
        if (!target) return;

        const x = e.clientX;
        const y = e.clientY;
        const particleCount = 10;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'gold-sparkle-particle';
            
            const size = Math.random() * 5 + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            const angle = (Math.PI * 2 / particleCount) * i + (Math.random() - 0.5);
            const distance = Math.random() * 45 + 20;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 750);
        }
    });
}

