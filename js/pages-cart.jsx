/* =========================================================
   صفحات — تفاصيل الكتاب · السلة · إتمام الطلب (واتساب)
   ========================================================= */

/* ---------------- جدول «تفاصيل المنتج» (على غرار متجر كتب عالمي) ---------------- */
function ProductDetails({ book: b, cat, isAr }) {
  const isTrans = b.pub === 'مترجم';
  const fmtEn = b.format_ar === 'غلاف مُجلّد' ? 'Hardcover' : 'Paperback';
  const langEn = isTrans ? 'Arabic (translated)' : 'Arabic';
  const edEn = 'First edition';
  const rows = [
    { l: isAr ? 'الناشر' : 'Publisher', v: b.publisher_ar },
    { l: isAr ? 'تاريخ النشر' : 'Publication year', v: b.year, ltr: true },
    { l: isAr ? 'اللغة' : 'Language', v: isAr ? b.language_ar : langEn },
    isTrans && { l: isAr ? 'المترجم' : 'Translator', v: b.translator_ar },
    { l: isAr ? 'الطبعة' : 'Edition', v: isAr ? b.edition_ar : edEn },
    { l: isAr ? 'نوع التغليف' : 'Format', v: isAr ? b.format_ar : fmtEn },
    { l: isAr ? 'عدد الصفحات' : 'Pages', v: b.pages, ltr: true },
    { l: isAr ? 'الأبعاد' : 'Dimensions', v: b.dimensions, ltr: true },
    { l: isAr ? 'الوزن' : 'Weight', v: b.weight_g + (isAr ? ' غ' : ' g'), ltr: true },
    { l: isAr ? 'ردمك (ISBN-13)' : 'ISBN-13', v: b.isbn, ltr: true },
    { l: isAr ? 'التصنيف' : 'Category', v: isAr ? cat?.name_ar : cat?.name_en },
  ].filter(Boolean);
  return (
    <div>
      <h3 style={{ fontSize: '1.1rem', marginBottom: 10 }}>{isAr ? 'تفاصيل المنتج' : 'Product details'}</h3>
      <div className="card" style={{ overflow: 'hidden' }}>
        {rows.map((r, i) => (
          <div key={i} className="between" style={{ gap: 16, padding: '11px 16px', borderTop: i ? '1px solid var(--line-soft)' : 'none', background: i % 2 ? 'var(--surface-2)' : 'transparent' }}>
            <span className="muted" style={{ fontWeight: 700, fontSize: '.85rem', flex: 'none' }}>{r.l}</span>
            <span className={r.ltr ? 'tnum' : ''} dir={r.ltr ? 'ltr' : 'auto'} style={{ fontWeight: 700, fontSize: '.9rem', textAlign: isAr ? 'left' : 'right' }}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- تفاصيل الكتاب ---------------- */
function BookDetailPage({ store, nav, params }) {
  const { state, t, book, category, priceFor, addToCart } = store;
  const isAr = state.lang === 'ar';
  const b = book(params.id);
  const [qty, setQty] = useState(1);
  const [expand, setExpand] = useState(false);
  useEffect(() => { setQty(1); window.scrollTo(0, 0); }, [params.id]);
  if (!b) return <main className="container section"><p>{isAr ? 'الكتاب غير موجود' : 'Not found'}</p></main>;

  const out = b.stock <= 0;
  const cat = category(b.cat);
  const related = state.books.filter(x => x.is_active && x.cat === b.cat && x.id !== b.id).slice(0, 5);
  const inCart = state.cart.find(i => i.bookId === b.id);

  return (
    <main className="container section fade-up">
      <button className="btn btn-quiet" onClick={() => nav('catalog')} style={{ marginBottom: 16 }}><Ic.chevR style={{ width: 16, height: 16 }} /> {t('nav_catalog')}</button>

      <div className="col-collapse" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,.85fr) minmax(0,1.15fr)', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>
        {/* الغلاف */}
        <div style={{ position: 'sticky', insetBlockStart: 'calc(var(--header-h) + 14px)', display: 'grid', placeItems: 'center' }}>
          <div style={{ width: 'min(100%,300px)', filter: 'drop-shadow(0 30px 44px rgba(60,38,22,.26))' }}><BookCover book={b} /></div>
        </div>

        {/* التفاصيل */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="row wrap" style={{ gap: 8 }}>
            <span className="badge-brand badge" onClick={() => nav('catalog', { cat: b.cat })} style={{ cursor: 'pointer' }}>{isAr ? cat?.name_ar : cat?.name_en}</span>
            {b.isBestseller && <span className="badge">{t('best')}</span>}
            {b.isNew && <span className="badge" style={{ background: 'var(--brand)', color: '#fff' }}>{t('new')}</span>}
          </div>
          <h1 style={{ fontSize: 'clamp(1.7rem,3.5vw,2.6rem)' }}>{isAr ? b.title_ar : b.title_en}</h1>
          {b.subtitle_ar && <p className="lead" style={{ fontSize: '1.05rem', marginTop: -4 }}>{isAr ? b.subtitle_ar : (b.subtitle_en || b.subtitle_ar)}</p>}
          <div className="row wrap" style={{ gap: 16, alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--ink-soft)' }}>{t('author')}: {isAr ? b.author_ar : b.author_en}</span>
            {b.pub === 'مترجم' && b.translator_ar && <span className="muted" style={{ fontWeight: 600, fontSize: '.92rem' }}>{isAr ? 'ترجمة' : 'Translated by'}: {b.translator_ar}</span>}
            <span className="row" style={{ gap: 6 }}>
              <Stars value={b.rating} size={16} />
              <span className="muted tnum" style={{ fontSize: '.85rem' }}>({b.reviews_count} {isAr ? 'تقييم' : 'reviews'})</span>
            </span>
          </div>

          {/* كتلة السعر */}
          <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--surface-2)' }}>
            <div className="between wrap" style={{ gap: 12 }}>
              <PriceTag book={b} store={store} big />
              <span className={`badge ${out ? '' : ''}`} style={{ background: out ? 'var(--danger-tint)' : 'var(--amber-tint)', color: out ? 'var(--danger)' : 'var(--success)' }}>
                <span className="badge-dot" />{out ? t('out_stock') : t('in_stock')}
              </span>
            </div>
            <hr className="divider" />
            <div className="row wrap" style={{ gap: 14 }}>
              <div className="qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}><Ic.minus style={{ width: 16, height: 16 }} /></button>
                <span className="tnum">{qty}</span>
                <button onClick={() => setQty(q => Math.min(b.stock, q + 1))} disabled={out || qty >= b.stock}><Ic.plus style={{ width: 16, height: 16 }} /></button>
              </div>
              <button className="btn btn-primary btn-lg grow" disabled={out} onClick={() => { addToCart(b.id, qty); }} style={{ minWidth: 200 }}>
                <Ic.cart /> {inCart ? (isAr ? 'تحديث السلة' : 'Update cart') : t('add_cart')}
              </button>
            </div>
          </div>

          {/* الوصف */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{isAr ? 'نبذة عن الكتاب' : 'About the book'}</h3>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.8, maxHeight: expand ? 'none' : '4.8em', overflow: 'hidden' }}>{b.desc_ar}</p>
            {b.desc_ar.length > 120 && <button className="btn btn-quiet btn-sm" style={{ paddingInline: 0, color: 'var(--brand)' }} onClick={() => setExpand(e => !e)}>{expand ? (isAr ? 'أقل' : 'Less') : (isAr ? 'اقرأ المزيد' : 'Read more')}</button>}
          </div>

          {/* تفاصيل المنتج */}
          <ProductDetails book={b} cat={cat} isAr={isAr} />
        </div>
      </div>

      {/* ذات صلة */}
      {related.length > 0 && (
        <section style={{ marginTop: 56 }}>
          <div className="sec-head"><h2 style={{ fontSize: '1.5rem' }}>{t('related')}</h2></div>
          <BookRow books={related} store={store} nav={nav} />
        </section>
      )}
    </main>
  );
}

/* ---------------- السلة ---------------- */
function CartPage({ store, nav }) {
  const { state, t, cur, cartDetailed, cartSubtotal, shipping, cartTotal, setQty, removeFromCart } = store;
  const isAr = state.lang === 'ar';
  const items = cartDetailed();

  if (items.length === 0) {
    return (
      <main className="container section fade-up" style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: 99, background: 'var(--brand-tint)', display: 'grid', placeItems: 'center', color: 'var(--brand)' }}><Ic.cart style={{ width: 36, height: 36 }} /></div>
          <h2>{t('empty_cart')}</h2>
          <p className="muted">{t('empty_cart_sub')}</p>
          <button className="btn btn-primary btn-lg" onClick={() => nav('catalog')}><Ic.book /> {t('nav_catalog')}</button>
        </div>
      </main>
    );
  }

  return (
    <main className="container section fade-up">
      <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', marginBottom: 24 }}>{t('cart')} <span className="muted tnum" style={{ fontSize: '1rem', fontWeight: 600 }}>({items.length})</span></h1>
      <div className="col-collapse" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,.9fr)', gap: 28, alignItems: 'start' }}>
        {/* العناصر */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {items.map(ci => (
            <div key={ci.bookId} className="card" style={{ padding: 14, display: 'grid', gridTemplateColumns: '64px minmax(0,1fr)', gap: 14, alignItems: 'start' }}>
              <button onClick={() => nav('book', { id: ci.bookId })} style={{ all: 'unset', cursor: 'pointer', width: 64 }}><BookCover book={ci.book} /></button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                <div className="between" style={{ gap: 10, alignItems: 'flex-start' }}>
                  <button onClick={() => nav('book', { id: ci.bookId })} style={{ all: 'unset', cursor: 'pointer', minWidth: 0 }}><b style={{ fontSize: '1rem' }}>{isAr ? ci.book.title_ar : ci.book.title_en}</b></button>
                  <div className="tnum" style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--brand)', whiteSpace: 'nowrap', flex: 'none' }}>{ci.line} <span style={{ fontSize: '.7rem', color: 'var(--amber)' }}>{cur()}</span></div>
                </div>
                <span className="muted" style={{ fontSize: '.84rem' }}>{isAr ? ci.book.author_ar : ci.book.author_en}</span>
                <span className="tnum" style={{ fontWeight: 700, color: 'var(--amber)', fontSize: '.86rem' }}>{ci.unit} {cur()} / {isAr ? 'نسخة' : 'each'}</span>
                <div className="row wrap" style={{ gap: 12, marginTop: 4 }}>
                  <div className="qty">
                    <button onClick={() => setQty(ci.bookId, ci.qty - 1)}><Ic.minus style={{ width: 15, height: 15 }} /></button>
                    <span className="tnum">{ci.qty}</span>
                    <button onClick={() => setQty(ci.bookId, ci.qty + 1)} disabled={ci.qty >= ci.book.stock}><Ic.plus style={{ width: 15, height: 15 }} /></button>
                  </div>
                  <button className="btn btn-quiet btn-sm" style={{ color: 'var(--danger)' }} onClick={() => removeFromCart(ci.bookId)}><Ic.trash style={{ width: 15, height: 15 }} /> {t('remove')}</button>
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => nav('catalog')}><Ic.chevR style={{ width: 16, height: 16 }} /> {t('continue')}</button>
        </div>

        {/* الملخّص */}
        <div className="card" style={{ padding: 22, position: 'sticky', insetBlockStart: 'calc(var(--header-h) + 14px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontSize: '1.15rem' }}>{isAr ? 'ملخّص الطلب' : 'Order summary'}</h3>
          <SummaryRow label={t('subtotal')} value={cartSubtotal()} cur={cur()} />
          <SummaryRow label={t('shipping')} value={shipping()} cur={cur()} free={shipping() === 0} isAr={isAr} />
          <hr className="divider" />
          <div className="between">
            <b style={{ fontSize: '1.05rem' }}>{t('total')}</b>
            <b className="tnum" style={{ fontSize: '1.5rem', color: 'var(--brand)' }}>{cartTotal()} <span style={{ fontSize: '.8rem', color: 'var(--amber)' }}>{cur()}</span></b>
          </div>
          <button className="btn btn-primary btn-lg btn-block" onClick={() => nav('checkout')}>{t('checkout')} <Ic.chevL style={{ width: 18, height: 18 }} /></button>
          <p className="muted" style={{ fontSize: '.78rem', textAlign: 'center' }}>{isAr ? 'تكمل الدفع والتوصيل عبر واتساب' : 'Complete payment & delivery on WhatsApp'}</p>
        </div>
      </div>
    </main>
  );
}

function SummaryRow({ label, value, cur, free, isAr }) {
  return (
    <div className="between">
      <span className="muted">{label}</span>
      {free ? <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '.9rem' }}>{isAr ? 'مجاني' : 'Free'}</span>
            : <span className="tnum" style={{ fontWeight: 700 }}>{value} {cur}</span>}
    </div>
  );
}

Object.assign(window, { ProductDetails, BookDetailPage, CartPage, SummaryRow });
