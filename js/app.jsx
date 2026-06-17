/* =========================================================
   الراوتر + تجميع التطبيق
   ========================================================= */

function AdminApp({ store, nav }) {
  const { state } = store;
  const [section, setSection] = useState('dashboard');
  const [bookForm, setBookForm] = useState(undefined); // undefined=closed, null=new, obj=edit
  const isAr = state.lang === 'ar';

  if (!state.admin.authed) return <AdminLogin store={store} nav={nav} />;

  const openBookForm = (b) => setBookForm(b);
  const closeBookForm = () => setBookForm(undefined);

  return (
    <AdminLayout store={store} nav={nav} section={section} setSection={setSection}>
      {section === 'dashboard' && <AdminDashboard store={store} setSection={setSection} openBookForm={openBookForm} />}
      {section === 'books' && <AdminBooks store={store} openBookForm={openBookForm} />}
      {section === 'orders' && <AdminOrders store={store} />}
      {section === 'settings' && <AdminSettings store={store} />}
      {bookForm !== undefined && <BookFormModal store={store} editing={bookForm} onClose={closeBookForm} />}
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

  const isAdmin = route.name === 'admin';

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
