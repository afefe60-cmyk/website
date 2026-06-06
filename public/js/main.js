document.addEventListener('DOMContentLoaded', () => {
    initCardReveal();
    initContactForm();
    initScentFinder();
});

function currentLang() {
    return document.documentElement.lang === 'ar' ? 'ar' : 'en';
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
