/* =========================================================
   بيانات مكتبة دار الوليد + الترجمة (i18n)
   التسعير حسب الموقع: داخل ليبيا = دينار ليبي (د.ل) · خارج ليبيا = دولار ($)
   كل أسعار الكتب مخزّنة بالدينار الليبي (العملة الأساسية) وتُحوَّل عند العرض.
   ========================================================= */
(function (w) {

  /* ---------------- التصنيفات ---------------- */
  const CATEGORIES = [
    { id: 'cat-ar',   slug: 'arabic-novels', name_ar: 'روايات عربية',      name_en: 'Arabic Novels',   icon: '📖' },
    { id: 'cat-tr',   slug: 'translated',    name_ar: 'أدب عالمي مترجم',   name_en: 'World Literature',icon: '🌍' },
    { id: 'cat-self', slug: 'self-dev',      name_ar: 'تنمية ذاتية',       name_en: 'Self Development',icon: '🌱' },
    { id: 'cat-his',  slug: 'history',       name_ar: 'تاريخ وفكر',        name_en: 'History & Ideas', icon: '🏛️' },
    { id: 'cat-poe',  slug: 'poetry',        name_ar: 'شعر وديوان',        name_en: 'Poetry',          icon: '✒️' },
    { id: 'cat-kid',  slug: 'kids',          name_ar: 'كتب الأطفال',       name_en: 'Children',        icon: '🧸' },
    { id: 'cat-rel',  slug: 'religion',      name_ar: 'دين وتراث',         name_en: 'Religion & Heritage', icon: '🕌' },
  ];

  /* ---------------- المناطق (تسعير حسب الموقع، بلا مدن) ----------------
     يُحدَّد الموقع تلقائياً: داخل ليبيا = دينار ليبي (LYD) · أي مكان آخر = دولار (USD). */
  const REGIONS = [
    { id: 'ly',   name_ar: 'ليبيا',       name_en: 'Libya',          currency: 'LYD' },
    { id: 'intl', name_ar: 'خارج ليبيا',  name_en: 'Outside Libya',  currency: 'USD' },
  ];
  function regionById(id) { return REGIONS.find(r => r.id === id) || REGIONS[0]; }

  /* ---------------- الإعدادات ----------------
     usdRate   = كم دينار ليبي يساوي 1 دولار (لتحويل أسعار الدولار).
     shipLibya = رسوم التوصيل داخل ليبيا (بالدينار).
     shipIntl  = رسوم الشحن الدولي خارج ليبيا (بالدولار). */
  const SETTINGS = { usdRate: 5, shipLibya: 5, shipIntl: 25 };

  /* ---------------- كشف موقع المستخدم ----------------
     كشف فوري بلا إنترنت اعتماداً على المنطقة الزمنية (طرابلس → ليبيا). */
  function detectRegionId() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz === 'Africa/Tripoli') return 'ly';
      if ((navigator.language || '').toLowerCase() === 'ar-ly') return 'ly';
      return 'intl';
    } catch (e) { return 'ly'; }
  }
  // كشف دقيق عبر عنوان IP في الخلفية (يرجع 'ly' أو 'intl')، مع مزوّد احتياطي وتجاهل الأخطاء.
  function detectRegionByIP() {
    const get = (url) => fetch(url, { cache: 'no-store' }).then(r => r.ok ? r.text() : '').catch(() => '');
    return get('https://ipapi.co/country/')
      .then(t => {
        const c = (t || '').trim().toUpperCase();
        if (c && c.length <= 3) return c;                 // رمز دولة صالح
        // مزوّد احتياطي
        return get('https://ipwho.is/?fields=country_code')
          .then(t2 => { try { return (JSON.parse(t2).country_code || '').toUpperCase(); } catch (e) { return ''; } });
      })
      .then(code => code ? (code === 'LY' ? 'ly' : 'intl') : null)
      .catch(() => null);
  }

  /* ---------------- الكتب ----------------
     priceOverrides: سعر صريح لبعض المدن (النموذج أ). الفارغ = السعر الأساسي. */
  const BOOKS = [
    {
      id: 'b1', title_ar: 'موسم الهجرة إلى الشمال', title_en: 'Season of Migration to the North',
      author_ar: 'الطيب صالح', author_en: 'Tayeb Salih', cat: 'cat-ar', cover: 'cv-maroon',
      pub: 'AlWalid', cover_note: 'cover: ochre desert + nile silhouette',
      base_price: 35, stock: 14, isbn: '9789953701004', year: 1966, pages: 169,
      is_active: true, rating: 4.8, isNew: false, isBestseller: true, isFeatured: true,
      desc_ar: 'رائعة الأدب العربي الحديث عن الصراع بين الشرق والغرب، والهوية والاغتراب، عبر حكاية مصطفى سعيد العائد من لندن إلى قرية على ضفاف النيل.',
      overrides: { 'loc-ben': 38, 'loc-sab': 40 }
    },
    {
      id: 'b2', title_ar: 'ساق البامبو', title_en: 'The Bamboo Stalk',
      author_ar: 'سعود السنعوسي', author_en: 'Saud Alsanousi', cat: 'cat-ar', cover: 'cv-forest',
      pub: 'AlWalid', cover_note: 'cover: green bamboo + passport stamp',
      base_price: 42, stock: 9, isbn: '9789953688374', year: 2012, pages: 395,
      is_active: true, rating: 4.7, isNew: false, isBestseller: true, isFeatured: false,
      desc_ar: 'رواية فائزة بالبوكر العربية تتناول قضايا الهوية والانتماء عبر قصة عيسى/خوسيه بين الكويت والفلبين.',
      overrides: { 'loc-ben': 45 }
    },
    {
      id: 'b3', title_ar: 'مئة عام من العزلة', title_en: 'One Hundred Years of Solitude',
      author_ar: 'غابرييل غارثيا ماركيز', author_en: 'G. García Márquez', cat: 'cat-tr', cover: 'cv-amber',
      pub: 'مترجم', cover_note: 'cover: yellow butterflies + macondo',
      base_price: 48, stock: 6, isbn: '9789953214733', year: 1967, pages: 432,
      is_active: true, rating: 4.9, isNew: false, isBestseller: true, isFeatured: true,
      desc_ar: 'ملحمة عائلة بوينديا في ماكوندو، وأحد أعظم أعمال الواقعية السحرية في الأدب العالمي.',
      overrides: { 'loc-sab': 52, 'loc-bay': 50 }
    },
    {
      id: 'b4', title_ar: 'الخيميائي', title_en: 'The Alchemist',
      author_ar: 'باولو كويلو', author_en: 'Paulo Coelho', cat: 'cat-tr', cover: 'cv-sea',
      pub: 'مترجم', cover_note: 'cover: pyramids + desert sun',
      base_price: 30, stock: 22, isbn: '9789953290034', year: 1988, pages: 197,
      is_active: true, rating: 4.5, isNew: false, isBestseller: true, isFeatured: false,
      desc_ar: 'رحلة الراعي الأندلسي سانتياغو بحثاً عن كنزه وأسطورته الشخصية — حكمة في ثوب رواية.',
      overrides: {}
    },
    {
      id: 'b5', title_ar: 'أرض السواد', title_en: 'Land of Black',
      author_ar: 'عبد الرحمن منيف', author_en: 'A. Munif', cat: 'cat-ar', cover: 'cv-ink',
      pub: 'AlWalid', cover_note: 'cover: dark earth + oil derrick',
      base_price: 55, stock: 4, isbn: '9789953684512', year: 1999, pages: 520,
      is_active: true, rating: 4.6, isNew: false, isBestseller: false, isFeatured: false,
      desc_ar: 'لوحة تاريخية واسعة عن بغداد ومجتمعها في مطلع القرن، بقلم صاحب «مدن الملح».',
      overrides: { 'loc-ben': 58 }
    },
    {
      id: 'b6', title_ar: 'فرانكشتاين في بغداد', title_en: 'Frankenstein in Baghdad',
      author_ar: 'أحمد سعداوي', author_en: 'Ahmed Saadawi', cat: 'cat-ar', cover: 'cv-rust',
      pub: 'AlWalid', cover_note: 'cover: stitched figure + city ruins',
      base_price: 40, stock: 11, isbn: '9789953688947', year: 2013, pages: 351,
      is_active: true, rating: 4.4, isNew: true, isBestseller: false, isFeatured: false,
      desc_ar: 'رواية فائزة بالبوكر العربية، تمزج الواقع بالخيال في بغداد ما بعد 2003.',
      overrides: {}
    },
    {
      id: 'b7', title_ar: 'النبي', title_en: 'The Prophet',
      author_ar: 'جبران خليل جبران', author_en: 'Kahlil Gibran', cat: 'cat-poe', cover: 'cv-navy',
      pub: 'AlWalid', cover_note: 'cover: robed figure + cedar',
      base_price: 25, stock: 30, isbn: '9789953701219', year: 1923, pages: 96,
      is_active: true, rating: 4.8, isNew: false, isBestseller: true, isFeatured: true,
      desc_ar: 'تأملات المصطفى في الحب والعمل والفرح والحزن — درّة الأدب المهجري الخالدة.',
      overrides: {}
    },
    {
      id: 'b8', title_ar: 'ذاكرة الجسد', title_en: 'The Bridges of Constantine',
      author_ar: 'أحلام مستغانمي', author_en: 'Ahlam Mosteghanemi', cat: 'cat-ar', cover: 'cv-wine',
      pub: 'AlWalid', cover_note: 'cover: bridge of constantine + ink',
      base_price: 38, stock: 8, isbn: '9789953681092', year: 1993, pages: 423,
      is_active: true, rating: 4.6, isNew: false, isBestseller: false, isFeatured: false,
      desc_ar: 'رواية الحب والثورة والجزائر بلغة شاعرية آسرة، أوّل ثلاثية مستغانمي.',
      overrides: { 'loc-mis': 40 }
    },
    {
      id: 'b9', title_ar: 'العادات الذرية', title_en: 'Atomic Habits',
      author_ar: 'جيمس كلير', author_en: 'James Clear', cat: 'cat-self', cover: 'cv-teal',
      pub: 'مترجم', cover_note: 'cover: clean teal + arrow',
      base_price: 45, stock: 18, isbn: '9786035022884', year: 2018, pages: 320,
      is_active: true, rating: 4.7, isNew: true, isBestseller: true, isFeatured: true,
      desc_ar: 'دليل عملي لبناء العادات الجيدة وكسر السيئة عبر تغييرات صغيرة بنسبة 1٪.',
      overrides: { 'loc-ben': 48, 'loc-sab': 50 }
    },
    {
      id: 'b10', title_ar: 'فن اللامبالاة', title_en: 'The Subtle Art of Not Giving a F*ck',
      author_ar: 'مارك مانسون', author_en: 'Mark Manson', cat: 'cat-self', cover: 'cv-clay',
      pub: 'مترجم', cover_note: 'cover: bold orange + black',
      base_price: 38, stock: 16, isbn: '9786030505388', year: 2016, pages: 224,
      is_active: true, rating: 4.3, isNew: false, isBestseller: true, isFeatured: false,
      desc_ar: 'مقاربة معاكسة للتنمية الذاتية: اختر بعناية ما يستحق اهتمامك حقاً.',
      overrides: {}
    },
    {
      id: 'b11', title_ar: 'البؤساء', title_en: 'Les Misérables',
      author_ar: 'فيكتور هوغو', author_en: 'Victor Hugo', cat: 'cat-tr', cover: 'cv-plum',
      pub: 'مترجم', cover_note: 'cover: paris barricade + lantern',
      base_price: 60, stock: 5, isbn: '9789953290157', year: 1862, pages: 1232,
      is_active: true, rating: 4.8, isNew: false, isBestseller: false, isFeatured: false,
      desc_ar: 'ملحمة جان فالجان والعدالة والرحمة في فرنسا القرن التاسع عشر.',
      overrides: { 'loc-bay': 64 }
    },
    {
      id: 'b12', title_ar: 'الأسود يليق بكِ', title_en: 'Black Suits You',
      author_ar: 'أحلام مستغانمي', author_en: 'Ahlam Mosteghanemi', cat: 'cat-ar', cover: 'cv-ink',
      pub: 'AlWalid', cover_note: 'cover: black dress silhouette + gold',
      base_price: 36, stock: 0, isbn: '9789953688756', year: 2012, pages: 384,
      is_active: true, rating: 4.4, isNew: false, isBestseller: false, isFeatured: false,
      desc_ar: 'قصة حب بين مغنية جزائرية ورجل أعمال، بقلم مستغانمي الشاعري.',
      overrides: {}
    },
    {
      id: 'b13', title_ar: 'كافكا على الشاطئ', title_en: 'Kafka on the Shore',
      author_ar: 'هاروكي موراكامي', author_en: 'Haruki Murakami', cat: 'cat-tr', cover: 'cv-sea',
      pub: 'مترجم', cover_note: 'cover: cat + waves + moon',
      base_price: 44, stock: 7, isbn: '9789953290249', year: 2002, pages: 505,
      is_active: true, rating: 4.5, isNew: true, isBestseller: false, isFeatured: false,
      desc_ar: 'رحلة سوريالية تتقاطع فيها حياة صبي هارب ورجل عجوز يكلّم القطط.',
      overrides: {}
    },
    {
      id: 'b14', title_ar: 'حديقة الحروف', title_en: 'Garden of Letters',
      author_ar: 'إعداد دار الوليد', author_en: 'AlWalid Press', cat: 'cat-kid', cover: 'cv-amber',
      pub: 'AlWalid', cover_note: 'cover: playful alphabet + animals',
      base_price: 18, stock: 40, isbn: '9789953000010', year: 2022, pages: 48,
      is_active: true, rating: 4.6, isNew: true, isBestseller: false, isFeatured: false,
      desc_ar: 'كتاب تعليمي مصوّر للحروف العربية للأطفال، من إصدارات دار الوليد.',
      overrides: {}
    },
    {
      id: 'b15', title_ar: 'تاريخ ليبيا الحديث', title_en: 'Modern History of Libya',
      author_ar: 'د. علي محمد', author_en: 'Dr. Ali Mohamed', cat: 'cat-his', cover: 'cv-olive',
      pub: 'AlWalid', cover_note: 'cover: map of libya + sepia photo',
      base_price: 50, stock: 12, isbn: '9789953000027', year: 2019, pages: 410,
      is_active: true, rating: 4.5, isNew: false, isBestseller: false, isFeatured: true,
      desc_ar: 'دراسة موثّقة لتاريخ ليبيا منذ أواخر العهد العثماني حتى اليوم.',
      overrides: { 'loc-ben': 52, 'loc-mis': 51 }
    },
    {
      id: 'b16', title_ar: 'ديوان المتنبي', title_en: 'Diwan al-Mutanabbi',
      author_ar: 'أبو الطيب المتنبي', author_en: 'Al-Mutanabbi', cat: 'cat-poe', cover: 'cv-wine',
      pub: 'AlWalid', cover_note: 'cover: classical calligraphy + gold border',
      base_price: 33, stock: 15, isbn: '9789953000034', year: 950, pages: 560,
      is_active: true, rating: 4.9, isNew: false, isBestseller: false, isFeatured: false,
      desc_ar: 'الديوان الكامل لأمير الشعراء أبي الطيب المتنبي، بتحقيق وشرح.',
      overrides: {}
    },
    {
      id: 'b17', title_ar: 'قوة الآن', title_en: 'The Power of Now',
      author_ar: 'إيكهارت تول', author_en: 'Eckhart Tolle', cat: 'cat-self', cover: 'cv-teal',
      pub: 'مترجم', cover_note: 'cover: calm gradient + sun',
      base_price: 40, stock: 13, isbn: '9786030505012', year: 1997, pages: 236,
      is_active: true, rating: 4.4, isNew: false, isBestseller: false, isFeatured: false,
      desc_ar: 'دليل روحي للعيش في اللحظة الحاضرة والتحرّر من ضجيج العقل.',
      overrides: {}
    },
    {
      id: 'b18', title_ar: 'رياض الصالحين', title_en: 'Riyad as-Salihin',
      author_ar: 'الإمام النووي', author_en: 'Imam al-Nawawi', cat: 'cat-rel', cover: 'cv-forest',
      pub: 'AlWalid', cover_note: 'cover: green + gold geometric',
      base_price: 28, stock: 25, isbn: '9789953000041', year: 1273, pages: 700,
      is_active: true, rating: 4.9, isNew: false, isBestseller: true, isFeatured: false,
      desc_ar: 'من أشهر كتب الحديث النبوي وأكثرها تداولاً، بتحقيق وتخريج.',
      overrides: {}
    },
  ];

  /* ---------------- تفاصيل المنتج (على غرار صفحة كتاب في متجر عالمي) ----------------
     نملأ الحقول الناقصة بقيم افتراضية معقولة حتى تبقى كل الكتب صالحة. */
  const TRANSLATORS = { b3: 'صالح علماني', b4: 'بهاء طاهر', b11: 'منير البعلبكي' };
  function normalizeBook(b) {
    const isTrans = b.pub === 'مترجم';
    const big = b.pages > 520;
    const defs = {
      subtitle_ar: '',
      image: '',
      price_usd: convertFromLyd(b.base_price || 0, 'USD', SETTINGS.usdRate),
      translator_ar: isTrans ? (TRANSLATORS[b.id] || 'قسم الترجمة بدار الوليد') : '',
      language_ar: isTrans ? 'العربية (مترجمة عن لغتها الأصلية)' : 'العربية',
      format_ar: big ? 'غلاف مُجلّد' : 'غلاف ورقي',
      edition_ar: 'الطبعة الأولى',
      dimensions: b.cat === 'cat-kid' ? '21 × 24 سم' : '14 × 21.5 سم',
      weight_g: Math.round((b.pages || 100) * 1.6),
      reviews_count: Math.max(11, ((b.pages || 100) % 130) + Math.round((b.rating || 0) * 9) + 14),
      publisher_ar: isTrans ? 'دار الوليد — قسم الترجمة' : 'دار الوليد للنشر والتوزيع',
    };
    for (const k in defs) if (b[k] === undefined || b[k] === null) b[k] = defs[k];
    return b;
  }
  BOOKS.forEach(normalizeBook);

  /* ---------------- منطق التسعير حسب الموقع + العملة ---------------- */
  // عملة موقع معيّن (افتراضياً الدينار الليبي)
  function currencyOf(loc) { return (loc && loc.currency) || 'LYD'; }

  // رمز العملة حسب اللغة
  function symbolFor(currency, lang) {
    if (currency === 'USD') return '$';
    return lang === 'ar' ? 'د.ل' : 'LYD';
  }

  // تحويل مبلغ بالدينار الليبي إلى عملة العرض (يُقرَّب لرقم صحيح)
  function convertFromLyd(lyd, currency, rate) {
    if (currency === 'USD') {
      const r = rate > 0 ? rate : 5;
      return Math.max(1, Math.round(lyd / r));
    }
    return lyd;
  }

  // السعر الأساسي بالدينار (يُستخدم في فلتر السعر بالكتالوج)
  function basePriceLyd(book) { return book.base_price; }

  // سعر الكتاب بعملة المنطقة:
  //  ليبيا → السعر بالدينار (base_price)
  //  خارج ليبيا → السعر بالدولار الصريح (price_usd) إن وُجد، وإلا يُحوَّل من الدينار بسعر الصرف
  function priceFor(book, region, rate) {
    if (currencyOf(region) === 'USD') {
      const usd = Number(book.price_usd);
      return usd > 0 ? usd : convertFromLyd(book.base_price || 0, 'USD', rate);
    }
    return book.base_price;
  }

  /* ---------------- الترجمة ---------------- */
  const I18N = {
    ar: {
      dir: 'rtl', name: 'مكتبة دار الوليد', tagline: 'طباعة · نشر · توزيع',
      search_ph: 'ابحث عن كتاب أو مؤلف…', cart: 'السلة', choose_city: 'اختر مدينتك', city: 'المدينة',
      nav_home: 'الرئيسية', nav_catalog: 'الكتب', nav_cats: 'التصنيفات', nav_about: 'عن المكتبة',
      add_cart: 'أضف للسلة', in_cart: 'في السلة', out_stock: 'غير متوفر', in_stock: 'متوفر',
      starts_from: 'يبدأ من', price_by_city: 'السعر حسب مدينتك', sar: 'د.ل',
      new: 'وصل حديثاً', best: 'الأكثر مبيعاً', featured: 'مميّز', browse: 'تصفّح الكل',
      related: 'كتب ذات صلة', author: 'المؤلف', pages: 'صفحة', isbn: 'ردمك', year: 'سنة النشر',
      qty: 'الكمية', subtotal: 'الإجمالي الفرعي', shipping: 'التوصيل', total: 'الإجمالي',
      checkout: 'إتمام الطلب', empty_cart: 'سلّتك فارغة', empty_cart_sub: 'تصفّح الكتب وأضِف ما يعجبك',
      send_wa: 'إرسال الطلب عبر واتساب', remove: 'حذف', continue: 'متابعة التسوّق',
      sort: 'الترتيب', filter: 'تصفية', results: 'نتيجة', no_results: 'لا نتائج',
      admin: 'لوحة الإدارة', login: 'تسجيل الدخول',
    },
    en: {
      dir: 'ltr', name: 'Dar AlWalid Bookstore', tagline: 'Print · Publish · Distribute',
      search_ph: 'Search for a book or author…', cart: 'Cart', choose_city: 'Choose your city', city: 'City',
      nav_home: 'Home', nav_catalog: 'Books', nav_cats: 'Categories', nav_about: 'About',
      add_cart: 'Add to cart', in_cart: 'In cart', out_stock: 'Out of stock', in_stock: 'In stock',
      starts_from: 'from', price_by_city: 'Price by your city', sar: 'LYD',
      new: 'New Arrivals', best: 'Bestsellers', featured: 'Featured', browse: 'Browse all',
      related: 'Related books', author: 'Author', pages: 'pages', isbn: 'ISBN', year: 'Year',
      qty: 'Qty', subtotal: 'Subtotal', shipping: 'Shipping', total: 'Total',
      checkout: 'Checkout', empty_cart: 'Your cart is empty', empty_cart_sub: 'Browse books and add what you like',
      send_wa: 'Send order via WhatsApp', remove: 'Remove', continue: 'Continue shopping',
      sort: 'Sort', filter: 'Filter', results: 'results', no_results: 'No results',
      admin: 'Admin', login: 'Sign in',
    }
  };

  const STORE_INFO = {
    whatsapp: '218913248283',       // رقم المكتبة (ليبيا)
    phone: '0913248283',
    address: 'أمام الباب الخلفي لجامعة طرابلس',
    city: 'طرابلس، ليبيا',
    facebook: 'مكتبة دار الوليد',
  };

  w.WALID_DATA = {
    CATEGORIES, REGIONS, BOOKS, SETTINGS, I18N, STORE_INFO,
    priceFor, basePriceLyd, currencyOf, symbolFor, convertFromLyd, normalizeBook,
    regionById, detectRegionId, detectRegionByIP,
  };
})(window);
