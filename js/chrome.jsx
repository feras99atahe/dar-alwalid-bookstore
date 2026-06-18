/* =========================================================
   هيكل الواجهة العامة — Header · Footer · Toast
   ========================================================= */

function Header({ store, route, nav }) {
  const { state, t, cartCount, toggleLang } = store;
  const isAr = state.lang === 'ar';
  const [q, setQ] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const info = WALID_DATA.STORE_INFO;

  function submitSearch(e) {
    e.preventDefault();
    nav('catalog', { q });
  }

  const navItems = [
    { id: 'home', label: t('nav_home') },
    { id: 'catalog', label: t('nav_catalog') },
    { id: 'about', label: t('nav_about') },
  ];

  return (
    <header style={{ position: 'sticky', insetBlockStart: 0, zIndex: 100, background: 'color-mix(in srgb, var(--paper-2) 92%, transparent)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--line)' }}>
      {/* الشريط العلوي */}
      <div style={{ background: 'var(--brand-deep)', color: 'var(--paper-2)' }}>
        <div className="container between" style={{ minHeight: 38, fontSize: '.82rem', fontWeight: 600 }}>
          <div className="row" style={{ gap: 18 }}>
            <span className="row" style={{ gap: 6, opacity: .92 }}><Ic.pin style={{ width: 14, height: 14 }} /> {info.address}</span>
            <span className="row hide-mobile" style={{ gap: 6, opacity: .92 }}><Ic.phone style={{ width: 14, height: 14 }} /><span dir="ltr" className="tnum">{info.phone}</span></span>
          </div>
          <button onClick={toggleLang} className="row" style={{ all: 'unset', cursor: 'pointer', gap: 6, fontWeight: 700, opacity: .95 }}>
            <Ic.globe style={{ width: 15, height: 15 }} />
            {isAr ? 'English' : 'العربية'}
          </button>
        </div>
      </div>

      {/* الشريط الرئيسي */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 18, paddingBlock: 14 }}>
        <Logo onClick={() => nav('home')} height={54} />

        <form onSubmit={submitSearch} className="grow" style={{ position: 'relative', maxWidth: 520 }}>
          <Ic.search style={{ position: 'absolute', insetInlineStart: 14, insetBlockStart: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--muted)' }} />
          <input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder={t('search_ph')}
            style={{ paddingInlineStart: 42, borderRadius: 'var(--r-pill)', background: 'var(--surface)' }} />
        </form>

        <div className="row" style={{ gap: 10, marginInlineStart: 'auto' }}>
          <button className="btn btn-ghost" style={{ position: 'relative', padding: '.7em', borderRadius: 'var(--r-pill)' }} onClick={() => nav('cart')} aria-label={t('cart')}>
            <Ic.cart style={{ width: 20, height: 20 }} />
            {cartCount() > 0 && <span className="tnum" style={{ position: 'absolute', insetBlockStart: -4, insetInlineEnd: -4, background: 'var(--brand)', color: '#fff', fontSize: '.68rem', fontWeight: 800, minWidth: 19, height: 19, borderRadius: 99, display: 'grid', placeItems: 'center', padding: '0 4px' }}>{cartCount()}</span>}
          </button>
          <button className="btn btn-ghost show-mobile" style={{ padding: '.7em', borderRadius: 'var(--r-pill)' }} onClick={() => setMobileOpen(true)}><Ic.menu style={{ width: 20, height: 20 }} /></button>
        </div>
      </div>

      {/* شريط التنقّل / التصنيفات */}
      <nav className="container hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 4, paddingBottom: 10, flexWrap: 'wrap' }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => nav(n.id)} className="btn btn-quiet"
            style={{ fontWeight: 700, color: route.name === n.id ? 'var(--brand)' : 'var(--ink-soft)' }}>{n.label}</button>
        ))}
        <span style={{ width: 1, height: 18, background: 'var(--line)', margin: '0 6px' }} />
        {state.categories.map(c => (
          <button key={c.id} onClick={() => nav('catalog', { cat: c.id })} className="btn btn-quiet" style={{ fontWeight: 600, fontSize: '.88rem' }}>
            {isAr ? c.name_ar : c.name_en}
          </button>
        ))}
      </nav>

      {/* قائمة الجوال */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(43,34,28,.45)' }} />
          <div className="fade-up" style={{ position: 'absolute', insetBlockStart: 0, insetInlineEnd: 0, insetBlockEnd: 0, width: 'min(320px,84vw)', background: 'var(--surface)', boxShadow: 'var(--sh-lg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
            <div className="between"><Logo height={42} /><button className="btn btn-ghost" style={{ padding: '.55em', borderRadius: 99 }} onClick={() => setMobileOpen(false)}><Ic.x style={{ width: 18, height: 18 }} /></button></div>
            <hr className="divider" />
            {navItems.concat(state.categories.map(c => ({ id: 'catalog', cat: c.id, label: isAr ? c.name_ar : c.name_en }))).map((n, i) => (
              <button key={i} onClick={() => { nav(n.id, n.cat ? { cat: n.cat } : {}); setMobileOpen(false); }} style={{ all: 'unset', cursor: 'pointer', padding: '10px 6px', fontWeight: 700, color: 'var(--ink)' }}>{n.label}</button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer({ store, nav }) {
  const { state, t } = store;
  const isAr = state.lang === 'ar';
  const info = WALID_DATA.STORE_INFO;
  return (
    <footer style={{ background: 'var(--brand-deep)', color: 'var(--paper-2)', marginTop: 40 }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32, paddingBlock: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <img src="assets/logo.png" alt="" style={{ height: 70, width: 'auto', filter: 'brightness(0) invert(1)', opacity: .95, alignSelf: 'flex-start' }} />
          <p style={{ opacity: .8, fontSize: '.9rem', lineHeight: 1.7, maxWidth: 260 }}>
            {isAr ? 'مكتبة ودار نشر وتوزيع في طرابلس — كتب عربية ومترجمة بأسعار تراعي مدينتك.' : 'Bookstore & publisher in Tripoli — Arabic and translated books, priced for your city.'}
          </p>
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: 14, fontSize: '1rem' }}>{t('nav_cats')}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {state.categories.slice(0, 5).map(c => (
              <button key={c.id} onClick={() => nav('catalog', { cat: c.id })} style={{ all: 'unset', cursor: 'pointer', opacity: .8, fontSize: '.9rem' }}>{isAr ? c.name_ar : c.name_en}</button>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: 14, fontSize: '1rem' }}>{isAr ? 'تواصل معنا' : 'Contact'}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, opacity: .85, fontSize: '.9rem' }}>
            <span className="row" style={{ gap: 8 }}><Ic.pin style={{ width: 16, height: 16 }} /> {info.address}</span>
            <span className="row" style={{ gap: 8 }}><Ic.phone style={{ width: 16, height: 16 }} /><span dir="ltr" className="tnum">{info.phone}</span></span>
            <span className="row" style={{ gap: 8 }}><Ic.fb style={{ width: 16, height: 16 }} /> {info.facebook}</span>
          </div>
          <a className="btn btn-wa btn-sm" style={{ marginTop: 16 }} href={`https://wa.me/${info.whatsapp}`} target="_blank">
            <Ic.wa /> {isAr ? 'راسلنا واتساب' : 'WhatsApp us'}
          </a>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}>
        <div className="container between" style={{ paddingBlock: 18, fontSize: '.82rem', opacity: .7, flexWrap: 'wrap', gap: 8 }}>
          <span>© 2026 {isAr ? 'مكتبة دار الوليد · طباعة · نشر · توزيع' : 'Dar AlWalid · Print · Publish · Distribute'}</span>
          <span>{isAr ? 'الدفع عند الاستلام · التوصيل لكل المدن' : 'Cash on delivery · Nationwide shipping'}</span>
        </div>
      </div>
    </footer>
  );
}

function Toast({ store }) {
  const { state } = store;
  if (!state.toast) return null;
  return (
    <div className="toast" key={state.toast.id}>
      <Ic.check /> {state.toast.msg}
    </div>
  );
}

Object.assign(window, { Header, Footer, Toast });
