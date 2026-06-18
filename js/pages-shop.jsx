/* =========================================================
   صفحات المتجر — الرئيسية · الكتالوج
   ========================================================= */

/* شبكة كتب */
function BookGrid({ books, store, nav }) {
  return (
    <div className="book-grid">
      {books.map(b => <div key={b.id} className="fade-up"><BookCard book={b} store={store} onOpen={id => nav('book', { id })} /></div>)}
    </div>
  );
}

/* صف أفقي */
function BookRow({ books, store, nav }) {
  return (
    <div className="scroll-x">
      {books.map(b => <div key={b.id} style={{ width: 215 }}><BookCard book={b} store={store} onOpen={id => nav('book', { id })} /></div>)}
    </div>
  );
}

/* ---------------- الرئيسية ---------------- */
function HomePage({ store, nav }) {
  const { state, t, priceFor, addToCart } = store;
  const isAr = state.lang === 'ar';
  const active = state.books.filter(b => b.is_active);
  const hero = active.find(b => b.id === 'b3') || active[0];
  const newOnes = active.filter(b => b.isNew);
  const best = active.filter(b => b.isBestseller);
  const featured = active.filter(b => b.isFeatured).slice(0, 3);

  return (
    <main className="fade-up">
      {/* البطل */}
      <section style={{ background: 'linear-gradient(135deg, var(--surface-3), var(--paper-2))', borderBottom: '1px solid var(--line)' }}>
        <div className="container col-collapse" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,.9fr)', gap: 40, alignItems: 'center', paddingBlock: 'clamp(36px,5vw,64px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span className="eyebrow">{t('featured')}</span>
            <h1 className="display" style={{ fontSize: 'clamp(2rem,4.4vw,3.3rem)' }}>
              {isAr ? 'كتبك المفضّلة، بسعر موقعك' : 'Your favourite books, at your city\u2019s price'}
            </h1>
            <p className="lead" style={{ maxWidth: 460 }}>
              {isAr ? 'تصفّح الكتالوج، أضِف ما يعجبك للسلة، وأكمل طلبك عبر واتساب — بكل بساطة، والدفع عند الاستلام.'
                    : 'Browse, add to your cart, and complete your order over WhatsApp — simple, with cash on delivery.'}
            </p>
            <div className="row wrap" style={{ gap: 12 }}>
              <button className="btn btn-primary btn-lg" onClick={() => nav('catalog')}><Ic.book /> {isAr ? 'تصفّح الكتب' : 'Browse books'}</button>
            </div>
            <div className="row wrap" style={{ gap: 22, marginTop: 6, fontSize: '.86rem', fontWeight: 600, color: 'var(--ink-soft)' }}>
              <span className="row" style={{ gap: 7 }}><Ic.wa style={{ width: 17, height: 17, color: 'var(--whatsapp)' }} /> {isAr ? 'طلب عبر واتساب' : 'Order via WhatsApp'}</span>
              <span className="row" style={{ gap: 7 }}><Ic.pin style={{ width: 17, height: 17, color: 'var(--amber)' }} /> {isAr ? 'توصيل داخل ليبيا وخارجها' : 'Libya & worldwide'}</span>
              <span className="row" style={{ gap: 7 }}><Ic.check style={{ width: 17, height: 17, color: 'var(--success)' }} /> {isAr ? 'الدفع عند الاستلام' : 'Cash on delivery'}</span>
            </div>
          </div>
          <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
            <button onClick={() => nav('book', { id: hero.id })} style={{ all: 'unset', cursor: 'pointer', position: 'relative' }}>
              <div style={{ width: 'clamp(180px,26vw,260px)', transform: 'rotate(-4deg)', filter: 'drop-shadow(0 30px 40px rgba(60,38,22,.28))' }}>
                <BookCover book={hero} />
              </div>
              <div className="card" style={{ position: 'absolute', insetBlockEnd: -14, insetInlineStart: -18, padding: '10px 14px', boxShadow: 'var(--sh-lg)', transform: 'rotate(2deg)' }}>
                <div className="muted" style={{ fontSize: '.72rem', fontWeight: 700 }}>{isAr ? hero.title_ar : hero.title_en}</div>
                <PriceTag book={hero} store={store} />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* وصل حديثاً */}
      {newOnes.length > 0 && (
        <section className="section container">
          <div className="sec-head">
            <h2>{t('new')}</h2>
            <button className="seemore" onClick={() => nav('catalog')}>{t('browse')} <Ic.chevL style={{ width: 16, height: 16 }} /></button>
          </div>
          <BookRow books={newOnes} store={store} nav={nav} />
        </section>
      )}

      {/* التصنيفات */}
      <section className="section container" style={{ paddingBlock: 'clamp(20px,3vw,36px)' }}>
        <div className="sec-head"><h2>{t('nav_cats')}</h2></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14 }}>
          {state.categories.map(c => {
            const count = active.filter(b => b.cat === c.id).length;
            const CatIc = CAT_ICON[c.id] || Ic.book;
            return (
              <button key={c.id} className="card" onClick={() => nav('catalog', { cat: c.id })}
                style={{ all: 'unset', cursor: 'pointer', padding: 18, display: 'flex', flexDirection: 'column', gap: 10, transition: 'transform .14s, box-shadow .18s', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--sh)'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--line)'; }}>
                <span style={{ width: 46, height: 46, borderRadius: 13, display: 'grid', placeItems: 'center', background: 'var(--amber-tint)', color: 'var(--brand)' }}><CatIc style={{ width: 24, height: 24 }} /></span>
                <b style={{ fontSize: '1.02rem' }}>{isAr ? c.name_ar : c.name_en}</b>
                <span className="muted tnum" style={{ fontSize: '.82rem' }}>{count} {isAr ? 'كتاب' : 'books'}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* الأكثر مبيعاً */}
      {best.length > 0 && (
        <section className="section container">
          <div className="sec-head">
            <h2>{t('best')}</h2>
            <button className="seemore" onClick={() => nav('catalog', { sort: 'best' })}>{t('browse')} <Ic.chevL style={{ width: 16, height: 16 }} /></button>
          </div>
          <BookGrid books={best.slice(0, 8)} store={store} nav={nav} />
        </section>
      )}
    </main>
  );
}

