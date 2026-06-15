document.addEventListener('DOMContentLoaded', () => {
    initCardReveal();
    initContactForm();
    initScentFinder();
    initCart();
    initCheckout();
    initWhatsAppWidget();
    initRotatingPromo();
    initMobileMegaMenu();
});

function currentLang() {
    return document.documentElement.lang === 'ar' ? 'ar' : 'en';
}

function initMobileMegaMenu() {
    const toggle = document.querySelector('[data-mobile-menu-toggle]');
    const menu = document.querySelector('[data-mobile-mega-menu]');

    if (!toggle || !menu) {
        return;
    }

    const closeMenu = () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        const willOpen = !menu.classList.contains('is-open');
        menu.classList.toggle('is-open', willOpen);
        toggle.setAttribute('aria-expanded', String(willOpen));
    });

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 780) {
            closeMenu();
        }
    });
}

const CART_KEY = 'ajmanLuxuryCart';

function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function formatMoney(amount) {
    return `AED ${Math.max(0, Number(amount) || 0).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;
}

function updateCartCount() {
    const count = readCart().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('[data-cart-count]').forEach((counter) => {
        counter.textContent = count;
        counter.hidden = count === 0;
    });
}

function initCart() {
    updateCartCount();
    document.querySelectorAll('[data-add-to-cart]').forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const cart = readCart();
            const product = {
                id: button.dataset.productId,
                name: button.dataset.productName,
                price: button.dataset.productPrice,
                priceFils: Number(button.dataset.productPriceFils) || 0,
                image: button.dataset.productImage
            };

            const existing = cart.find((item) => item.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            writeCart(cart);
            showNotification(currentLang() === 'ar' ? 'تمت إضافة العطر إلى السلة.' : 'Perfume added to your bag.');
        });
    });
}

function initCheckout() {
    const checkoutPage = document.querySelector('[data-checkout-page]');
    if (!checkoutPage) {
        return;
    }

    const itemsWrap = checkoutPage.querySelector('[data-checkout-items]');
    const emptyCart = checkoutPage.querySelector('[data-empty-cart]');
    const totalWrap = checkoutPage.querySelector('[data-checkout-total-wrap]');
    const totalNode = checkoutPage.querySelector('[data-checkout-total]');
    const form = checkoutPage.querySelector('[data-checkout-form]');
    const message = checkoutPage.querySelector('[data-checkout-message]');
    const lang = checkoutPage.dataset.lang === 'ar' ? 'ar' : 'en';

    function renderCheckout() {
        const cart = readCart();
        const total = cart.reduce((sum, item) => sum + (Number(item.priceFils) || 0) * item.quantity, 0);

        emptyCart.hidden = cart.length > 0;
        totalWrap.hidden = cart.length === 0;
        form.hidden = cart.length === 0;
        totalNode.textContent = formatMoney(total / 100);

        itemsWrap.innerHTML = cart.map((item) => `
            <article class="checkout-item" data-cart-item="${item.id}">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<span class="checkout-thumb"></span>'}
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.price}</p>
                    <div class="quantity-control">
                        <button type="button" data-qty="-1" aria-label="Decrease">−</button>
                        <span>${item.quantity}</span>
                        <button type="button" data-qty="1" aria-label="Increase">+</button>
                    </div>
                </div>
                <strong>${formatMoney((Number(item.priceFils) || 0) * item.quantity / 100)}</strong>
                <button type="button" class="remove-cart-item" data-remove-item>${lang === 'ar' ? 'حذف' : 'Remove'}</button>
            </article>
        `).join('');
    }

    itemsWrap.addEventListener('click', (event) => {
        const itemNode = event.target.closest('[data-cart-item]');
        if (!itemNode) {
            return;
        }

        const cart = readCart();
        const item = cart.find((cartItem) => cartItem.id === itemNode.dataset.cartItem);
        if (!item) {
            return;
        }

        if (event.target.matches('[data-remove-item]')) {
            writeCart(cart.filter((cartItem) => cartItem.id !== item.id));
            renderCheckout();
            return;
        }

        if (event.target.matches('[data-qty]')) {
            item.quantity = Math.max(1, item.quantity + Number(event.target.dataset.qty));
            writeCart(cart);
            renderCheckout();
        }
    });

    checkoutPage.querySelector('[data-clear-cart]').addEventListener('click', () => {
        writeCart([]);
        renderCheckout();
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        message.textContent = lang === 'ar' ? 'جاري تجهيز الطلب...' : 'Preparing your order...';

        const formData = new FormData(form);
        const customer = Object.fromEntries(formData.entries());
        const items = readCart().map((item) => ({ id: item.id, quantity: item.quantity }));

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lang, customer, items })
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Checkout failed');
            }

            if (result.url && result.url.startsWith('/checkout/success')) {
                writeCart([]);
            }
            window.location.href = result.url;
        } catch (error) {
            message.textContent = lang === 'ar'
                ? 'تعذر إتمام الطلب الآن. حاول مرة أخرى.'
                : 'Unable to place the order now. Please try again.';
        }
    });

    renderCheckout();
}

function initWhatsAppWidget() {
    const widget = document.querySelector('[data-whatsapp-widget]');
    if (!widget) {
        return;
    }

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
        if (isOpen) {
            const messageField = form.querySelector('[name="message"]');
            setTimeout(() => messageField.focus(), 80);
        }
    }

    function addBubble(text, type = 'user') {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${type}`;
        bubble.textContent = text;
        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;
    }

    toggle.addEventListener('click', () => setOpen(panel.hidden));
    closeButton.addEventListener('click', () => setOpen(false));

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());
        payload.lang = lang;

        addBubble(payload.message);
        status.textContent = lang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
        form.querySelector('button').disabled = true;

        try {
            const response = await fetch('/api/whatsapp-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Message failed');
            }

            addBubble(result.reply, 'support');
            status.textContent = lang === 'ar' ? 'تم الإرسال بنجاح' : 'Sent successfully';
            form.querySelector('[name="message"]').value = '';
        } catch (error) {
            addBubble(
                lang === 'ar'
                    ? 'تعذر إرسال الرسالة الآن. حاول مرة أخرى أو استخدم صفحة التواصل.'
                    : 'Unable to send now. Please try again or use the contact page.',
                'support error'
            );
            status.textContent = '';
        } finally {
            form.querySelector('button').disabled = false;
        }
    });
}

