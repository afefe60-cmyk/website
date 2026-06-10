const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'site-data.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const VIDEO_DIR = path.join(__dirname, 'public', 'videos');
const SITE_URL = process.env.SITE_URL || `http://localhost:${PORT}`;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-secret';
const SESSION_COOKIE = 'ajman_admin_session';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    const requestedLang = req.query.lang || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
    req.lang = requestedLang === 'ar' ? 'ar' : 'en';
    req.isRTL = req.lang === 'ar';
    next();
});

let translations = {
    en: {
        siteName: 'AJMAN LUXURY',
        home: 'Home',
        about: 'About',
        contact: 'Contact',
        products: 'Perfumes',
        gallery: 'Gallery',
        blog: 'Journal',
        testimonials: 'Testimonials',
        scentFinder: 'Scent Finder',
        welcome: 'AJMAN LUXURY',
        subtitle: 'Extrait de parfum crafted with oud, rose, amber, saffron, and a refined Emirati signature.',
        heroEyebrow: 'Luxury perfume house from Ajman',
        heroNote: 'Private blends for evenings, gifts, and daily elegance.',
        learnMore: 'Our Story',
        getInTouch: 'Contact Us',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        send: 'Send Message',
        name: 'Name',
        message: 'Message',
        ourProducts: 'Signature Collection',
        viewDetails: 'View Details',
        shopNow: 'Explore Collection',
        collectionIntro: 'Balanced, long-lasting perfumes inspired by Arabian heritage and modern luxury.',
        aboutTitle: 'About AJMAN LUXURY',
        aboutText1: 'AJMAN LUXURY is a perfume house inspired by the elegance of Ajman and the depth of Arabian perfumery. Every scent is designed to feel polished, memorable, and worthy of special occasions.',
        aboutText2: 'Our compositions focus on rich raw materials such as oud, amber, rose, musk, saffron, vanilla, and precious woods. The result is a collection with presence, projection, and a smooth dry-down.',
        aboutText3: 'We create fragrances for people who want a signature trail: refined enough for daily use, strong enough for evening wear, and elegant enough to be gifted.',
        heritageTitle: 'Our Heritage',
        heritageText: 'The brand identity draws from the falcon, a symbol of pride, precision, and noble presence in the Emirates.',
        commitmentTitle: 'Our Promise',
        commitmentText: 'Every bottle is presented with a focus on quality, clarity, and a premium customer experience from first note to final impression.',
        contactTitle: 'Contact AJMAN LUXURY',
        contactInfo: 'Contact Information',
        contactForm: 'Send us a message',
        address_label: 'Ajman, United Arab Emirates',
        phone_label: '+971 50 000 0000',
        email_label: 'info@ajmanluxury.ae',
        hoursTitle: 'Business Hours',
        hoursWeek: 'Saturday - Thursday: 10:00 AM - 10:00 PM',
        hoursFriday: 'Friday: 4:00 PM - 10:00 PM',
        description: 'Description',
        fragrance: 'Fragrance Notes',
        topNotes: 'Top Notes',
        heartNotes: 'Heart Notes',
        baseNotes: 'Base Notes',
        story: 'The Story',
        addToCart: 'Request This Perfume',
        galleryTitle: 'Luxury Presentation',
        blogTitle: 'Perfume Journal',
        readMore: 'Read More',
        testimonialTitle: 'Client Impressions',
        scentFinderTitle: 'Find Your Signature Scent',
        scentFinderDesc: 'Answer three quick questions and discover the AJMAN LUXURY perfume that fits your taste.',
        question1: 'Which scent profile attracts you most?',
        question2: 'When will you wear it most?',
        question3: 'What level of presence do you prefer?',
        option1: 'Fresh and polished',
        option2: 'Floral and elegant',
        option3: 'Woody and confident',
        option4: 'Oriental and intense',
        option5: 'Daily wear',
        option6: 'Evening occasions',
        option7: 'Both',
        option8: 'Soft and close',
        option9: 'Noticeable',
        option10: 'Long-lasting statement',
        getResult: 'Show My Match',
        perfectMatch: 'Your Perfect Match',
        viewProduct: 'View Product',
        backToBlog: 'Back to Journal',
        footerTagline: 'Premium perfumes from the UAE'
    },
    ar: {
        siteName: 'عجمان لكجري',
        home: 'الرئيسية',
        about: 'من نحن',
        contact: 'تواصل معنا',
        products: 'العطور',
        gallery: 'المعرض',
        blog: 'المجلة',
        testimonials: 'آراء العملاء',
        scentFinder: 'اختيار العطر',
        welcome: 'عجمان لكجري',
        subtitle: 'عطور إكستريت فاخرة بصياغة تجمع العود والورد والعنبر والزعفران بروح إماراتية راقية.',
        heroEyebrow: 'دار عطور فاخرة من عجمان',
        heroNote: 'خلطات خاصة للمناسبات والهدايا والحضور اليومي الأنيق.',
        learnMore: 'قصتنا',
        getInTouch: 'تواصل معنا',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        address: 'العنوان',
        send: 'إرسال الرسالة',
        name: 'الاسم',
        message: 'الرسالة',
        ourProducts: 'المجموعة المميزة',
        viewDetails: 'عرض التفاصيل',
        shopNow: 'استكشف المجموعة',
        collectionIntro: 'عطور ثابتة ومتوازنة مستوحاة من التراث العربي والفخامة المعاصرة.',
        aboutTitle: 'عن عجمان لكجري',
        aboutText1: 'عجمان لكجري دار عطور تستلهم أناقة عجمان وعمق صناعة العطور العربية. كل عطر صُمم ليترك حضوراً مصقولاً وذكرى لا تُنسى.',
        aboutText2: 'نركز في تركيباتنا على خامات غنية مثل العود والعنبر والورد والمسك والزعفران والفانيلا والأخشاب الثمينة، لنقدم عطراً بثبات واضح ونهاية ناعمة.',
        aboutText3: 'نصنع العطر لمن يبحث عن بصمة شخصية: راقٍ للاستخدام اليومي، قوي للمساء، وفخم بما يكفي ليكون هدية مميزة.',
        heritageTitle: 'هويتنا',
        heritageText: 'تستند الهوية إلى الصقر بوصفه رمزاً للفخر والدقة والحضور النبيل في الإمارات.',
        commitmentTitle: 'وعدنا',
        commitmentText: 'كل زجاجة تُقدّم بعناية في الجودة والوضوح وتجربة العميل، من أول نفحة حتى آخر انطباع.',
        contactTitle: 'تواصل مع عجمان لكجري',
        contactInfo: 'معلومات التواصل',
        contactForm: 'أرسل لنا رسالة',
        address_label: 'عجمان، الإمارات العربية المتحدة',
        phone_label: '+971 50 000 0000',
        email_label: 'info@ajmanluxury.ae',
        hoursTitle: 'ساعات العمل',
        hoursWeek: 'السبت - الخميس: 10:00 صباحاً - 10:00 مساءً',
        hoursFriday: 'الجمعة: 4:00 مساءً - 10:00 مساءً',
        description: 'الوصف',
        fragrance: 'النوتات العطرية',
        topNotes: 'المقدمة',
        heartNotes: 'القلب',
        baseNotes: 'القاعدة',
        story: 'القصة',
        addToCart: 'اطلب هذا العطر',
        galleryTitle: 'عرض فاخر',
        blogTitle: 'مجلة العطور',
        readMore: 'قراءة المزيد',
        testimonialTitle: 'انطباعات العملاء',
        scentFinderTitle: 'اختر عطرك المناسب',
        scentFinderDesc: 'أجب عن ثلاثة أسئلة سريعة لاكتشاف عطر عجمان لكجري الأقرب إلى ذوقك.',
        question1: 'أي طابع عطري يجذبك أكثر؟',
        question2: 'متى سترتديه غالباً؟',
        question3: 'ما مستوى الحضور الذي تفضله؟',
        option1: 'منعش ومصقول',
        option2: 'زهري وأنيق',
        option3: 'خشبي وواثق',
        option4: 'شرقي وعميق',
        option5: 'استخدام يومي',
        option6: 'مناسبات مسائية',
        option7: 'كلاهما',
        option8: 'ناعم وقريب',
        option9: 'واضح وملحوظ',
        option10: 'ثبات طويل وحضور قوي',
        getResult: 'اعرض العطر المناسب',
        perfectMatch: 'العطر الأنسب لك',
        viewProduct: 'عرض العطر',
        backToBlog: 'العودة إلى المجلة',
        footerTagline: 'عطور فاخرة من الإمارات'
    }
};

