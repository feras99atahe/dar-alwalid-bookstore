/* =========================================================
   إتمام الطلب ← تسليم واتساب · شاشة التأكيد · عن المكتبة
   ========================================================= */

// تحقّق من رقم الجوال الليبي: 09XXXXXXXX أو +2189XXXXXXXX
function validLibyanPhone(v) {
  const d = (v || '').replace(/[\s\-()]/g, '');
  return /^(?:\+?218)?0?9[0-9]{8}$/.test(d);
}
// تحقّق دولي مبسّط: 6–15 رقماً مع + اختيارية (للطلبات خارج ليبيا)
function validIntlPhone(v) {
  const d = (v || '').replace(/[\s\-()]/g, '');
  return /^\+?[0-9]{6,15}$/.test(d);
}

function CheckoutPage({ store, nav }) {
  const { state, t, cur, cartDetailed, cartSubtotal, shipping, cartTotal, createOrder, whatsappURL, markWhatsappSent } = store;
  const isAr = state.lang === 'ar';
  const intl = !store.isLibya();
  const items = cartDetailed();
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [placed, setPlaced] = useState(null); // {order, url}

  if (items.length === 0 && !placed) {
    return <main className="container section" style={{ minHeight: '40vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center', display: 'grid', gap: 12 }}>
        <h2>{t('empty_cart')}</h2>
        <button className="btn btn-primary" onClick={() => nav('catalog')}>{t('nav_catalog')}</button>
      </div>
    </main>;
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = isAr ? 'الاسم مطلوب' : 'Name required';
    if (!form.phone.trim()) e.phone = isAr ? 'رقم الهاتف مطلوب' : 'Phone required';
    else if (intl ? !validIntlPhone(form.phone) : !validLibyanPhone(form.phone))
      e.phone = intl ? (isAr ? 'رقم هاتف غير صالح (مع رمز الدولة)' : 'Invalid phone (include country code)')
                     : (isAr ? 'رقم جوال ليبي غير صالح (مثال: 0913248283)' : 'Invalid Libyan number');
    if (!form.city.trim()) e.city = intl ? (isAr ? 'المدينة والدولة مطلوبة' : 'City & country required') : (isAr ? 'المدينة مطلوبة' : 'City required');
    if (!form.address.trim()) e.address = isAr ? 'العنوان مطلوب' : 'Address required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    // ١-٢: احفظ الطلب أولاً
    const order = createOrder(form);
    // ٣-٤: ابنِ الرابط وافتح واتساب
    const url = whatsappURL(order);
    markWhatsappSent(order.id);
    setPlaced({ order, url });
    store.clearCart();
    window.scrollTo(0, 0);
    window.open(url, '_blank');
  }

  /* شاشة التأكيد */
  if (placed) {
    const o = placed.order;
    return (
      <main className="container section fade-up" style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
        <div className="card" style={{ padding: 'clamp(28px,5vw,48px)', maxWidth: 540, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 76, height: 76, borderRadius: 99, background: 'var(--whatsapp)', display: 'grid', placeItems: 'center', color: '#fff', boxShadow: '0 10px 24px rgba(30,169,82,.3)' }}><Ic.wa style={{ width: 40, height: 40 }} /></div>
          <h1 style={{ fontSize: '1.6rem' }}>{isAr ? 'تم تجهيز طلبك!' : 'Your order is ready!'}</h1>
          <p className="lead" style={{ fontSize: '1rem' }}>{isAr ? 'أكمل الدفع والتوصيل عبر واتساب. لقد فتحنا المحادثة لك في نافذة جديدة.' : 'Complete payment & delivery on WhatsApp. We opened the chat in a new tab.'}</p>
          <div className="card" style={{ padding: '12px 20px', background: 'var(--brand-tint)', border: 'none' }}>
            <span className="muted" style={{ fontSize: '.8rem', fontWeight: 700 }}>{isAr ? 'رقم الطلب' : 'Order number'}</span>
            <div className="tnum" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand)' }} dir="ltr">{o.order_number}</div>
          </div>
          <div className="between" style={{ width: '100%', maxWidth: 280 }}>
            <span className="muted">{t('total')}</span>
            <b className="tnum" style={{ color: 'var(--brand)', fontSize: '1.2rem' }}>{o.total} {WALID_DATA.symbolFor(o.currency || 'LYD', isAr ? 'ar' : 'en')}</b>
          </div>
          <a className="btn btn-wa btn-lg btn-block" href={placed.url} target="_blank"><Ic.wa /> {isAr ? 'لم يفتح واتساب؟ اضغط هنا' : 'WhatsApp didn\u2019t open? Tap here'}</a>
          <button className="btn btn-ghost btn-block" onClick={() => nav('home')}>{isAr ? 'العودة للرئيسية' : 'Back home'}</button>
        </div>
      </main>
    );
  }

  const fields = [
    { k: 'name', label: isAr ? 'الاسم الكامل' : 'Full name', req: true, ph: isAr ? 'مثال: محمد علي' : 'e.g. Mohamed Ali' },
    { k: 'phone', label: isAr ? 'رقم الجوال' : 'Phone', req: true, ph: '0913248283', dir: 'ltr', mono: true },
  ];

  return (
    <main className="container section fade-up">
      <button className="btn btn-quiet" onClick={() => nav('cart')} style={{ marginBottom: 12 }}><Ic.chevR style={{ width: 16, height: 16 }} /> {t('cart')}</button>
      <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', marginBottom: 24 }}>{t('checkout')}</h1>

      <div className="col-collapse" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,.9fr)', gap: 28, alignItems: 'start' }}>
        {/* النموذج */}
        <form className="card" onSubmit={submit} style={{ padding: 'clamp(18px,3vw,28px)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h3 style={{ fontSize: '1.15rem' }}>{isAr ? 'بيانات التوصيل' : 'Delivery details'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
            {fields.map(f => (
              <div key={f.k} className={`field ${errors[f.k] ? 'field-error' : ''}`}>
                <label>{f.label} {f.req && <span className="req">*</span>}</label>
                <input className="input" value={form[f.k]} onChange={e => set(f.k, e.target.value)} placeholder={f.ph} dir={f.dir || 'auto'} style={f.mono ? { fontVariantNumeric: 'tabular-nums' } : null} />
                {errors[f.k] && <span className="err-msg">{errors[f.k]}</span>}
              </div>
            ))}
          </div>

          <div className={`field ${errors.city ? 'field-error' : ''}`}>
            <label>{intl ? (isAr ? 'المدينة والدولة' : 'City & country') : (isAr ? 'المدينة' : 'City')} <span className="req">*</span></label>
            <input className="input" value={form.city} onChange={e => set('city', e.target.value)} placeholder={intl ? (isAr ? 'مثال: لندن، المملكة المتحدة' : 'e.g. London, UK') : (isAr ? 'مثال: طرابلس' : 'e.g. Tripoli')} />
            {errors.city && <span className="err-msg">{errors.city}</span>}
          </div>

          <div className={`field ${errors.address ? 'field-error' : ''}`}>
            <label>{isAr ? 'الحيّ والعنوان' : 'Neighborhood & address'} <span className="req">*</span></label>
            <input className="input" value={form.address} onChange={e => set('address', e.target.value)} placeholder={isAr ? 'الحيّ، الشارع، أقرب معلم…' : 'Area, street, landmark…'} />
            {errors.address && <span className="err-msg">{errors.address}</span>}
          </div>

          <div className="field">
            <label>{isAr ? 'ملاحظات' : 'Notes'} <span className="hint">({isAr ? 'اختياري' : 'optional'})</span></label>
            <textarea className="textarea" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder={isAr ? 'أي تفاصيل إضافية للطلب…' : 'Any extra details…'} />
          </div>

          <div className="card" style={{ padding: 14, background: 'var(--surface-2)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Ic.wa style={{ width: 22, height: 22, color: 'var(--whatsapp)', flex: 'none', marginTop: 2 }} />
            <p style={{ fontSize: '.86rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{isAr ? 'عند الإرسال نحفظ طلبك ثم نفتح واتساب برسالة جاهزة فيها كل التفاصيل — تؤكّد الدفع والتوصيل في المحادثة.' : 'On submit we save your order then open WhatsApp with a ready message containing all details.'}</p>
          </div>

          <button type="submit" className="btn btn-wa btn-lg btn-block" disabled={items.length === 0}><Ic.wa /> {t('send_wa')}</button>
        </form>

        {/* ملخّص للقراءة فقط */}
        <div className="card" style={{ padding: 22, position: 'sticky', insetBlockStart: 'calc(var(--header-h) + 14px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontSize: '1.1rem' }}>{isAr ? 'ملخّص الطلب' : 'Order summary'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260, overflowY: 'auto' }}>
            {items.map(ci => (
              <div key={ci.bookId} className="row" style={{ gap: 10 }}>
                <div style={{ width: 38, flex: 'none' }}><BookCover book={ci.book} /></div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '.86rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isAr ? ci.book.title_ar : ci.book.title_en}</div>
                  <div className="muted tnum" style={{ fontSize: '.78rem' }}>{ci.qty} × {ci.unit} {cur()}</div>
                </div>
                <b className="tnum" style={{ fontSize: '.9rem' }}>{ci.line}</b>
              </div>
            ))}
          </div>
          <hr className="divider" />
          <SummaryRow label={t('subtotal')} value={cartSubtotal()} cur={cur()} />
          <SummaryRow label={t('shipping')} value={shipping()} cur={cur()} free={shipping() === 0} isAr={isAr} />
          <hr className="divider" />
          <div className="between">
            <b>{t('total')}</b>
            <b className="tnum" style={{ fontSize: '1.4rem', color: 'var(--brand)' }}>{cartTotal()} <span style={{ fontSize: '.78rem', color: 'var(--amber)' }}>{cur()}</span></b>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------------- عن المكتبة ---------------- */
function AboutPage({ store, nav }) {
  const { state, t } = store;
  const isAr = state.lang === 'ar';
  const info = WALID_DATA.STORE_INFO;
  const feats = [
    { icon: Ic.printer, ar: 'طباعة', en: 'Printing', d_ar: 'خدمات طباعة احترافية للكتب والمطبوعات.', d_en: 'Professional printing for books and materials.' },
    { icon: Ic.publish, ar: 'نشر', en: 'Publishing', d_ar: 'نشر إصدارات أصيلة بجودة عالية.', d_en: 'Publishing original, high-quality titles.' },
    { icon: Ic.truck, ar: 'توزيع', en: 'Distribution', d_ar: 'توصيل لكل المدن الليبية.', d_en: 'Delivery across all Libyan cities.' },
  ];
  return (
    <main className="container section fade-up">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 40, alignItems: 'center', marginBottom: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span className="eyebrow">{t('nav_about')}</span>
          <h1 className="display" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>{isAr ? 'مكتبة دار الوليد' : 'Dar AlWalid Bookstore'}</h1>
          <p className="lead">{isAr ? 'منذ سنوات ونحن نقدّم الكتب لقرّاء طرابلس وكل ليبيا — عبر صفحتنا على فيسبوك، واليوم عبر متجر إلكتروني منظّم يسهّل عليك التصفّح والطلب، مع الحفاظ على ما تحبّه: التواصل المباشر والدفع عند الاستلام.' : 'For years we have served readers in Tripoli and across Libya — now through an organized online store, while keeping what you love: direct contact and cash on delivery.'}</p>
          <div className="row" style={{ gap: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>
            <span className="row" style={{ gap: 7 }}><Ic.pin style={{ width: 17, height: 17, color: 'var(--brand)' }} /> {info.address}</span>
          </div>
          <a className="btn btn-wa" style={{ alignSelf: 'flex-start' }} href={`https://wa.me/${info.whatsapp}`} target="_blank"><Ic.wa /> {isAr ? 'راسلنا الآن' : 'Message us'}</a>
        </div>
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <img src="assets/logo.png" alt="" style={{ width: 'min(80%,280px)' }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
        {feats.map((f, i) => {
          const FIc = f.icon;
          return (
          <div key={i} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ width: 52, height: 52, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'var(--amber-tint)', color: 'var(--brand)' }}><FIc style={{ width: 27, height: 27 }} /></span>
            <h3 style={{ fontSize: '1.2rem' }}>{isAr ? f.ar : f.en}</h3>
            <p className="muted" style={{ fontSize: '.9rem', lineHeight: 1.7 }}>{isAr ? f.d_ar : f.d_en}</p>
          </div>
          );
        })}
      </div>
    </main>
  );
}

Object.assign(window, { CheckoutPage, AboutPage, validLibyanPhone, validIntlPhone });