function initRotatingPromo() {
    const promo = document.querySelector('[data-rotating-promo]');
    if (!promo) {
        return;
    }

    const lang = promo.dataset.lang === 'ar' ? 'ar' : 'en';
    const title = promo.querySelector('[data-promo-title]');
    const text = promo.querySelector('[data-promo-text]');
    const bottle = promo.querySelector('[data-promo-bottle]');
    const images = (promo.dataset.promoImages || '').split('|').filter(Boolean);
    const phrases = {
        en: [
            ['Create your day-to-night fragrance signature', 'Choose an elegant scent for the day and a deeper signature for refined evening occasions with AJMAN LUXURY.'],
            ['One for daylight, one for mystery', 'Build a pair that moves from polished mornings to unforgettable nights.'],
            ['A ritual of presence and power', 'Layer elegance, warmth, and depth with two perfumes designed for lasting impact.'],
            ['Your scent story, doubled', 'Select two luxury bottles and let every moment carry its own signature.']
        ],
        ar: [
            ['اصنع توقيعك العطري من النهار إلى المساء', 'اختر عطراً أنيقاً ليومك وآخر أكثر عمقاً لمناسباتك المسائية ضمن عرض عجمان لكجري.'],
            ['عطر للنهار وآخر للغموض', 'اصنع ثنائية تنتقل من صباح راقٍ إلى مساء لا يُنسى.'],
            ['طقس من الحضور والهيبة', 'اجمع الأناقة والدفء والعمق في عطرين بثبات وانطباع فاخر.'],
            ['قصتك العطرية بلمستين', 'اختر زجاجتين فاخرتين واجعل لكل لحظة توقيعها الخاص.']
        ]
    };

    let index = 0;
    setInterval(() => {
        index = (index + 1) % phrases[lang].length;
        promo.classList.add('is-changing');
        setTimeout(() => {
            title.textContent = phrases[lang][index][0];
            text.textContent = phrases[lang][index][1];
            if (bottle && images[index % images.length]) {
                bottle.src = images[index % images.length];
            }
            promo.classList.remove('is-changing');
        }, 280);
    }, 4200);
}

function initCardReveal() {
    const cards = document.querySelectorAll('.product-card, .journal-card, .testimonial-card, .gallery-item');
    if (!('IntersectionObserver' in window)) {
        cards.forEach((card) => card.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    cards.forEach((card) => observer.observe(card));
}

function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) {
        return;
    }

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = currentLang() === 'ar'
            ? 'شكراً لتواصلكم مع عجمان لكجري. سنعود إليكم قريباً.'
            : 'Thank you for contacting AJMAN LUXURY. We will get back to you soon.';
        showNotification(message);
        contactForm.reset();
    });
}

function initScentFinder() {
    const finderForm = document.getElementById('scentFinderForm');
    if (!finderForm) {
        return;
    }

    finderForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const lang = finderForm.dataset.lang === 'ar' ? 'ar' : 'en';
        const profile = finderForm.querySelector('input[name="profile"]:checked').value;
        const occasion = finderForm.querySelector('input[name="occasion"]:checked').value;
        const longevity = finderForm.querySelector('input[name="longevity"]:checked').value;

        let match = 'president';
        if (profile === 'fresh' || profile === 'floral') {
            match = 'first-lady';
        }
        if (profile === 'woody' || profile === 'oriental') {
            match = occasion === 'evening' || longevity === 'long' ? 'council' : 'president';
        }

        const copy = {
            en: {
                council: ['Council', 'A warm oud extrait with spice, amber, and a strong evening presence.'],
                'first-lady': ['First Lady', 'A graceful floral amber scent for soft elegance and memorable gifts.'],
                president: ['President', 'A confident amber woods perfume for polished daily and evening wear.']
            },
            ar: {
                council: ['كاونسل', 'عطر عود دافئ بالتوابل والعنبر وحضور مسائي واضح.'],
                'first-lady': ['فيرست ليدي', 'عطر زهري عنبري ناعم للأناقة والهدايا الراقية.'],
                president: ['بريزدنت', 'عطر عنبري خشبي واثق للاستخدام اليومي والمساء.']
            }
        };

        document.getElementById('resultTitle').textContent = copy[lang][match][0];
        document.getElementById('resultText').textContent = copy[lang][match][1];
        document.getElementById('resultLink').href = `/product/${match}?lang=${lang}`;

        const result = document.getElementById('result');
        result.hidden = false;
        result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('is-leaving');
        setTimeout(() => notification.remove(), 250);
    }, 2800);
}