let products = [
    {
        id: 'council',
        tone: 'noir',
        image: '/images/products/council.jpeg',
        name: { en: 'Council', ar: 'كاونسل' },
        type: { en: 'Extrait de Parfum', ar: 'إكستريت دي بارفان' },
        size: { en: '100 ml', ar: '100 مل' },
        price: { en: 'AED 480', ar: '480 درهم' },
        description: {
            en: 'A dignified oud fragrance with warm spice, amber, and polished woods. Created for formal gatherings and confident presence.',
            ar: 'عطر عود مهيب بنفحات التوابل الدافئة والعنبر والأخشاب المصقولة، صُمم للمجالس والحضور الواثق.'
        },
        topNotes: { en: 'Saffron, bergamot, black pepper', ar: 'زعفران، برغموت، فلفل أسود' },
        heartNotes: { en: 'Oud, rose, incense', ar: 'عود، ورد، بخور' },
        baseNotes: { en: 'Amber, leather, sandalwood', ar: 'عنبر، جلد، صندل' },
        story: {
            en: 'Council reflects the elegance of Emirati hospitality and the authority of a refined signature scent.',
            ar: 'يعكس كاونسل أناقة الضيافة الإماراتية وهيبة العطر الذي يترك توقيعاً راقياً.'
        }
    },
    {
        id: 'first-lady',
        tone: 'rose',
        image: '/images/products/first-lady.jpeg',
        name: { en: 'First Lady', ar: 'فيرست ليدي' },
        type: { en: 'Extrait de Parfum', ar: 'إكستريت دي بارفان' },
        size: { en: '100 ml', ar: '100 مل' },
        price: { en: 'AED 450', ar: '450 درهم' },
        description: {
            en: 'A graceful floral amber perfume with rose, jasmine, vanilla, and soft musk for an elegant feminine trail.',
            ar: 'عطر زهري عنبري راقٍ يجمع الورد والياسمين والفانيلا والمسك الناعم لبصمة أنثوية أنيقة.'
        },
        topNotes: { en: 'Pear, mandarin, pink pepper', ar: 'كمثرى، ماندرين، فلفل وردي' },
        heartNotes: { en: 'Rose, jasmine, orange blossom', ar: 'ورد، ياسمين، زهر البرتقال' },
        baseNotes: { en: 'Vanilla, musk, amber', ar: 'فانيلا، مسك، عنبر' },
        story: {
            en: 'First Lady celebrates soft power: graceful, polished, and memorable without being loud.',
            ar: 'فيرست ليدي يحتفي بالقوة الناعمة: رقي ونعومة وحضور لا يُنسى دون مبالغة.'
        }
    },
    {
        id: 'president',
        tone: 'royal',
        image: '/images/products/president.jpeg',
        name: { en: 'President', ar: 'بريزدنت' },
        type: { en: 'Extrait de Parfum', ar: 'إكستريت دي بارفان' },
        size: { en: '100 ml', ar: '100 مل' },
        price: { en: 'AED 520', ar: '520 درهم' },
        description: {
            en: 'A bold amber woods fragrance with citrus brightness, aromatic herbs, and a deep smoky base.',
            ar: 'عطر عنبري خشبي جريء يبدأ بانتعاش الحمضيات والأعشاب العطرية وينتهي بقاعدة دخانية عميقة.'
        },
        topNotes: { en: 'Grapefruit, cardamom, clary sage', ar: 'جريب فروت، هيل، مريمية' },
        heartNotes: { en: 'Cedarwood, lavender, patchouli', ar: 'خشب الأرز، لافندر، باتشولي' },
        baseNotes: { en: 'Ambergris, vetiver, smoky woods', ar: 'عنبر رمادي، فيتيفر، أخشاب دخانية' },
        story: {
            en: 'President is made for decisive moments, leaving a composed and powerful impression.',
            ar: 'بريزدنت صُمم للحظات الحاسمة، بانطباع متزن وقوي يبقى في الذاكرة.'
        }
    },
    {
        id: 'parliament',
        tone: 'pearl',
        image: '/images/products/parliament.jpeg',
        name: { en: 'Parliament', ar: 'بارليامنت' },
        type: { en: 'Extrait de Parfum', ar: 'إكستريت دي بارفان' },
        size: { en: '100 ml', ar: '100 مل' },
        price: { en: 'AED 500', ar: '500 درهم' },
        description: {
            en: 'A bright musky fragrance with white florals, clean woods, and a refined powdery finish.',
            ar: 'عطر مسكي مشرق بنفحات الزهور البيضاء والأخشاب النظيفة ولمسة بودرية راقية.'
        },
        topNotes: { en: 'Bergamot, neroli, white tea', ar: 'برغموت، نيرولي، شاي أبيض' },
        heartNotes: { en: 'White rose, iris, jasmine', ar: 'ورد أبيض، آيرس، ياسمين' },
        baseNotes: { en: 'Musk, cashmere woods, amber', ar: 'مسك، أخشاب كشمير، عنبر' },
        story: {
            en: 'Parliament is a polished scent for clean elegance and quiet authority.',
            ar: 'بارليامنت عطر مصقول للأناقة النظيفة والحضور الهادئ الواثق.'
        }
    },
    {
        id: 'chairman',
        tone: 'sapphire',
        image: '/images/products/chairman.jpeg',
        name: { en: 'Chairman', ar: 'تشيرمان' },
        type: { en: 'Extrait de Parfum', ar: 'إكستريت دي بارفان' },
        size: { en: '100 ml', ar: '100 مل' },
        price: { en: 'AED 540', ar: '540 درهم' },
        description: {
            en: 'A blue aromatic perfume with citrus, lavender, marine woods, and a confident amber base.',
            ar: 'عطر أزرق عطري يجمع الحمضيات واللافندر والأخشاب البحرية مع قاعدة عنبرية واثقة.'
        },
        topNotes: { en: 'Lemon, mint, grapefruit', ar: 'ليمون، نعناع، جريب فروت' },
        heartNotes: { en: 'Lavender, geranium, marine accord', ar: 'لافندر، جيرانيوم، نفحات بحرية' },
        baseNotes: { en: 'Amber, cedar, vetiver', ar: 'عنبر، أرز، فيتيفر' },
        story: {
            en: 'Chairman is made for modern leadership: crisp, elegant, and memorable.',
            ar: 'تشيرمان صُمم لقيادة عصرية: منعش وأنيق ولا يُنسى.'
        }
    }
];