/* ---------------- الكتالوج ---------------- */
function CatalogPage({ store, nav, params }) {
  const { state, t, priceFor } = store;
  const isAr = state.lang === 'ar';
  const [cat, setCat] = useState(params.cat || 'all');
  const [sort, setSort] = useState(params.sort || 'new');
  const [avail, setAvail] = useState(false);
  const [query, setQuery] = useState(params.q || '');
  const [debounced, setDebounced] = useState(params.q || '');
  const [maxPrice, setMaxPrice] = useState(70);

  useEffect(() => { setCat(params.cat || 'all'); }, [params.cat]);
  useEffect(() => { setQuery(params.q || ''); }, [params.q]);
  useEffect(() => { const id = setTimeout(() => setDebounced(query), 300); return () => clearTimeout(id); }, [query]);

  let books = state.books.filter(b => b.is_active);
  if (cat !== 'all') books = books.filter(b => b.cat === cat);
  if (avail) books = books.filter(b => b.stock > 0);
  books = books.filter(b => WALID_DATA.basePriceLyd(b, null) <= maxPrice);
  if (debounced.trim()) {
    const s = debounced.trim().toLowerCase();
    books = books.filter(b => [b.title_ar, b.title_en, b.author_ar, b.author_en, b.isbn].join(' ').toLowerCase().includes(s));
  }
  const sorters = {
    new: (a, b) => (b.isNew - a.isNew) || (b.year - a.year),
    price_asc: (a, b) => priceFor(a) - priceFor(b),
    price_desc: (a, b) => priceFor(b) - priceFor(a),
    best: (a, b) => b.isBestseller - a.isBestseller || b.rating - a.rating,
  };
  books = [...books].sort(sorters[sort] || sorters.new);

  const cats = [{ id: 'all', name_ar: 'كل التصنيفات', name_en: 'All' }, ...state.categories];
  const sortOpts = [
    { id: 'new', ar: 'الأحدث', en: 'Newest' },
    { id: 'price_asc', ar: 'السعر: تصاعدي', en: 'Price ↑' },
    { id: 'price_desc', ar: 'السعر: تنازلي', en: 'Price ↓' },
    { id: 'best', ar: 'الأكثر مبيعاً', en: 'Bestselling' },
  ];

  return (
    <main className="container section fade-up col-collapse" style={{ display: 'grid', gridTemplateColumns: '248px minmax(0,1fr)', gap: 32, alignItems: 'start' }}>
      {/* الفلاتر */}
      <aside className="card hide-mobile" style={{ padding: 20, position: 'sticky', insetBlockStart: 'calc(var(--header-h) + 14px)', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <h4 className="row" style={{ gap: 8, fontSize: '1rem', marginBottom: 14 }}><Ic.filter style={{ width: 18, height: 18, color: 'var(--brand)' }} /> {t('filter')}</h4>
          <div className="muted" style={{ fontSize: '.78rem', fontWeight: 700, marginBottom: 8 }}>{t('nav_cats')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {cats.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} style={{ all: 'unset', cursor: 'pointer', padding: '7px 10px', borderRadius: 'var(--r-sm)', fontWeight: 600, fontSize: '.92rem', background: cat === c.id ? 'var(--brand-tint)' : 'transparent', color: cat === c.id ? 'var(--brand)' : 'var(--ink-soft)' }}>
                {isAr ? c.name_ar : c.name_en}
              </button>
            ))}
          </div>
        </div>
        <hr className="divider" />
        <div>
          <div className="between" style={{ marginBottom: 8 }}>
            <span className="muted" style={{ fontSize: '.78rem', fontWeight: 700 }}>{isAr ? 'أقصى سعر' : 'Max price'}</span>
            <b className="tnum" style={{ color: 'var(--brand)' }}>{maxPrice} {t('sar')}</b>
          </div>
          <input type="range" min="15" max="70" value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ width: '100%', accentColor: 'var(--brand)' }} />
        </div>
        <hr className="divider" />
        <label className="row" style={{ gap: 10, cursor: 'pointer', fontWeight: 600, fontSize: '.92rem' }}>
          <input type="checkbox" checked={avail} onChange={e => setAvail(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--brand)' }} />
          {isAr ? 'المتوفّر فقط' : 'In stock only'}
        </label>
      </aside>

      {/* النتائج */}
      <div>
        <div className="between wrap" style={{ marginBottom: 20, gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)' }}>{cat === 'all' ? t('nav_catalog') : (isAr ? state.categories.find(c => c.id === cat)?.name_ar : state.categories.find(c => c.id === cat)?.name_en)}</h1>
            <p className="muted tnum" style={{ marginTop: 4 }}>{books.length} {t('results')}</p>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <select className="select" value={sort} onChange={e => setSort(e.target.value)} style={{ width: 'auto', borderRadius: 'var(--r-pill)' }}>
              {sortOpts.map(o => <option key={o.id} value={o.id}>{isAr ? o.ar : o.en}</option>)}
            </select>
          </div>
        </div>

        {/* فلاتر متنقّلة للجوال */}
        <div className="scroll-x show-mobile" style={{ marginBottom: 16, gap: 8 }}>
          {cats.map(c => <button key={c.id} className={`chip ${cat === c.id ? 'is-active' : ''}`} onClick={() => setCat(c.id)}>{isAr ? c.name_ar : c.name_en}</button>)}
        </div>

        {books.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: '2.6rem' }}>🔍</span>
            <h3>{t('no_results')}</h3>
            <p className="muted">{isAr ? 'جرّب كلمة أخرى أو تصفّح هذه التصنيفات:' : 'Try another term or browse these categories:'}</p>
            <div className="row wrap" style={{ gap: 8, justifyContent: 'center' }}>
              {state.categories.slice(0, 4).map(c => <button key={c.id} className="chip" onClick={() => { setCat(c.id); setQuery(''); }}>{isAr ? c.name_ar : c.name_en}</button>)}
            </div>
          </div>
        ) : <BookGrid books={books} store={store} nav={nav} />}
      </div>
    </main>
  );
}

Object.assign(window, { BookGrid, BookRow, HomePage, CatalogPage });
