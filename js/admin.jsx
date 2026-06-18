/* =========================================================
   لوحة الإدارة — دخول · هيكل · لوحة · طلبات
   ========================================================= */

const ORDER_STATUSES = ['جديد', 'تم التواصل', 'مؤكّد', 'تم الشحن', 'تم التسليم', 'ملغى'];
const STATUS_COLOR = {
  'جديد': { bg: '#F3E6CC', fg: '#A56A22' },
  'تم التواصل': { bg: '#E6EAF0', fg: '#4F6D8C' },
  'مؤكّد': { bg: '#F2E1DB', fg: '#7C2B25' },
  'تم الشحن': { bg: '#E3EEE6', fg: '#1f7a44' },
  'تم التسليم': { bg: '#DDEFE2', fg: '#15823f' },
  'ملغى': { bg: '#EFE3DF', fg: '#9c5040' },
};
// رقم واتساب للعميل: داخل ليبيا نضيف رمز الدولة 218، وخارجها نستخدم الرقم كما هو
function waNumber(order) {
  const raw = (order.customer_phone || '').replace(/[\s\-()+]/g, '');
  if ((order.currency || 'LYD') === 'USD') return raw;            // رقم دولي بكامل رمز الدولة
  return '218' + raw.replace(/^0/, '');                            // رقم ليبي محلي
}
function timeAgo(ts, isAr) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 60) return isAr ? `منذ ${m} د` : `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return isAr ? `منذ ${h} س` : `${h}h ago`;
  const d = Math.floor(h / 24);
  return isAr ? `منذ ${d} يوم` : `${d}d ago`;
}

/* ---------------- الدخول ---------------- */
function AdminLogin({ store, nav }) {
  const { adminLogin } = store;
  const isAr = store.state.lang === 'ar';
  const [email, setEmail] = useState('super@alwalid.ly');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  function submit(e) {
    e.preventDefault();
    if (!adminLogin(email, pass)) setErr(isAr ? 'بريد أو كلمة مرور غير صحيحة' : 'Invalid email or password');
  }
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--surface-3)', padding: 20 }}>
      <form onSubmit={submit} className="card fade-up" style={{ padding: 'clamp(28px,5vw,44px)', width: 'min(100%,420px)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <button onClick={() => nav('home')} type="button" style={{ all: 'unset', cursor: 'pointer', alignSelf: 'center' }}><img src="assets/logo.png" alt="" style={{ height: 78 }} /></button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.4rem' }}>{isAr ? 'لوحة الإدارة' : 'Admin Panel'}</h1>
          <p className="muted" style={{ fontSize: '.88rem', marginTop: 4 }}>{isAr ? 'تسجيل دخول المدراء' : 'Sign in to continue'}</p>
        </div>
        <div className="field">
          <label>{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} dir="ltr" />
        </div>
        <div className="field">
          <label>{isAr ? 'كلمة المرور' : 'Password'}</label>
          <input className="input" type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(''); }} dir="ltr" placeholder="••••••" />
        </div>
        {err && <span className="err-msg">{err}</span>}
        <button type="submit" className="btn btn-primary btn-lg btn-block">{isAr ? 'دخول' : 'Sign in'}</button>
        <p className="hint" style={{ textAlign: 'center' }}>{isAr ? 'المدير العام الافتراضي: super@alwalid.ly / admin1234' : 'Default super admin: super@alwalid.ly / admin1234'}</p>
      </form>
    </div>
  );
}

/* ---------------- الهيكل ---------------- */
function AdminLayout({ store, nav, section, setSection, children }) {
  const { state, adminLogout, can } = store;
  const isAr = state.lang === 'ar';
  const me = store.currentUser();
  const allItems = [
    { id: 'dashboard', label: isAr ? 'اللوحة' : 'Dashboard', icon: Ic.dash },
    { id: 'books', label: isAr ? 'الكتب' : 'Books', icon: Ic.book },
    { id: 'orders', label: isAr ? 'الطلبات' : 'Orders', icon: Ic.box },
    { id: 'settings', label: isAr ? 'الإعدادات' : 'Settings', icon: Ic.cog },
    { id: 'users', label: isAr ? 'المستخدمون' : 'Users', icon: Ic.users },
  ];
  const items = allItems.filter(it => can(it.id));
  const newOrders = state.orders.filter(o => o.status === 'جديد').length;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '236px 1fr', minHeight: '100vh', background: 'var(--paper)' }}>
      {/* الشريط الجانبي */}
      <aside style={{ background: 'var(--brand-deep)', color: 'var(--paper-2)', display: 'flex', flexDirection: 'column', padding: 18, position: 'sticky', insetBlockStart: 0, height: '100vh' }}>
        <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', marginBottom: 24, display: 'grid', placeItems: 'center', padding: 8 }}>
          <img src="assets/logo.png" alt="" style={{ height: 64, filter: 'brightness(0) invert(1)' }} />
        </button>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {items.map(it => {
            const on = section === it.id;
            return (
              <button key={it.id} onClick={() => setSection(it.id)} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderRadius: 'var(--r)', fontWeight: 700, fontSize: '.94rem', background: on ? 'rgba(255,255,255,.14)' : 'transparent', color: on ? '#fff' : 'rgba(255,255,255,.75)' }}>
                <it.icon style={{ width: 19, height: 19 }} />
                <span>{it.label}</span>
                {it.id === 'orders' && newOrders > 0 && <span className="tnum" style={{ marginInlineStart: 'auto', background: 'var(--amber)', color: '#fff', fontSize: '.7rem', fontWeight: 800, minWidth: 20, height: 20, borderRadius: 99, display: 'grid', placeItems: 'center' }}>{newOrders}</span>}
              </button>
            );
          })}
        </nav>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: 14 }}>
          {me && <div className="hide-mobile" style={{ padding: '4px 14px 8px', lineHeight: 1.3 }}>
            <div style={{ fontWeight: 700, fontSize: '.88rem', color: '#fff' }}>{me.name}</div>
            <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.6)' }}>{me.role === 'super' ? (isAr ? 'مدير عام' : 'Super admin') : (isAr ? 'مستخدم' : 'Admin')}</div>
          </div>}
          <button onClick={() => nav('home')} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px', borderRadius: 'var(--r)', fontWeight: 600, fontSize: '.9rem', color: 'rgba(255,255,255,.8)' }}><Ic.globe style={{ width: 18, height: 18 }} /> {isAr ? 'عرض المتجر' : 'View store'}</button>
          <button onClick={() => { adminLogout(); nav('home'); }} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px', borderRadius: 'var(--r)', fontWeight: 600, fontSize: '.9rem', color: 'rgba(255,255,255,.8)' }}><Ic.logout style={{ width: 18, height: 18 }} /> {isAr ? 'خروج' : 'Logout'}</button>
        </div>
      </aside>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}

function AdminHeader({ title, sub, action }) {
  return (
    <div className="between wrap" style={{ padding: 'clamp(20px,3vw,32px)', paddingBottom: 0, gap: 14 }}>
      <div>
        <h1 style={{ fontSize: 'clamp(1.4rem,2.6vw,1.9rem)' }}>{title}</h1>
        {sub && <p className="muted" style={{ marginTop: 4 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------------- اللوحة ---------------- */
function AdminDashboard({ store, setSection, openBookForm }) {
  const { state, book } = store;
  const isAr = state.lang === 'ar';
  const dayMs = 864e5;
  const todayNew = state.orders.filter(o => o.status === 'جديد' && Date.now() - o.created_at < dayMs).length;
  const weekOrders = state.orders.filter(o => Date.now() - o.created_at < 7 * dayMs).length;
  const totalBooks = state.books.filter(b => b.is_active).length;
  const outStock = state.books.filter(b => b.is_active && b.stock <= 0).length;
  const stats = [
    { label: isAr ? 'طلبات جديدة اليوم' : 'New today', value: todayNew, color: 'var(--amber)', icon: Ic.plg },
    { label: isAr ? 'طلبات هذا الأسبوع' : 'This week', value: weekOrders, color: 'var(--brand)', icon: Ic.box },
    { label: isAr ? 'إجمالي الكتب' : 'Total books', value: totalBooks, color: 'var(--info)', icon: Ic.book },
    { label: isAr ? 'نافد المخزون' : 'Out of stock', value: outStock, color: 'var(--danger)', icon: Ic.pin },
  ];
  // رسم أعمدة آخر ١٠ أيام
  const days = Array.from({ length: 10 }, (_, i) => {
    const start = Date.now() - (9 - i) * dayMs;
    const c = state.orders.filter(o => o.created_at >= start - dayMs / 2 && o.created_at < start + dayMs / 2).length;
    return c + (i % 3 === 0 ? 1 : 0) + (i === 7 ? 2 : 0); // بيانات توضيحية
  });
  const maxd = Math.max(...days, 1);
  const recent = state.orders.slice(0, 6);

  return (
    <div>
      <AdminHeader title={isAr ? 'لوحة التحكم' : 'Dashboard'} sub={isAr ? 'نظرة سريعة على صحّة المتجر' : 'Store health at a glance'}
        action={<div className="row" style={{ gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setSection('locations')}><Ic.pin style={{ width: 16, height: 16 }} /> {isAr ? 'إضافة موقع' : 'Add location'}</button>
          <button className="btn btn-primary" onClick={() => openBookForm(null)}><Ic.plus style={{ width: 16, height: 16 }} /> {isAr ? 'إضافة كتاب' : 'Add book'}</button>
        </div>} />
      <div style={{ padding: 'clamp(20px,3vw,32px)', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* بطاقات الإحصاء */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
          {stats.map((s, i) => (
            <div key={i} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="between">
                <span className="muted" style={{ fontSize: '.84rem', fontWeight: 700 }}>{s.label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `color-mix(in srgb, ${s.color} 16%, white)`, color: s.color, display: 'grid', placeItems: 'center' }}><s.icon style={{ width: 19, height: 19 }} /></div>
              </div>
              <b className="tnum" style={{ fontSize: '2.1rem', color: s.color, lineHeight: 1 }}>{s.value}</b>
            </div>
          ))}
        </div>

        <div className="col-collapse" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 22, alignItems: 'start' }}>
          {/* أحدث الطلبات */}
          <div className="card" style={{ padding: 22 }}>
            <div className="between" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.1rem' }}>{isAr ? 'أحدث الطلبات' : 'Recent orders'}</h3>
              <button className="seemore" style={{ color: 'var(--brand)', fontWeight: 700 }} onClick={() => setSection('orders')}>{isAr ? 'الكل' : 'All'}</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {recent.map(o => {
                const sc = STATUS_COLOR[o.status];
                return (
                  <button key={o.id} onClick={() => setSection('orders')} style={{ all: 'unset', cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, alignItems: 'center', padding: '10px 8px', borderRadius: 'var(--r-sm)', borderBottom: '1px solid var(--line-soft)' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{o.customer_name}</div>
                      <div className="muted tnum" style={{ fontSize: '.76rem' }} dir="ltr">{o.order_number} · {store.regionName(o.region)}{o.city ? ' / ' + o.city : ''}</div>
                    </div>
                    <span className="badge" style={{ background: sc.bg, color: sc.fg }}>{o.status}</span>
                    <b className="tnum" style={{ fontSize: '.9rem', color: 'var(--brand)' }}>{o.total} <span className="muted" style={{ fontSize: '.7rem', fontWeight: 700 }}>{WALID_DATA.symbolFor(o.currency || 'LYD', isAr ? 'ar' : 'en')}</span></b>
                  </button>
                );
              })}
            </div>
          </div>

          {/* رسم بياني */}
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{isAr ? 'الطلبات (آخر ١٠ أيام)' : 'Orders (last 10 days)'}</h3>
            <p className="muted" style={{ fontSize: '.8rem', marginBottom: 18 }}>{isAr ? 'توضيحي' : 'Illustrative'}</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, height: 150 }}>
              {days.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: '100%', height: `${(d / maxd) * 120}px`, minHeight: 4, background: i === days.length - 1 ? 'var(--brand)' : 'var(--amber-tint)', borderRadius: '5px 5px 0 0', transition: 'height .4s' }} title={d} />
                  <span className="tnum muted" style={{ fontSize: '.66rem' }}>{10 - i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- الطلبات ---------------- */
function AdminOrders({ store }) {
  const { state, regionName, book, setOrderStatus, buildWhatsappText } = store;
  const isAr = state.lang === 'ar';
  const [filter, setFilter] = useState('all');
  const [sel, setSel] = useState(null);
  const orders = state.orders.filter(o => filter === 'all' || o.status === filter);

  return (
    <div>
      <AdminHeader title={isAr ? 'الطلبات' : 'Orders'} sub={`${state.orders.length} ${isAr ? 'طلب' : 'orders'}`} />
      <div style={{ padding: 'clamp(20px,3vw,32px)' }}>
        <div className="scroll-x" style={{ marginBottom: 18, gap: 8 }}>
          <button className={`chip ${filter === 'all' ? 'is-active' : ''}`} onClick={() => setFilter('all')}>{isAr ? 'الكل' : 'All'} ({state.orders.length})</button>
          {ORDER_STATUSES.map(s => {
            const c = state.orders.filter(o => o.status === s).length;
            return <button key={s} className={`chip ${filter === s ? 'is-active' : ''}`} onClick={() => setFilter(s)}>{s} ({c})</button>;
          })}
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', textAlign: isAr ? 'right' : 'left' }}>
                  {[isAr ? 'رقم الطلب' : 'Order', isAr ? 'العميل' : 'Customer', isAr ? 'المنطقة' : 'Region', isAr ? 'الإجمالي' : 'Total', isAr ? 'الحالة' : 'Status', isAr ? 'الوقت' : 'Time', ''].map((h, i) =>
                    <th key={i} style={{ padding: '13px 16px', fontSize: '.8rem', fontWeight: 700, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => {
                  const sc = STATUS_COLOR[o.status];
                  const noWa = o.status === 'جديد' && !o.whatsapp_sent_at;
                  return (
                    <tr key={o.id} style={{ borderTop: '1px solid var(--line-soft)', background: noWa ? 'color-mix(in srgb, var(--amber-tint) 40%, transparent)' : 'transparent' }}>
                      <td style={{ padding: '12px 16px' }}><span className="tnum" dir="ltr" style={{ fontWeight: 700, fontSize: '.86rem' }}>{o.order_number}</span></td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{o.customer_name}</div>
                        <div className="muted tnum" dir="ltr" style={{ fontSize: '.76rem' }}>{o.customer_phone}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '.86rem' }}>{regionName(o.region)}{o.city ? <div className="muted" style={{ fontSize: '.74rem' }}>{o.city}</div> : null}</td>
                      <td style={{ padding: '12px 16px' }}><b className="tnum" style={{ color: 'var(--brand)' }}>{o.total} <span className="muted" style={{ fontSize: '.72rem', fontWeight: 700 }}>{WALID_DATA.symbolFor(o.currency || 'LYD', isAr ? 'ar' : 'en')}</span></b></td>
                      <td style={{ padding: '12px 16px' }}>
                        <select value={o.status} onChange={e => setOrderStatus(o.id, e.target.value)} className="select"
                          style={{ padding: '5px 10px', fontSize: '.8rem', fontWeight: 700, width: 'auto', borderRadius: 99, background: sc.bg, color: sc.fg, border: 'none' }}>
                          {ORDER_STATUSES.map(s => <option key={s} value={s} style={{ background: '#fff', color: 'var(--ink)' }}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '12px 16px' }} className="muted"><span style={{ fontSize: '.78rem', whiteSpace: 'nowrap' }}>{timeAgo(o.created_at, isAr)}</span>{noWa && <div style={{ fontSize: '.68rem', color: 'var(--amber)', fontWeight: 700 }}>{isAr ? '⚠ لم يُرسل لواتساب' : '⚠ no WA'}</div>}</td>
                      <td style={{ padding: '12px 16px' }}><button className="btn btn-soft btn-sm" onClick={() => setSel(o)}>{isAr ? 'تفاصيل' : 'View'}</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {sel && <OrderDrawer order={sel} store={store} onClose={() => setSel(null)} />}
    </div>
  );
}

function OrderDrawer({ order, store, onClose }) {
  const { state, regionName, setOrderStatus, buildWhatsappText } = store;
  const isAr = state.lang === 'ar';
  const sc = STATUS_COLOR[order.status];
  const c = WALID_DATA.symbolFor(order.currency || 'LYD', isAr ? 'ar' : 'en');
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(43,34,28,.5)' }} />
      <div className="fade-up" style={{ position: 'absolute', insetBlockStart: 0, insetInlineStart: 0, insetBlockEnd: 0, width: 'min(460px,92vw)', background: 'var(--surface)', boxShadow: 'var(--sh-lg)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div className="between" style={{ padding: 20, borderBottom: '1px solid var(--line)', position: 'sticky', insetBlockStart: 0, background: 'var(--surface)' }}>
          <div>
            <div className="tnum" dir="ltr" style={{ fontWeight: 800, fontSize: '1.1rem' }}>{order.order_number}</div>
            <span className="badge" style={{ background: sc.bg, color: sc.fg, marginTop: 4 }}>{order.status}</span>
          </div>
          <button className="btn btn-ghost" style={{ padding: '.55em', borderRadius: 99 }} onClick={onClose}><Ic.x style={{ width: 18, height: 18 }} /></button>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <div className="muted" style={{ fontSize: '.76rem', fontWeight: 700, marginBottom: 8 }}>{isAr ? 'بيانات العميل' : 'Customer'}</div>
            <div className="card" style={{ padding: 14, background: 'var(--surface-2)', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '.9rem' }}>
              <b>{order.customer_name}</b>
              <span className="tnum" dir="ltr">{order.customer_phone}</span>
              <span className="muted">{regionName(order.region)}{order.city ? ' / ' + order.city : ''} — {order.address}</span>
              {order.notes && <span style={{ color: 'var(--amber)', fontSize: '.84rem' }}>📝 {order.notes}</span>}
            </div>
          </div>
          <div>
            <div className="muted" style={{ fontSize: '.76rem', fontWeight: 700, marginBottom: 8 }}>{isAr ? 'العناصر (نُسَخ وقت الطلب)' : 'Items (snapshots)'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {order.items.map((it, i) => (
                <div key={i} className="between" style={{ fontSize: '.9rem' }}>
                  <span>{it.title} <span className="muted tnum">× {it.qty}</span></span>
                  <b className="tnum">{it.price * it.qty} {c}</b>
                </div>
              ))}
            </div>
          </div>
          <hr className="divider" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="between"><span className="muted">{isAr ? 'الإجمالي الفرعي' : 'Subtotal'}</span><span className="tnum">{order.subtotal} {c}</span></div>
            <div className="between"><span className="muted">{isAr ? 'التوصيل' : 'Shipping'}</span><span className="tnum">{order.shipping} {c}</span></div>
            <div className="between"><b>{isAr ? 'الإجمالي' : 'Total'}</b><b className="tnum" style={{ color: 'var(--brand)', fontSize: '1.2rem' }}>{order.total} {c}</b></div>
          </div>
          <div className="field">
            <label>{isAr ? 'تغيير الحالة' : 'Change status'}</label>
            <select className="select" value={order.status} onChange={e => setOrderStatus(order.id, e.target.value)}>
              {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <a className="btn btn-wa btn-block" href={`https://wa.me/${waNumber(order)}`} target="_blank"><Ic.wa /> {isAr ? 'فتح محادثة واتساب' : 'Open WhatsApp chat'}</a>
        </div>
      </div>
    </div>
  );
}