let posts = [
    {
        id: 'oud-signature',
        date: { en: 'June 2026', ar: 'يونيو 2026' },
        author: { en: 'AJMAN LUXURY', ar: 'عجمان لكجري' },
        title: { en: 'Why Oud Defines Arabian Luxury', ar: 'لماذا يعبّر العود عن الفخامة العربية؟' },
        excerpt: {
            en: 'Oud adds depth, warmth, and unmistakable identity to luxury perfume.',
            ar: 'يمنح العود العطر عمقاً ودفئاً وهوية لا تخطئها الحواس.'
        },
        content: {
            en: 'Oud is more than a note; it is a cultural signature. In luxury perfumery, it gives structure, longevity, and a refined shadow that supports florals, spices, amber, and woods.',
            ar: 'العود ليس مجرد نوتة عطرية، بل توقيع ثقافي. في العطور الفاخرة يمنح التركيبة بنية وثباتاً وظلاً راقياً يساند الورد والتوابل والعنبر والأخشاب.'
        }
    },
    {
        id: 'choose-extrait',
        date: { en: 'May 2026', ar: 'مايو 2026' },
        author: { en: 'AJMAN LUXURY', ar: 'عجمان لكجري' },
        title: { en: 'How to Choose an Extrait de Parfum', ar: 'كيف تختار إكستريت دي بارفان مناسباً؟' },
        excerpt: {
            en: 'Start with occasion, projection, and the notes that feel like your signature.',
            ar: 'ابدأ بالمناسبة وقوة الانتشار والنوتات التي تشبه بصمتك الشخصية.'
        },
        content: {
            en: 'An extrait de parfum is concentrated and expressive. Choose softer floral amber for daytime elegance, oud and spice for gatherings, and woody amber blends for evening confidence.',
            ar: 'الإكستريت دي بارفان مركز ومعبّر. اختر الزهري العنبري الناعم للأناقة اليومية، والعود والتوابل للمجالس، والأخشاب العنبرية للثقة المسائية.'
        }
    }
];

