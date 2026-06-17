/* =========================================================
   مكوّنات مشتركة — أيقونات، هيدر، أداة الموقع، بطاقات الكتب
   ========================================================= */
const { useState, useEffect, useRef, useMemo } = React;

/* ---------------- أيقونات ---------------- */
const Ic = {
  search: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  cart: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2.2l2 12.5h11l1.8-9H6"/></svg>,
  pin: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>,
  chevD: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m6 9 6 6 6-6"/></svg>,
  chevL: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m15 18-6-6 6-6"/></svg>,
  chevR: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m9 18 6-6-6-6"/></svg>,
  plus: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  minus: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" {...p}><path d="M5 12h14"/></svg>,
  trash: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>,
  wa: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12.02 2C6.6 2 2.2 6.39 2.2 11.8c0 1.93.52 3.74 1.42 5.3L2 22l5.06-1.58a9.78 9.78 0 0 0 4.96 1.35h.01c5.41 0 9.81-4.39 9.81-9.8 0-2.62-1.02-5.08-2.87-6.93A9.74 9.74 0 0 0 12.02 2Zm5.74 14.04c-.24.68-1.42 1.31-1.95 1.36-.5.05-1.13.21-3.66-.77-3.08-1.21-5.04-4.36-5.19-4.56-.15-.2-1.24-1.65-1.24-3.15s.79-2.23 1.07-2.54c.28-.31.61-.38.81-.38l.58.01c.19.01.44-.07.69.53.24.6.83 2.07.9 2.22.07.15.12.33.02.53-.1.2-.15.33-.3.5l-.45.53c-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13 1.01 2.09 1.32 2.39 1.47.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.13.07.73-.17 1.41Z"/></svg>,
  globe: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><circle cx="12" cy="12" r="9.2"/><path d="M3 12h18M12 2.8c2.5 2.6 2.5 16 0 18.4M12 2.8c-2.5 2.6-2.5 16 0 18.4" strokeLinecap="round"/></svg>,
  check: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m5 12.5 4.5 4.5L19 6.5"/></svg>,
  star: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="m12 2.6 2.78 5.63 6.22.9-4.5 4.39 1.06 6.18L12 17.77l-5.56 2.93 1.06-6.18-4.5-4.39 6.22-.9Z"/></svg>,
  filter: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M3 5h18M6 12h12M10 19h4"/></svg>,
  x: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>,
  menu: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M3 6h18M3 12h18M3 18h18"/></svg>,
  fb: (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/></svg>,
  phone: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L18 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 1-2Z"/></svg>,
  book: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 4h11a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4Z"/><path d="M4 4v13.5"/></svg>,
  dash: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  box: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m3.5 7 8.5-4 8.5 4-8.5 4Z"/><path d="M3.5 7v10l8.5 4 8.5-4V7M12 11v10"/></svg>,
  logout: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  edit: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
  plg: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>,
  cog: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v2.6M12 18.9v2.6M4.2 7.5l2.25 1.3M17.55 15.2l2.25 1.3M4.2 16.5l2.25-1.3M17.55 8.8l2.25-1.3"/></svg>,
  coins: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><ellipse cx="9" cy="6.5" rx="6" ry="3"/><path d="M3 6.5v5c0 1.66 2.69 3 6 3M3 11.5v5c0 1.66 2.69 3 6 3"/><circle cx="16.5" cy="15.5" r="5"/></svg>,
  /* ---- تصنيفات ---- */
  catAr: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 6.5C10.5 5 8 4.3 4.5 4.5v13C8 17.3 10.5 18 12 19.5M12 6.5C13.5 5 16 4.3 19.5 4.5v13C16 17.3 13.5 18 12 19.5M12 6.5v13"/></svg>,
  catTr: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="8.2"/><path d="M3.8 12h16.4M12 3.8c2.3 2.4 2.3 14 0 16.4M12 3.8c-2.3 2.4-2.3 14 0 16.4"/></svg>,
  catSelf: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21c0-4 0-7 0-9"/><path d="M12 12C12 8 9 5.5 4.5 5.5 4.5 10 7.5 12 12 12Z"/><path d="M12 14c0-3 2.4-5 6-5 0 3.4-2.4 5-6 5Z"/></svg>,
  catHis: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3.5 9 12 4l8.5 5M5 9v8m4-8v8m6-8v8m4-8v8M3.5 20.5h17M4.5 9.5h15"/></svg>,
  catPoe: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 4c-7 1-11 5-13.5 10.5L5 19l4.5-1.5C15 15 19 11 20 4Z"/><path d="M6.5 14.5 4 21"/><path d="M11 9c2 .5 3.5 2 4 4"/></svg>,
  catKid: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3 5 10l7 7 7-7Z"/><path d="M5 10h14M12 3v14M12 17l-2 4m2-4 2 4"/></svg>,
  catRel: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3c2 1.8 3 3.5 3 5.5 0 1.6-1.3 2.8-3 2.8s-3-1.2-3-2.8c0-2 1-3.7 3-5.5Z"/><path d="M5 21v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M5 21h14M9.5 21v-3a2.5 2.5 0 0 1 5 0v3M4 12.5V9m16 3.5V9"/></svg>,
  /* ---- خدمات الدار ---- */
  printer: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 8V3.5h10V8M7 18H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><rect x="7" y="15" width="10" height="5.5" rx="1"/><path d="M16.5 12h.01"/></svg>,
  publish: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 6.5 9 5l6 1.8 5-1.5v12.2l-5 1.5L9 17.2 4 18.7Z"/><path d="M9 5v12.2m6-10.4v12.2"/></svg>,
  truck: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2.5 6.5h11v9h-11Z"/><path d="M13.5 9.5H18l3 3v3h-7.5"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>,
};
/* خريطة أيقونة كل تصنيف حسب المعرّف */
const CAT_ICON = { 'cat-ar': Ic.catAr, 'cat-tr': Ic.catTr, 'cat-self': Ic.catSelf, 'cat-his': Ic.catHis, 'cat-poe': Ic.catPoe, 'cat-kid': Ic.catKid, 'cat-rel': Ic.catRel };

/* ---------------- نجوم التقييم ---------------- */
function Stars({ value = 0, size = 14 }) {
  return (
    <span className="row" style={{ gap: 2, color: 'var(--gold)' }}>
      <Ic.star style={{ width: size, height: size }} />
      <b className="tnum" style={{ fontSize: size, color: 'var(--ink-soft)' }}>{value.toFixed(1)}</b>
    </span>
  );
}

/* ---------------- غلاف الكتاب الطباعي ---------------- */
function BookCover({ book, style }) {
  const isAr = WALID_STORE.state.lang === 'ar';
  // غلاف بصورة حقيقية إن وُجدت
  if (book.image) {
    return (
      <div className="bookcover has-img" aria-label={book.title_ar}
        style={{ ...style, padding: 0, backgroundImage: `url(${book.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
    );
  }
  return (
    <div className={`bookcover ${book.cover}`} style={style} aria-label={book.title_ar}>
      <div className="bc-top">
        <span className="bc-pub">{book.pub === 'مترجم' ? (isAr ? 'مترجم' : 'Translated') : (isAr ? 'دار الوليد' : 'AlWalid')}</span>
      </div>
      <div>
        <div className="bc-title">{isAr ? book.title_ar : book.title_en}</div>
        <div className="bc-rule" />
        <div className="bc-author">{isAr ? book.author_ar : book.author_en}</div>
        <div className="bc-note">{book.cover_note}</div>
      </div>
    </div>
  );
}

/* ---------------- بطاقة سعر ---------------- */
function PriceTag({ book, store, big }) {
  const { priceFor, cur } = store;
  const price = priceFor(book);
  const fs = big ? '1.7rem' : '1.18rem';
  return (
    <div className="row" style={{ gap: 6, alignItems: 'baseline', flexWrap: 'wrap' }}>
      <b className="tnum" style={{ fontSize: fs, color: 'var(--brand)', fontWeight: 800, lineHeight: 1 }}>{price}</b>
      <span style={{ fontSize: big ? '1rem' : '.82rem', fontWeight: 700, color: 'var(--amber)' }}>{cur()}</span>
    </div>
  );
}

/* ---------------- بطاقة كتاب ---------------- */
function BookCard({ book, store, onOpen }) {
  const { t, addToCart, state } = store;
  const isAr = state.lang === 'ar';
  const out = book.stock <= 0;
  const inCart = state.cart.some(i => i.bookId === book.id);
  return (
    <article className="card bookcard" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => onOpen(book.id)} style={{ all: 'unset', cursor: 'pointer', padding: 14, paddingBottom: 0 }}>
        <div style={{ position: 'relative' }}>
          <BookCover book={book} />
          <div style={{ position: 'absolute', insetInlineStart: 8, insetBlockStart: 8, display: 'flex', gap: 6, flexDirection: 'column', alignItems: 'flex-start' }}>
            {book.isNew && <span className="badge" style={{ background: 'var(--brand)', color: '#fff' }}>{t('new')}</span>}
            {book.isBestseller && <span className="badge">{t('best')}</span>}
          </div>
          {out && <div style={{ position: 'absolute', inset: 0, background: 'rgba(43,34,28,.55)', borderRadius: '8px 12px 12px 8px', display: 'grid', placeItems: 'center' }}>
            <span className="badge" style={{ background: 'var(--ink)', color: '#fff', fontSize: '.8rem' }}>{t('out_stock')}</span>
          </div>}
        </div>
      </button>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <button onClick={() => onOpen(book.id)} style={{ all: 'unset', cursor: 'pointer' }}>
          <h3 style={{ fontSize: '1.02rem', lineHeight: 1.3 }}>{isAr ? book.title_ar : book.title_en}</h3>
          <p className="muted" style={{ fontSize: '.85rem', marginTop: 2 }}>{isAr ? book.author_ar : book.author_en}</p>
        </button>
        <div className="grow" />
        <div className="between" style={{ alignItems: 'flex-end' }}>
          <PriceTag book={book} store={store} />
          <Stars value={book.rating} />
        </div>
        <button className={`btn ${inCart ? 'btn-soft' : 'btn-primary'} btn-sm btn-block`} disabled={out}
          onClick={() => addToCart(book.id)}>
          {inCart ? <><Ic.check /> {t('in_cart')}</> : <><Ic.cart /> {t('add_cart')}</>}
        </button>
      </div>
    </article>
  );
}

/* ---------------- مؤشّر/مبدّل المنطقة (يُكشف تلقائياً) ---------------- */
function RegionToggle({ store }) {
  const { state, setRegion, regionName } = store;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isAr = state.lang === 'ar';
  const cur = state.region;

  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const opts = [
    { id: 'ly',   label: isAr ? 'ليبيا' : 'Libya',          sym: isAr ? 'دينار د.ل' : 'LYD' },
    { id: 'intl', label: isAr ? 'خارج ليبيا' : 'Outside Libya', sym: 'USD $' },
  ];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="chip" onClick={() => setOpen(o => !o)} style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }} title={isAr ? 'موقعك (يُكشف تلقائياً)' : 'Your location (auto-detected)'}>
        <Ic.globe style={{ width: 16, height: 16 }} />
        <span>{regionName()}</span>
        <span className="tnum" style={{ fontSize: '.72rem', fontWeight: 800, color: 'var(--amber)' }}>{cur === 'ly' ? (isAr ? 'د.ل' : 'LYD') : '$'}</span>
        <Ic.chevD style={{ width: 14, height: 14, opacity: .6 }} />
      </button>
      {open && (
        <div className="card fade-up" style={{ position: 'absolute', insetBlockStart: 'calc(100% + 8px)', insetInlineEnd: 0, width: 224, padding: 8, zIndex: 50, boxShadow: 'var(--sh-lg)' }}>
          <div className="muted" style={{ fontSize: '.74rem', fontWeight: 700, padding: '6px 10px' }}>{isAr ? 'موقعك يحدّد العملة' : 'Your location sets the currency'}</div>
          {opts.map(o => (
            <button key={o.id} onClick={() => { setRegion(o.id); setOpen(false); }}
              style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 10px', borderRadius: 'var(--r-sm)', background: o.id === cur ? 'var(--brand-tint)' : 'transparent' }}
              onMouseEnter={e => { if (o.id !== cur) e.currentTarget.style.background = 'var(--surface-3)'; }}
              onMouseLeave={e => { if (o.id !== cur) e.currentTarget.style.background = 'transparent'; }}>
              <span style={{ fontWeight: 600, color: o.id === cur ? 'var(--brand)' : 'var(--ink)' }}>{o.label}</span>
              <span className="muted" style={{ fontSize: '.74rem', fontWeight: 700 }}>{o.sym}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- الشعار ---------------- */
function Logo({ onClick, height = 52 }) {
  return (
    <button onClick={onClick} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
      <img src="assets/logo.png" alt="مكتبة دار الوليد" style={{ height, width: 'auto' }} />
    </button>
  );
}

Object.assign(window, {
  useState, useEffect, useRef, useMemo,
  Ic, CAT_ICON, Stars, BookCover, PriceTag, BookCard, RegionToggle, Logo,
});