/* ---------------- إدارة المستخدمين (للمدير العام) ---------------- */
function AdminUsers({ store }) {
  const { state, isSuper, deleteUser } = store;
  const isAr = state.lang === 'ar';
  const [editing, setEditing] = useState(null); // user obj | 'new' marker
  const me = store.currentUser();

  if (!isSuper()) {
    return <div style={{ padding: 'clamp(20px,3vw,32px)' }}><div className="card" style={{ padding: 32, textAlign: 'center' }}><Ic.shield style={{ width: 34, height: 34, color: 'var(--muted)' }} /><h3 style={{ marginTop: 10 }}>{isAr ? 'هذا القسم للمدير العام فقط' : 'Super admin only'}</h3></div></div>;
  }

  return (
    <div>
      <AdminHeader title={isAr ? 'المستخدمون' : 'Users'} sub={isAr ? 'إنشاء مستخدمي اللوحة وتحديد صلاحياتهم' : 'Create dashboard users and set their permissions'}
        action={<button className="btn btn-primary" onClick={() => setEditing({ name: '', email: '', password: '', role: 'admin', perms: ['dashboard'], is_active: true })}><Ic.plus style={{ width: 16, height: 16 }} /> {isAr ? 'إضافة مستخدم' : 'Add user'}</button>} />
      <div style={{ padding: 'clamp(20px,3vw,32px)' }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', textAlign: isAr ? 'right' : 'left' }}>
                  {[isAr ? 'الاسم' : 'Name', isAr ? 'البريد' : 'Email', isAr ? 'الدور' : 'Role', isAr ? 'الصلاحيات' : 'Permissions', isAr ? 'الحالة' : 'Status', ''].map((h, i) =>
                    <th key={i} style={{ padding: '13px 16px', fontSize: '.8rem', fontWeight: 700, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {state.users.map(u => (
                  <tr key={u.id} style={{ borderTop: '1px solid var(--line-soft)', opacity: u.is_active === false ? .5 : 1 }}>
                    <td style={{ padding: '12px 16px' }}><b style={{ fontSize: '.92rem' }}>{u.name}</b>{u.id === me.id && <span className="badge badge-soft" style={{ marginInlineStart: 8 }}>{isAr ? 'أنت' : 'you'}</span>}</td>
                    <td style={{ padding: '12px 16px', fontSize: '.86rem' }} dir="ltr">{u.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge" style={{ background: u.role === 'super' ? 'var(--brand-tint)' : 'var(--amber-tint)', color: u.role === 'super' ? 'var(--brand-deep)' : 'var(--amber)', fontWeight: 700 }}>
                        {u.role === 'super' ? (isAr ? 'مدير عام' : 'Super') : (isAr ? 'مستخدم' : 'Admin')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '.78rem', color: 'var(--ink-soft)' }}>
                      {u.role === 'super' ? (isAr ? 'الكل' : 'All') : (u.perms || []).map(p => { const def = WALID_DATA.PERMISSIONS.find(x => x.id === p); return def ? (isAr ? def.ar : def.en) : p; }).join('، ') || '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge" style={{ background: u.is_active === false ? 'var(--surface-3)' : 'var(--amber-tint)', color: u.is_active === false ? 'var(--muted)' : 'var(--success)' }}>
                        <span className="badge-dot" />{u.is_active === false ? (isAr ? 'معطّل' : 'Off') : (isAr ? 'مفعّل' : 'Active')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="row" style={{ gap: 4 }}>
                        <button className="btn btn-quiet btn-sm" style={{ padding: '.5em' }} onClick={() => setEditing(u)}><Ic.edit style={{ width: 16, height: 16 }} /></button>
                        {u.id !== me.id && <button className="btn btn-quiet btn-sm" style={{ color: 'var(--danger)', padding: '.5em' }} onClick={() => { if (confirm(isAr ? 'حذف هذا المستخدم؟' : 'Delete this user?')) deleteUser(u.id); }}><Ic.trash style={{ width: 16, height: 16 }} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="hint" style={{ marginTop: 12 }}>{isAr ? 'المدير العام يملك كل الصلاحيات. للمستخدم العادي، حدّد الأقسام المسموح له بها.' : 'Super admins have all permissions. For regular users, pick the sections they may access.'}</p>
      </div>
      {editing && <UserFormModal store={store} editing={editing.id ? editing : null} initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function UserFormModal({ store, editing, initial, onClose }) {
  const isAr = store.state.lang === 'ar';
  const [f, setF] = useState({ ...initial, perms: [...(initial.perms || [])] });
  const [err, setErr] = useState('');
  function set(k, v) { setF(p => ({ ...p, [k]: v })); }
  function togglePerm(id) {
    setF(p => { const has = (p.perms || []).includes(id); return { ...p, perms: has ? p.perms.filter(x => x !== id) : [...p.perms, id] }; });
  }
  const editingSelf = editing && editing.id === store.currentUser().id;
  function submit(e) {
    e.preventDefault();
    if (!f.name.trim()) { setErr(isAr ? 'الاسم مطلوب' : 'Name required'); return; }
    if (!/^\S+@\S+\.\S+$/.test(f.email)) { setErr(isAr ? 'بريد غير صالح' : 'Invalid email'); return; }
    if (!editing && (f.password || '').length < 4) { setErr(isAr ? 'كلمة المرور ٤ أحرف على الأقل' : 'Password 4+ chars'); return; }
    const payload = { ...f };
    if (editing && !f.password) delete payload.password;   // لا تغيّر كلمة المرور إن تُركت فارغة
    if (store.saveUser(payload)) { store.toast(isAr ? 'تم حفظ المستخدم ✓' : 'User saved ✓'); onClose(); }
    else setErr(isAr ? 'تعذّر الحفظ (البريد مستخدم؟)' : 'Could not save (email taken?)');
  }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(43,34,28,.55)' }} />
      <form onSubmit={submit} className="card fade-up" style={{ position: 'absolute', insetInline: 0, insetBlock: 0, margin: 'auto', width: 'min(520px,94vw)', height: 'max-content', maxHeight: '92vh', overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="between"><h2 style={{ fontSize: '1.2rem' }}>{editing ? (isAr ? 'تعديل مستخدم' : 'Edit user') : (isAr ? 'إضافة مستخدم' : 'Add user')}</h2>
          <button type="button" className="btn btn-ghost" style={{ padding: '.5em', borderRadius: 99 }} onClick={onClose}><Ic.x style={{ width: 18, height: 18 }} /></button></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field"><label>{isAr ? 'الاسم' : 'Name'} <span className="req">*</span></label><input className="input" value={f.name} onChange={e => set('name', e.target.value)} /></div>
          <div className="field"><label>{isAr ? 'البريد الإلكتروني' : 'Email'} <span className="req">*</span></label><input className="input" type="email" value={f.email} onChange={e => set('email', e.target.value)} dir="ltr" /></div>
        </div>
        <div className="field"><label>{isAr ? (editing ? 'كلمة مرور جديدة (اتركها فارغة للإبقاء)' : 'كلمة المرور') : (editing ? 'New password (blank = keep)' : 'Password')} {!editing && <span className="req">*</span>}</label><input className="input" type="password" value={f.password || ''} onChange={e => set('password', e.target.value)} dir="ltr" placeholder={editing ? '••••••' : ''} /></div>
        <div className="field"><label>{isAr ? 'الدور' : 'Role'}</label>
          <select className="select" value={f.role} onChange={e => set('role', e.target.value)} disabled={editingSelf}>
            <option value="admin">{isAr ? 'مستخدم (صلاحيات محدّدة)' : 'Admin (limited)'}</option>
            <option value="super">{isAr ? 'مدير عام (كل الصلاحيات)' : 'Super admin (all)'}</option>
          </select>
          {editingSelf && <span className="hint">{isAr ? 'لا يمكنك تغيير دورك الخاص.' : "You can't change your own role."}</span>}
        </div>
        {f.role !== 'super' && (
          <div className="card" style={{ padding: 14, background: 'var(--surface-2)' }}>
            <div className="muted" style={{ fontSize: '.8rem', fontWeight: 700, marginBottom: 10 }}>{isAr ? 'الأقسام المسموح بها' : 'Allowed sections'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 8 }}>
              {WALID_DATA.PERMISSIONS.filter(p => p.id !== 'users').map(p => (
                <label key={p.id} className="row" style={{ gap: 8, fontSize: '.88rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input type="checkbox" checked={(f.perms || []).includes(p.id)} onChange={() => togglePerm(p.id)} style={{ width: 17, height: 17, accentColor: 'var(--brand)' }} />
                  {isAr ? p.ar : p.en}
                </label>
              ))}
            </div>
            <p className="hint" style={{ marginTop: 8 }}>{isAr ? 'قسم «المستخدمون» متاح للمدير العام فقط.' : 'The “Users” section is super-admin only.'}</p>
          </div>
        )}
        <label className="row" style={{ gap: 10, fontWeight: 600, cursor: 'pointer' }}><input type="checkbox" checked={f.is_active !== false} onChange={e => set('is_active', e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--brand)' }} disabled={editingSelf} /> {isAr ? 'مفعّل' : 'Active'}</label>
        {err && <span className="err-msg">{err}</span>}
        <div className="row" style={{ gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={onClose}>{isAr ? 'إلغاء' : 'Cancel'}</button>
          <button type="submit" className="btn btn-primary">{isAr ? 'حفظ' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}

Object.assign(window, { ORDER_STATUSES, STATUS_COLOR, waNumber, timeAgo, AdminLogin, AdminLayout, AdminHeader, AdminDashboard, AdminOrders, OrderDrawer, AdminUsers, UserFormModal });