let testimonials = [
    {
        rating: 5,
        name: { en: 'M. Al Nuaimi', ar: 'م. النعيمي' },
        title: { en: 'Ajman', ar: 'عجمان' },
        text: {
            en: 'Council has a luxurious oud trail that lasts beautifully through the evening.',
            ar: 'كاونسل يترك أثراً فاخراً من العود ويثبت بشكل جميل طوال المساء.'
        }
    },
    {
        rating: 5,
        name: { en: 'Sara A.', ar: 'سارة أ.' },
        title: { en: 'Dubai', ar: 'دبي' },
        text: {
            en: 'First Lady is elegant, soft, and perfect for gifting.',
            ar: 'فيرست ليدي عطر أنيق وناعم ومثالي للهدايا.'
        }
    },
    {
        rating: 5,
        name: { en: 'Khalid R.', ar: 'خالد ر.' },
        title: { en: 'Sharjah', ar: 'الشارقة' },
        text: {
            en: 'President feels polished and powerful without becoming heavy.',
            ar: 'بريزدنت عطر مصقول وقوي دون أن يكون ثقيلاً.'
        }
    }
];

let designSettings = {
    ink: '#16110f',
    gold: '#c8a45d',
    paper: '#fffaf3',
    mist: '#f6ece4',
    fontFamily: '"Adobe Arabic Regular", "Adobe Arabic", "Segoe UI", Arial, sans-serif',
    heroOpacity: '0.18',
    cardRadius: '8px',
    heroVideo: ''
};

