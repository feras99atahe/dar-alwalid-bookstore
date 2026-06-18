/* =========================================================
   الراوتر + تجميع التطبيق
   ========================================================= */

function AdminApp({ store, nav }) {
  const [section, setSection] = useState('dashboard');
  const [bookForm, setBookForm] = useState(undefined); // undefined=closed, null=new, obj=edit

  if (!store.isAuthed()) return <AdminLogin store={store} nav={nav} />;

  // القسم الفعّال = المطلوب إن كان مسموحاً، وإلا أول قسم متاح للمستخدم
  const allowed = ['dashboard', 'books', 'orders', 'settings', 'users'].filter(s => store.can(s));
  const sec = allowed.includes(section) ? section : (allowed[0] || 'dashboard');

  const openBookForm = (b) => setBookForm(b);
  const closeBookForm = () => setBookForm(undefined);

  return (
    <AdminLayout store={store} nav={nav} section={sec} setSection={setSection}>
      {sec === 'dashboard' && <AdminDashboard store={store} setSection={setSection} openBookForm={openBookForm} />}
      {sec === 'books' && <AdminBooks store={store} openBookForm={openBookForm} />}
      {sec === 'orders' && <AdminOrders store={store} />}
      {sec === 'settings' && <AdminSettings store={store} />}
      {sec === 'users' && <AdminUsers store={store} />}
      {bookForm !== undefined && store.can('books') && <BookFormModal store={store} editing={bookForm} onClose={closeBookForm} />}
    </AdminLayout>
  );
}

function App() {
  const store = useWalidStore();
  const [route, setRoute] = useState(() => parseHash());

  function parseHash() {
    const h = (location.hash || '#home').slice(1);
    const [name, qs] = h.split('?');
    const params = {};
    if (qs) new URLSearchParams(qs).forEach((v, k) => { params[k] = v; });
    return { name: name || 'home', params };
  }

  function nav(name, params = {}) {
    const qs = new URLSearchParams(params).toString();
    location.hash = name + (qs ? '?' + qs : '');
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // كشف موقع المستخدم تلقائياً عبر IP عند أول تحميل (لا يتجاوز اختياره اليدوي)
  useEffect(() => { store.autoDetectRegion(); }, []);

  const isAdmin = route.name === 'admin' || route.name === 'dashboard';

  // صفحات المتجر مع الهيكل
  if (isAdmin) {
    return <><AdminApp store={store} nav={nav} /><Toast store={store} /></>;
  }

  let page;
  switch (route.name) {
    case 'catalog': page = <CatalogPage store={store} nav={nav} params={route.params} />; break;
    case 'book': page = <BookDetailPage store={store} nav={nav} params={route.params} />; break;
    case 'cart': page = <CartPage store={store} nav={nav} />; break;
    case 'checkout': page = <CheckoutPage store={store} nav={nav} />; break;
    case 'about': page = <AboutPage store={store} nav={nav} />; break;
    default: page = <HomePage store={store} nav={nav} />;
  }

  return (
    <>
      <Header store={store} route={route} nav={nav} />
      <div key={route.name + JSON.stringify(route.params)}>{page}</div>
      <Footer store={store} nav={nav} />
      <Toast store={store} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
