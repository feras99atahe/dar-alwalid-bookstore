/* =========================================================
   مخزن الحالة — سلة، موقع، لغة، طلبات، كتب (قابلة للتعديل من الإدارة)
   نمط pub/sub + hook لـ React، مع حفظ في localStorage
   ========================================================= */
(function (w) {
  const D = w.WALID_DATA;
  const LS = 'walid_state_v3';

  function load() {
    try {
      const raw = localStorage.getItem(LS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  const saved = load() || {};

  const state = {
    lang: saved.lang || 'ar',
    region: saved.region || D.detectRegionId(),   // 'ly' | 'intl' (كشف تلقائي)
    regionLocked: saved.regionLocked || false,    // اختار المستخدم يدوياً؟ (يمنع التجاوز التلقائي)
    cart: saved.cart || [],                  // [{bookId, qty}]
    orders: saved.orders || seedOrders(),    // طلبات الإدارة
    books: saved.books || clone(D.BOOKS),
    regions: clone(D.REGIONS),
    categories: clone(D.CATEGORIES),
    settings: saved.settings || clone(D.SETTINGS),
    admin: saved.admin || { authed: false },
    toast: null,
    orderSeq: saved.orderSeq || 43,
  };
  // إكمال أي إعدادات ناقصة من نسخة أقدم
  state.settings = Object.assign(clone(D.SETTINGS), state.settings);

  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  // املأ تفاصيل المنتج الناقصة في أي كتب محفوظة من نسخة أقدم
  state.books.forEach(b => D.normalizeBook(b));

  function seedOrders() {
    const now = Date.now();
    const h = 3600e3;
    return [
      { id:'o1', order_number:'WD-2026-0041', customer_name:'أحمد الفيتوري', customer_phone:'0913248111',
        region:'ly', city:'طرابلس', address:'حي الأندلس، شارع جامع الخلفاء', notes:'يفضّل التوصيل مساءً',
        items:[{book_id:'b9', title:'العادات الذرية', price:45, qty:1},{book_id:'b1', title:'موسم الهجرة إلى الشمال', price:35, qty:1}],
        subtotal:80, shipping:5, total:85, currency:'LYD', status:'جديد', whatsapp_sent_at:null, created_at: now-1.5*h },
      { id:'o2', order_number:'WD-2026-0040', customer_name:'Sara Ahmed', customer_phone:'+447700900022',
        region:'intl', city:'London, UK', address:'45 Baker Street, London', notes:'',
        items:[{book_id:'b3', title:'مئة عام من العزلة', price:10, qty:2}],
        subtotal:20, shipping:25, total:45, currency:'USD', status:'مؤكّد', whatsapp_sent_at: now-20*h, created_at: now-22*h },
      { id:'o3', order_number:'WD-2026-0039', customer_name:'خالد العبيدي', customer_phone:'0918889900',
        region:'ly', city:'مصراتة', address:'وسط المدينة', notes:'هدية — رجاءً تغليف',
        items:[{book_id:'b7', title:'النبي', price:25, qty:1},{book_id:'b18', title:'رياض الصالحين', price:28, qty:1}],
        subtotal:53, shipping:5, total:58, currency:'LYD', status:'تم الشحن', whatsapp_sent_at: now-50*h, created_at: now-52*h },
      { id:'o4', order_number:'WD-2026-0038', customer_name:'سارة المبروك', customer_phone:'0913330044',
        region:'ly', city:'طرابلس', address:'سوق الجمعة', notes:'',
        items:[{book_id:'b4', title:'الخيميائي', price:30, qty:1}],
        subtotal:30, shipping:5, total:35, currency:'LYD', status:'تم التسليم', whatsapp_sent_at: now-90*h, created_at: now-92*h },
      { id:'o5', order_number:'WD-2026-0037', customer_name:'عمر الدرسي', customer_phone:'0924445566',
        region:'ly', city:'الزاوية', address:'شارع الجمهورية', notes:'',
        items:[{book_id:'b10', title:'فن اللامبالاة', price:38, qty:1}],
        subtotal:38, shipping:5, total:43, currency:'LYD', status:'تم التواصل', whatsapp_sent_at: now-4*h, created_at: now-5*h },
    ];
  }

  const listeners = new Set();
  function emit() {
    persist();
    listeners.forEach(fn => fn());
  }
  function persist() {
    try {
      localStorage.setItem(LS, JSON.stringify({
        lang: state.lang, region: state.region, regionLocked: state.regionLocked, cart: state.cart,
        orders: state.orders, books: state.books,
        settings: state.settings, admin: state.admin, orderSeq: state.orderSeq,
      }));
    } catch (e) {}
  }

  /* ---------- محدّدات / getters ---------- */
  function t(key) { return (D.I18N[state.lang] && D.I18N[state.lang][key]) || key; }
  function book(id) { return state.books.find(b => b.id === id); }
  function category(id) { return state.categories.find(c => c.id === id); }
  function rate() { return (state.settings && state.settings.usdRate) || 5; }
  // المنطقة النشطة (ليبيا / خارج ليبيا)
  function region() { return D.regionById(state.region); }
  function regionName(id) { const r = D.regionById(id || state.region); return state.lang === 'ar' ? r.name_ar : r.name_en; }
  function isLibya() { return state.region === 'ly'; }
  function activeCurrency() { return D.currencyOf(region()); }
  // رمز عملة المنطقة النشطة (للعرض في الواجهة)
  function cur() { return D.symbolFor(activeCurrency(), state.lang); }
  // سعر الكتاب بعملة المنطقة النشطة
  function priceFor(b) { return D.priceFor(b, region(), rate()); }

  function cartDetailed() {
    return state.cart.map(ci => {
      const b = book(ci.bookId);
      const unit = priceFor(b);
      return { ...ci, book: b, unit, line: unit * ci.qty };
    }).filter(x => x.book);
  }
  function cartCount() { return state.cart.reduce((s, i) => s + i.qty, 0); }
  function cartSubtotal() { return cartDetailed().reduce((s, i) => s + i.line, 0); }
  // رسوم التوصيل بعملة المنطقة النشطة (ليبيا بالدينار · خارجها بالدولار)
  function shipping() {
    return isLibya() ? (state.settings.shipLibya || 0) : (state.settings.shipIntl || 0);
  }
  function cartTotal() { return cartSubtotal() + (state.cart.length ? shipping() : 0); }

  /* ---------- إجراءات ---------- */
  const actions = {
    setLang(l) {
      state.lang = l;
      document.documentElement.lang = l;
      document.documentElement.dir = D.I18N[l].dir;
      emit();
    },
    toggleLang() { actions.setLang(state.lang === 'ar' ? 'en' : 'ar'); },
    // تعيين المنطقة يدوياً (يقفل الكشف التلقائي)
    setRegion(id, opts) {
      if (id !== 'ly' && id !== 'intl') return;
      const changed = state.region !== id;
      state.region = id;
      if (!opts || opts.lock !== false) state.regionLocked = true;
      if (changed && state.cart.length > 0) {
        actions.toast(state.lang === 'ar'
          ? `تم تحديث الأسعار — ${regionName(id)}`
          : `Prices updated — ${regionName(id)}`);
      }
      emit();
    },
    // كشف تلقائي عبر IP (يُستدعى مرة عند الإقلاع، لا يتجاوز اختيار المستخدم)
    autoDetectRegion() {
      if (state.regionLocked) return;
      D.detectRegionByIP().then(id => {
        if (id && !state.regionLocked && id !== state.region) {
          state.region = id; emit();
        }
      });
    },
    addToCart(bookId, qty = 1) {
      const b = book(bookId);
      if (!b || b.stock <= 0) return;
      const ex = state.cart.find(i => i.bookId === bookId);
      if (ex) ex.qty = Math.min(ex.qty + qty, Math.max(b.stock, 1));
      else state.cart.push({ bookId, qty: Math.min(qty, b.stock) });
      actions.toast(state.lang === 'ar' ? 'أُضيف إلى السلة ✓' : 'Added to cart ✓');
      emit();
    },
    setQty(bookId, qty) {
      const item = state.cart.find(i => i.bookId === bookId);
      if (!item) return;
      if (qty <= 0) { actions.removeFromCart(bookId); return; }
      const b = book(bookId);
      item.qty = b ? Math.min(qty, Math.max(b.stock, 1)) : qty;
      emit();
    },
    removeFromCart(bookId) {
      state.cart = state.cart.filter(i => i.bookId !== bookId);
      emit();
    },
    clearCart() { state.cart = []; emit(); },
    toast(msg) {
      state.toast = { msg, id: Date.now() };
      emit();
      clearTimeout(actions._tt);
      actions._tt = setTimeout(() => { state.toast = null; emit(); }, 2600);
    },
    // إنشاء طلب (يُحفظ قبل واتساب)
    createOrder(form) {
      const num = 'WD-2026-' + String(state.orderSeq).padStart(4, '0');
      state.orderSeq += 1;
      const items = cartDetailed().map(ci => ({
        book_id: ci.bookId, title: ci.book.title_ar, price: ci.unit, qty: ci.qty,
      }));
      const order = {
        id: 'o' + Date.now(), order_number: num,
        customer_name: form.name, customer_phone: form.phone,
        region: state.region, city: form.city || '', address: form.address, notes: form.notes || '',
        items, subtotal: cartSubtotal(), shipping: shipping(), total: cartTotal(),
        currency: activeCurrency(),
        status: 'جديد', whatsapp_sent_at: null, created_at: Date.now(),
      };
      state.orders.unshift(order);
      emit();
      return order;
    },
    markWhatsappSent(orderId) {
      const o = state.orders.find(x => x.id === orderId);
      if (o) { o.whatsapp_sent_at = Date.now(); emit(); }
    },
    setOrderStatus(orderId, status) {
      const o = state.orders.find(x => x.id === orderId);
      if (o) { o.status = status; emit(); }
    },
    /* ----- إدارة الكتب ----- */
    saveBook(data) {
      if (data.id && book(data.id)) {
        Object.assign(book(data.id), data);
      } else {
        const id = 'b' + Date.now();
        const nb = { id, rating: 0, isNew: true, isBestseller: false, isFeatured: false, overrides: {}, ...data };
        D.normalizeBook(nb);
        state.books.unshift(nb);
      }
      emit();
    },
    softDeleteBook(id) { const b = book(id); if (b) { b.is_active = false; emit(); } },
    // استيراد مجمّع: قائمة كتب (من CSV/JSON) — يرجع عدد المُضاف
    importBooks(list) {
      let n = 0;
      (list || []).forEach((data, idx) => {
        if (!data || !String(data.title_ar || data.title_en || '').trim()) return;
        const id = 'b' + Date.now() + '_' + idx + Math.random().toString(36).slice(2, 5);
        const nb = {
          id, cat: data.cat || state.categories[0].id, base_price: 0, price_usd: 0, stock: 0, year: 2024, pages: 100,
          rating: 0, isNew: true, isBestseller: false, isFeatured: false, is_active: true,
          pub: 'AlWalid', cover: 'cv-maroon', image: '', ...data,
        };
        nb.base_price = Number(nb.base_price) || 0;
        nb.price_usd = Number(nb.price_usd) || 0;
        nb.stock = Number(nb.stock) || 0;
        nb.year = Number(nb.year) || 2024;
        nb.pages = Number(nb.pages) || 100;
        if (nb.weight_g != null && nb.weight_g !== '') nb.weight_g = Number(nb.weight_g) || undefined;
        nb.title_en = nb.title_en || nb.title_ar;
        nb.author_en = nb.author_en || nb.author_ar || '';
        D.normalizeBook(nb);
        state.books.unshift(nb);
        n++;
      });
      emit();
      return n;
    },
    /* ----- الإعدادات (سعر الصرف + الشحن) ----- */
    setUsdRate(v) {
      const n = Number(v);
      if (n > 0) { state.settings = { ...state.settings, usdRate: n }; emit(); }
    },
    setShipLibya(v) {
      const n = Number(v);
      if (n >= 0) { state.settings = { ...state.settings, shipLibya: n }; emit(); }
    },
    setShipIntl(v) {
      const n = Number(v);
      if (n >= 0) { state.settings = { ...state.settings, shipIntl: n }; emit(); }
    },
    /* ----- إدارة ----- */
    adminLogin(email, pass) {
      if (email && pass && pass.length >= 4) { state.admin = { authed: true, email }; emit(); return true; }
      return false;
    },
    adminLogout() { state.admin = { authed: false }; emit(); },
    resetAll() { localStorage.removeItem(LS); location.reload(); },
  };

  /* ---------- بناء رسالة واتساب ---------- */
  function buildWhatsappText(order) {
    const rn = D.regionById(order.region).name_ar;
    const c = D.symbolFor(order.currency || 'LYD', 'ar');
    const lines = order.items.map((it, i) =>
      `${i + 1}) ${it.title} × ${it.qty} = ${it.price * it.qty} ${c}`).join('\n');
    return [
      '🛒 طلب جديد — مكتبة دار الوليد', '',
      `رقم الطلب: ${order.order_number}`,
      `الاسم: ${order.customer_name}`,
      `الجوال: ${order.customer_phone}`,
      `المنطقة: ${rn}`,
      order.city ? `المدينة: ${order.city}` : null,
      `العنوان: ${order.address}`,
      order.notes ? `ملاحظات: ${order.notes}` : null, '',
      '——— الطلب ———', lines, '',
      `الإجمالي الفرعي: ${order.subtotal} ${c}`,
      `التوصيل: ${order.shipping} ${c}`,
      `الإجمالي: ${order.total} ${c}`,
    ].filter(x => x !== null).join('\n');
  }
  function whatsappURL(order) {
    return `https://wa.me/${D.STORE_INFO.whatsapp}?text=${encodeURIComponent(buildWhatsappText(order))}`;
  }

  /* ---------- React hook ---------- */
  function useStore() {
    const [, force] = React.useReducer(x => x + 1, 0);
    React.useEffect(() => {
      listeners.add(force);
      return () => listeners.delete(force);
    }, []);
    return {
      state, t, book, category, priceFor,
      rate, region, regionName, isLibya, activeCurrency, cur,
      cartDetailed, cartCount, cartSubtotal, shipping, cartTotal,
      buildWhatsappText, whatsappURL, ...actions,
    };
  }

  // ضبط الاتجاه الابتدائي
  document.documentElement.lang = state.lang;
  document.documentElement.dir = D.I18N[state.lang].dir;

  w.useWalidStore = useStore;
  w.WALID_STORE = { state, actions, t, whatsappURL, buildWhatsappText };
})(window);