function ensureDataDir() {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

function readSiteData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return {};
        }

        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (error) {
        console.warn(`Unable to read ${DATA_FILE}: ${error.message}`);
        return {};
    }
}

function applySiteData() {
    const siteData = readSiteData();

    if (siteData.translations) {
        translations = {
            en: { ...translations.en, ...siteData.translations.en },
            ar: { ...translations.ar, ...siteData.translations.ar }
        };
    }

    if (Array.isArray(siteData.products)) {
        products = siteData.products;
    }

    if (Array.isArray(siteData.posts)) {
        posts = siteData.posts;
    }

    if (Array.isArray(siteData.testimonials)) {
        testimonials = siteData.testimonials;
    }

    if (siteData.designSettings) {
        designSettings = { ...designSettings, ...siteData.designSettings };
    }
}

function writeSiteData(siteData) {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(siteData, null, 2), 'utf8');
    applySiteData();
}

function readOrders() {
    try {
        if (!fs.existsSync(ORDERS_FILE)) {
            return [];
        }

        return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    } catch (error) {
        console.warn(`Unable to read ${ORDERS_FILE}: ${error.message}`);
        return [];
    }
}

function writeOrders(orders) {
    ensureDataDir();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

function saveOrder(order) {
    const orders = readOrders();
    orders.unshift(order);
    writeOrders(orders);
    return order;
}

function snapshotSiteData() {
    return {
        translations,
        products,
        posts,
        testimonials,
        designSettings
    };
}

function normalizeList(value) {
    if (!value) {
        return [];
    }

    return Array.isArray(value) ? value : Object.values(value);
}

function normalizeProducts(formProducts) {
    return normalizeList(formProducts).map((product, index) => ({
        id: product.id || `product-${index + 1}`,
        tone: product.tone || 'noir',
        image: product.image || '',
        name: product.name || { en: '', ar: '' },
        type: product.type || { en: '', ar: '' },
        size: product.size || { en: '', ar: '' },
        price: product.price || { en: '', ar: '' },
        description: product.description || { en: '', ar: '' },
        topNotes: product.topNotes || { en: '', ar: '' },
        heartNotes: product.heartNotes || { en: '', ar: '' },
        baseNotes: product.baseNotes || { en: '', ar: '' },
        story: product.story || { en: '', ar: '' }
    })).filter((product) => product.name.en || product.name.ar);
}

function normalizePosts(formPosts) {
    return normalizeList(formPosts).map((post, index) => ({
        id: post.id || `post-${index + 1}`,
        date: post.date || { en: '', ar: '' },
        author: post.author || { en: '', ar: '' },
        title: post.title || { en: '', ar: '' },
        excerpt: post.excerpt || { en: '', ar: '' },
        content: post.content || { en: '', ar: '' }
    })).filter((post) => post.title.en || post.title.ar);
}

function normalizeTestimonials(formTestimonials) {
    return normalizeList(formTestimonials).map((testimonial) => ({
        rating: Number(testimonial.rating) || 5,
        name: testimonial.name || { en: '', ar: '' },
        title: testimonial.title || { en: '', ar: '' },
        text: testimonial.text || { en: '', ar: '' }
    })).filter((testimonial) => testimonial.name.en || testimonial.name.ar);
}

function priceToFils(product) {
    const priceText = product.price?.en || product.price?.ar || '';
    const amount = Number(String(priceText).replace(/[^\d.]/g, '')) || 0;
    return Math.round(amount * 100);
}

function getLocalizedProducts(lang) {
    return products.map((product) => {
        const localized = localizeItem(product, lang);
        localized.priceFils = priceToFils(product);
        return localized;
    });
}

function buildOrderItems(cartItems, lang) {
    return cartItems.map((cartItem) => {
        const product = products.find((item) => item.id === cartItem.id);
        if (!product) {
            return null;
        }

        const quantity = Math.max(1, Math.min(Number(cartItem.quantity) || 1, 20));
        const localized = localizeItem(product, lang);
        const unitAmount = priceToFils(product);

        return {
            id: product.id,
            name: localized.name,
            image: product.image,
            quantity,
            unitAmount,
            lineTotal: unitAmount * quantity
        };
    }).filter(Boolean);
}

applySiteData();

function localizeItem(item, lang) {
    const localized = {};
    Object.entries(item).forEach(([key, value]) => {
        localized[key] = value && typeof value === 'object' && !Array.isArray(value) && lang in value ? value[lang] : value;
    });
    return localized;
}

function pageData(req, extra = {}) {
    return {
        lang: req.lang,
        isRTL: req.isRTL,
        currentPath: req.path,
        t: translations[req.lang],
        designSettings,
        ...extra
    };
}

function renderPage(view, extra = {}) {
    return (req, res) => res.render(view, pageData(req, extra(req.lang)));
}

function parseCookies(cookieHeader = '') {
    return cookieHeader.split(';').reduce((cookies, cookie) => {
        const [rawName, ...rawValue] = cookie.trim().split('=');
        if (!rawName) {
            return cookies;
        }

        cookies[rawName] = decodeURIComponent(rawValue.join('='));
        return cookies;
    }, {});
}

function signSession(username) {
    const payload = Buffer.from(JSON.stringify({
        username,
        expiresAt: Date.now() + (1000 * 60 * 60 * 8)
    })).toString('base64url');
    const signature = crypto
        .createHmac('sha256', SESSION_SECRET)
        .update(payload)
        .digest('base64url');

    return `${payload}.${signature}`;
}

function verifySession(token) {
    if (!token || !token.includes('.')) {
        return false;
    }

    const [payload, signature] = token.split('.');
    const expectedSignature = crypto
        .createHmac('sha256', SESSION_SECRET)
        .update(payload)
        .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return false;
    }

    try {
        const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        return session.username === ADMIN_USERNAME && session.expiresAt > Date.now();
    } catch (error) {
        return false;
    }
}

function requireAdmin(req, res, next) {
    const cookies = parseCookies(req.headers.cookie);
    if (verifySession(cookies[SESSION_COOKIE])) {
        next();
        return;
    }

    res.redirect('/admin/login');
}

function sanitizeUploadName(filename) {
    const extension = path.extname(filename).toLowerCase();
    const basename = path.basename(filename, extension).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    return `${basename || 'hero-video'}-${Date.now()}${extension}`;
}

function parseMultipartUpload(req, fieldName, callback) {
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
        callback(new Error('Missing multipart boundary'));
        return;
    }

    const chunks = [];
    let totalSize = 0;
    const maxSize = 80 * 1024 * 1024;

    req.on('data', (chunk) => {
        totalSize += chunk.length;
        if (totalSize > maxSize) {
            req.destroy();
            callback(new Error('Video is larger than 80MB'));
            return;
        }
        chunks.push(chunk);
    });

    req.on('end', () => {
        const body = Buffer.concat(chunks);
        const boundary = Buffer.from(`--${boundaryMatch[1]}`);
        let cursor = body.indexOf(boundary);

        while (cursor !== -1) {
            const next = body.indexOf(boundary, cursor + boundary.length);
            if (next === -1) {
                break;
            }

            let part = body.subarray(cursor + boundary.length, next);
            if (part.subarray(0, 2).toString() === '\r\n') {
                part = part.subarray(2);
            }
            if (part.subarray(part.length - 2).toString() === '\r\n') {
                part = part.subarray(0, part.length - 2);
            }

            const headerEnd = part.indexOf(Buffer.from('\r\n\r\n'));
            if (headerEnd !== -1) {
                const headers = part.subarray(0, headerEnd).toString('latin1');
                const nameMatch = headers.match(/name="([^"]+)"/);
                const fileMatch = headers.match(/filename="([^"]*)"/);
                const typeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);

                if (nameMatch?.[1] === fieldName && fileMatch?.[1]) {
                    callback(null, {
                        filename: fileMatch[1],
                        contentType: typeMatch?.[1] || 'application/octet-stream',
                        buffer: part.subarray(headerEnd + 4)
                    });
                    return;
                }
            }

            cursor = next;
        }

        callback(new Error('Video field was not found'));
    });

    req.on('error', callback);
}

app.get('/admin/login', (req, res) => {
    res.render('admin-login', {
        error: req.query.error === '1'
    });
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${encodeURIComponent(signSession(username))}; HttpOnly; SameSite=Lax; Path=/admin; Max-Age=28800`);
        res.redirect('/admin');
        return;
    }

    res.redirect('/admin/login?error=1');
});

app.post('/admin/logout', (req, res) => {
    res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/admin; Max-Age=0`);
    res.redirect('/admin/login');
});

app.post('/admin/upload-hero-video', requireAdmin, (req, res) => {
    parseMultipartUpload(req, 'heroVideo', (error, file) => {
        if (error) {
            res.redirect('/admin?upload=error');
            return;
        }

        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        const allowedExtensions = ['.mp4', '.webm', '.ogg'];
        const extension = path.extname(file.filename).toLowerCase();

        if (!allowedTypes.includes(file.contentType) && !allowedExtensions.includes(extension)) {
            res.redirect('/admin?upload=type');
            return;
        }

        fs.mkdirSync(VIDEO_DIR, { recursive: true });
        const filename = sanitizeUploadName(file.filename);
        const uploadPath = path.join(VIDEO_DIR, filename);
        fs.writeFileSync(uploadPath, file.buffer);

        const currentData = snapshotSiteData();
        writeSiteData({
            ...currentData,
            designSettings: {
                ...currentData.designSettings,
                heroVideo: `/videos/${filename}`
            }
        });

        res.redirect('/admin?saved=1');
    });
});

app.get('/admin', requireAdmin, (req, res) => {
    res.render('admin', {
        currentPath: req.path,
        saved: req.query.saved === '1',
        siteData: snapshotSiteData(),
        orders: readOrders()
    });
});

app.post('/admin/save', requireAdmin, (req, res) => {
    const currentData = snapshotSiteData();
    const updatedData = {
        translations: {
            en: { ...currentData.translations.en, ...req.body.translations?.en },
            ar: { ...currentData.translations.ar, ...req.body.translations?.ar }
        },
        products: normalizeProducts(req.body.products),
        posts: normalizePosts(req.body.posts),
        testimonials: normalizeTestimonials(req.body.testimonials),
        designSettings: {
            ...currentData.designSettings,
            ...req.body.designSettings
        }
    };

    writeSiteData(updatedData);
    res.redirect('/admin?saved=1');
});

app.get('/', renderPage('index', (lang) => ({
    products: getLocalizedProducts(lang)
})));

app.get('/about', renderPage('about', () => ({})));

app.get('/contact', renderPage('contact', () => ({})));

app.get('/checkout', renderPage('checkout', (lang) => ({
    products: getLocalizedProducts(lang),
    stripeEnabled: Boolean(STRIPE_SECRET_KEY)
})));

app.get('/checkout/success', (req, res) => {
    res.render('checkout-success', pageData(req, {
        orderId: req.query.order || ''
    }));
});

app.post('/api/checkout', async (req, res) => {
    const lang = req.body.lang === 'ar' ? 'ar' : 'en';
    const items = buildOrderItems(req.body.items || [], lang);
    const customer = req.body.customer || {};

    if (!items.length) {
        res.status(400).json({ error: 'Cart is empty' });
        return;
    }

    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const order = saveOrder({
        id: `AJ-${Date.now()}`,
        status: STRIPE_SECRET_KEY ? 'pending_payment' : 'pending_manual',
        paymentProvider: STRIPE_SECRET_KEY ? 'stripe' : 'manual',
        lang,
        customer: {
            name: customer.name || '',
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || ''
        },
        items,
        total,
        currency: 'AED',
        createdAt: new Date().toISOString()
    });

    if (!STRIPE_SECRET_KEY) {
        res.json({ url: `/checkout/success?order=${order.id}&lang=${lang}`, orderId: order.id });
        return;
    }

    try {
        const params = new URLSearchParams();
        params.append('mode', 'payment');
        params.append('payment_method_types[0]', 'card');
        params.append('success_url', `${SITE_URL}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}&lang=${lang}`);
        params.append('cancel_url', `${SITE_URL}/checkout?cancelled=1&lang=${lang}`);
        params.append('metadata[orderId]', order.id);
        if (order.customer.email) {
            params.append('customer_email', order.customer.email);
        }

        items.forEach((item, index) => {
            params.append(`line_items[${index}][quantity]`, String(item.quantity));
            params.append(`line_items[${index}][price_data][currency]`, 'aed');
            params.append(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmount));
            params.append(`line_items[${index}][price_data][product_data][name]`, item.name);
            if (item.image) {
                params.append(`line_items[${index}][price_data][product_data][images][0]`, `${SITE_URL}${item.image}`);
            }
        });

        const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });
        const session = await stripeResponse.json();

        if (!stripeResponse.ok) {
            throw new Error(session.error?.message || 'Stripe checkout failed');
        }

        res.json({ url: session.url, orderId: order.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to create payment session' });
    }
});

app.get('/products', renderPage('products', (lang) => ({
    products: getLocalizedProducts(lang)
})));

app.get('/product/:id', (req, res) => {
    const product = products.find((item) => item.id === req.params.id);
    if (!product) {
        res.status(404).redirect(`/products?lang=${req.lang}`);
        return;
    }

    res.render('product-detail', pageData(req, {
        product: {
            ...localizeItem(product, req.lang),
            priceFils: priceToFils(product)
        }
    }));
});

app.get('/gallery', renderPage('gallery', (lang) => ({
    products: getLocalizedProducts(lang)
})));

app.get('/blog', renderPage('blog', (lang) => ({
    posts: posts.map((post) => localizeItem(post, lang))
})));

app.get('/blog/:id', (req, res) => {
    const post = posts.find((item) => item.id === req.params.id);
    if (!post) {
        res.status(404).redirect(`/blog?lang=${req.lang}`);
        return;
    }

    res.render('blog-detail', pageData(req, {
        post: localizeItem(post, req.lang)
    }));
});

app.get('/testimonials', renderPage('testimonials', (lang) => ({
    testimonials: testimonials.map((testimonial) => localizeItem(testimonial, lang))
})));

app.get('/scent-finder', renderPage('scent-finder', () => ({})));

app.use((req, res) => {
    res.status(404).redirect(`/?lang=${req.lang}`);
});

app.listen(PORT, () => {
    console.log(`AJMAN LUXURY running on http://localhost:${PORT}`);
});
