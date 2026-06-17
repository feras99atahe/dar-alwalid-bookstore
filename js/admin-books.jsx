/* =========================================================
   لوحة الإدارة — إدارة الكتب (+ أسعار المواقع) · إدارة المواقع
   ========================================================= */

/* ---------------- إدارة الكتب ---------------- */
function AdminBooks({ store, openBookForm }) {
  const { state, category, softDeleteBook } = store;
  const isAr = state.lang === 'ar';
  const [q, setQ] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [bulk, setBulk] = useState(false);
  let books = state.books.filter(b => showInactive || b.is_active);
  if (q.trim()) {
    const s = q.toLowerCase();
    books = books.filter(b => (b.title_ar + b.title_en + b.author_ar).toLowerCase().includes(s));
  }
  return (
    <div>
      <AdminHeader title={isAr ? 'إدارة الكتب' : 'Books'} sub={`${state.books.filter(b => b.is_active).length} ${isAr ? 'كتاب مفعّل' : 'active'}`}
        action={<div className="row" style={{ gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setBulk(true)}><Ic.box style={{ width: 16, height: 16 }} /> {isAr ? 'استيراد مجمّع' : 'Bulk import'}</button>
          <button className="btn btn-primary" onClick={() => openBookForm(null)}><Ic.plus style={{ width: 16, height: 16 }} /> {isAr ? 'إضافة كتاب' : 'Add book'}</button>
        </div>} />
      <div style={{ padding: 'clamp(20px,3vw,32px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="row wrap" style={{ gap: 12 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220, maxWidth: 360 }}>
            <Ic.search style={{ position: 'absolute', insetInlineStart: 12, insetBlockStart: '50%', transform: 'translateY(-50%)', width: 17, height: 17, color: 'var(--muted)' }} />
            <input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder={isAr ? 'ابحث في الكتب…' : 'Search books…'} style={{ paddingInlineStart: 38 }} />
          </div>
          <label className="row" style={{ gap: 8, fontSize: '.88rem', fontWeight: 600, cursor: 'pointer' }}>
            <input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)} style={{ width: 17, height: 17, accentColor: 'var(--brand)' }} />
            {isAr ? 'إظهار المحذوف' : 'Show inactive'}
          </label>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', textAlign: isAr ? 'right' : 'left' }}>
                  {['', isAr ? 'العنوان' : 'Title', isAr ? 'التصنيف' : 'Category', isAr ? 'السعر الأساسي' : 'Base price', isAr ? 'المخزون' : 'Stock', isAr ? 'مفعّل' : 'Active', ''].map((h, i) =>
                    <th key={i} style={{ padding: '12px 16px', fontSize: '.8rem', fontWeight: 700, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {books.map(b => {
                  const cat = category(b.cat);
                  return (
                    <tr key={b.id} style={{ borderTop: '1px solid var(--line-soft)', opacity: b.is_active ? 1 : .5 }}>
                      <td style={{ padding: '10px 16px' }}><div style={{ width: 34, flex: 'none' }}><BookCover book={b} /></div></td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{b.title_ar}</div>
                        <div className="muted" style={{ fontSize: '.78rem' }}>{b.author_ar}</div>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: '.85rem' }}><span className="badge-soft badge">{cat?.name_ar}</span></td>
                      <td style={{ padding: '10px 16px' }}><b className="tnum">{b.base_price}</b> <span className="muted" style={{ fontSize: '.75rem' }}>د.ل</span>
                        <div className="tnum" style={{ fontSize: '.68rem', color: 'var(--info)', fontWeight: 700 }} dir="ltr">{Number(b.price_usd) > 0 ? b.price_usd : WALID_DATA.convertFromLyd(b.base_price, 'USD', (state.settings && state.settings.usdRate) || 5)} $</div>
                      </td>
                      <td style={{ padding: '10px 16px' }}><span className="tnum" style={{ fontWeight: 700, color: b.stock <= 0 ? 'var(--danger)' : b.stock < 5 ? 'var(--amber)' : 'var(--ink)' }}>{b.stock}</span></td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 99, background: b.is_active ? 'var(--success)' : 'var(--muted-2)' }} />
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <div className="row" style={{ gap: 4 }}>
                          <button className="btn btn-quiet btn-sm" onClick={() => openBookForm(b)} title={isAr ? 'تعديل' : 'Edit'} style={{ padding: '.5em' }}><Ic.edit style={{ width: 16, height: 16 }} /></button>
                          {b.is_active && <button className="btn btn-quiet btn-sm" style={{ color: 'var(--danger)', padding: '.5em' }} onClick={() => { if (confirm(isAr ? 'حذف ناعم لهذا الكتاب؟ (يبقى في الطلبات القديمة)' : 'Soft delete?')) softDeleteBook(b.id); }} title={isAr ? 'حذف' : 'Delete'}><Ic.trash style={{ width: 16, height: 16 }} /></button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {bulk && <BulkImportModal store={store} onClose={() => setBulk(false)} />}
    </div>
  );
}

/* ---------------- نموذج إضافة/تعديل كتاب ---------------- */
function BookFormModal({ store, editing, onClose }) {
  const { state, saveBook } = store;
  const isAr = state.lang === 'ar';
  const cats = state.categories;
  const usdRate = (state.settings && state.settings.usdRate) || 5;
  const [f, setF] = useState(() => editing ? { ...editing } : {
    title_ar: '', title_en: '', subtitle_ar: '', author_ar: '', author_en: '', cat: cats[0].id, desc_ar: '',
    isbn: '', year: 2024, pages: 100, base_price: 30, price_usd: 6, stock: 10, cover: 'cv-maroon', image: '', pub: 'AlWalid',
    cover_note: 'cover: warm tone + title', is_active: true,
    publisher_ar: 'دار الوليد للنشر والتوزيع', translator_ar: '', language_ar: 'العربية',
    format_ar: 'غلاف ورقي', edition_ar: 'الطبعة الأولى', dimensions: '14 × 21.5 سم', weight_g: 160,
  });
  const [errors, setErrors] = useState({});
  const covers = ['cv-maroon', 'cv-teal', 'cv-navy', 'cv-amber', 'cv-olive', 'cv-plum', 'cv-rust', 'cv-forest', 'cv-ink', 'cv-clay', 'cv-sea', 'cv-wine'];

  function set(k, v) { setF(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: null })); }
  function onImage(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { store.toast(isAr ? 'الرجاء اختيار ملف صورة' : 'Please choose an image file'); return; }
    if (file.size > 2 * 1024 * 1024) { store.toast(isAr ? 'حجم الصورة كبير (الحد 2 ميغابايت)' : 'Image too large (max 2MB)'); return; }
    const r = new FileReader();
    r.onload = () => set('image', r.result);
    r.readAsDataURL(file);
  }
  function submit(e) {
    e.preventDefault();
    const er = {};
    if (!f.title_ar.trim()) er.title_ar = isAr ? 'العنوان مطلوب' : 'Required';
    if (f.base_price < 0 || f.base_price === '') er.base_price = isAr ? 'سعر غير صالح' : 'Invalid';
    setErrors(er);
    if (Object.keys(er).length) return;
    saveBook({ ...f, base_price: Number(f.base_price), price_usd: Number(f.price_usd) || 0, stock: Number(f.stock), year: Number(f.year), pages: Number(f.pages), weight_g: Number(f.weight_g) || 0, title_en: f.title_en || f.title_ar, author_en: f.author_en || f.author_ar });
    store.toast(isAr ? 'تم حفظ الكتاب ✓' : 'Saved ✓');
    onClose();
  }

  const preview = { ...f, title_ar: f.title_ar || (isAr ? 'عنوان الكتاب' : 'Book title'), author_ar: f.author_ar || '—', title_en: f.title_en || f.title_ar || 'Title', author_en: f.author_en || f.author_ar || '—' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(43,34,28,.55)' }} />
      <div className="fade-up" style={{ position: 'absolute', insetInline: 0, insetBlockEnd: 0, insetBlockStart: 0, margin: 'auto', width: 'min(820px,96vw)', maxHeight: '94vh', background: 'var(--surface)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="between" style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)' }}>
          <h2 style={{ fontSize: '1.25rem' }}>{editing ? (isAr ? 'تعديل كتاب' : 'Edit book') : (isAr ? 'إضافة كتاب' : 'Add book')}</h2>
          <button className="btn btn-ghost" style={{ padding: '.55em', borderRadius: 99 }} onClick={onClose}><Ic.x style={{ width: 18, height: 18 }} /></button>
        </div>
        <form onSubmit={submit} className="modal-split" style={{ overflowY: 'auto', padding: 24, display: 'grid', gridTemplateColumns: '150px 1fr', gap: 24, alignItems: 'start' }}>
          {/* المعاينة + الغلاف */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', insetBlockStart: 0 }}>
            <BookCover book={preview} />
            <label className="btn btn-soft btn-sm btn-block" style={{ cursor: 'pointer' }}>
              <Ic.plg style={{ width: 16, height: 16 }} /> {f.image ? (isAr ? 'تغيير الصورة' : 'Change image') : (isAr ? 'رفع صورة الغلاف' : 'Upload cover')}
              <input type="file" accept="image/*" onChange={onImage} style={{ display: 'none' }} />
            </label>
            {f.image && <button type="button" className="btn btn-quiet btn-sm" style={{ color: 'var(--danger)' }} onClick={() => set('image', '')}><Ic.trash style={{ width: 15, height: 15 }} /> {isAr ? 'إزالة الصورة' : 'Remove image'}</button>}
            <div style={{ opacity: f.image ? .45 : 1 }}>
              <div className="muted" style={{ fontSize: '.74rem', fontWeight: 700, marginBottom: 6 }}>{isAr ? 'لون الغلاف (بديل بلا صورة)' : 'Cover color (fallback)'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 5 }}>
                {covers.map(c => (
                  <button key={c} type="button" onClick={() => set('cover', c)} className={`bookcover ${c}`} style={{ aspectRatio: '1', padding: 0, borderRadius: 6, outline: f.cover === c ? '2.5px solid var(--brand)' : 'none', outlineOffset: 2, cursor: 'pointer' }} />
                ))}
              </div>
            </div>
          </div>

          {/* الحقول */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className={`field ${errors.title_ar ? 'field-error' : ''}`}>
                <label>{isAr ? 'العنوان (عربي)' : 'Title (AR)'} <span className="req">*</span></label>
                <input className="input" value={f.title_ar} onChange={e => set('title_ar', e.target.value)} />
                {errors.title_ar && <span className="err-msg">{errors.title_ar}</span>}
              </div>
              <div className="field"><label>{isAr ? 'العنوان (إنجليزي)' : 'Title (EN)'}</label><input className="input" value={f.title_en} onChange={e => set('title_en', e.target.value)} dir="ltr" /></div>
              <div className="field"><label>{isAr ? 'المؤلف (عربي)' : 'Author (AR)'}</label><input className="input" value={f.author_ar} onChange={e => set('author_ar', e.target.value)} /></div>
              <div className="field"><label>{isAr ? 'المؤلف (إنجليزي)' : 'Author (EN)'}</label><input className="input" value={f.author_en} onChange={e => set('author_en', e.target.value)} dir="ltr" /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
              <div className="field"><label>{isAr ? 'التصنيف' : 'Category'}</label>
                <select className="select" value={f.cat} onChange={e => set('cat', e.target.value)}>{cats.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}</select>
              </div>
              <div className="field"><label>{isAr ? 'الناشر' : 'Publisher'}</label><input className="input" value={f.pub} onChange={e => set('pub', e.target.value)} /></div>
            </div>
            <div className="field"><label>{isAr ? 'الوصف' : 'Description'}</label><textarea className="textarea" value={f.desc_ar} onChange={e => set('desc_ar', e.target.value)} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 12 }}>
              <div className={`field ${errors.base_price ? 'field-error' : ''}`}><label>{isAr ? 'السعر داخل ليبيا (د.ل)' : 'Price in Libya (LYD)'} <span className="req">*</span></label><input className="input tnum" type="number" min="0" value={f.base_price} onChange={e => set('base_price', e.target.value)} />
                {errors.base_price && <span className="err-msg">{errors.base_price}</span>}
              </div>
              <div className="field"><label>{isAr ? 'السعر خارج ليبيا ($)' : 'Price outside Libya ($)'}</label><input className="input tnum" type="number" min="0" step="0.5" value={f.price_usd} onChange={e => set('price_usd', e.target.value)} />
                <button type="button" className="btn btn-quiet btn-sm" style={{ paddingInline: 0, color: 'var(--brand)', alignSelf: 'flex-start' }} onClick={() => set('price_usd', WALID_DATA.convertFromLyd(Number(f.base_price) || 0, 'USD', usdRate))}>{isAr ? `احسب من الدينار (÷${usdRate})` : `From LYD (÷${usdRate})`}</button>
              </div>
              <div className="field"><label>{isAr ? 'المخزون' : 'Stock'}</label><input className="input tnum" type="number" min="0" value={f.stock} onChange={e => set('stock', e.target.value)} /></div>
              <div className="field"><label>ISBN</label><input className="input tnum" value={f.isbn} onChange={e => set('isbn', e.target.value)} dir="ltr" /></div>
              <div className="field"><label>{isAr ? 'سنة النشر' : 'Year'}</label><input className="input tnum" type="number" value={f.year} onChange={e => set('year', e.target.value)} /></div>
            </div>

            {/* تفاصيل المنتج */}
            <div className="card" style={{ padding: 16, background: 'var(--surface-2)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h4 className="row" style={{ gap: 8, fontSize: '.98rem' }}><Ic.book style={{ width: 17, height: 17, color: 'var(--brand)' }} /> {isAr ? 'تفاصيل المنتج' : 'Product details'}</h4>
              <div className="field"><label>{isAr ? 'عنوان فرعي' : 'Subtitle'} <span className="hint">({isAr ? 'اختياري' : 'optional'})</span></label><input className="input" value={f.subtitle_ar || ''} onChange={e => set('subtitle_ar', e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
                <div className="field"><label>{isAr ? 'الناشر' : 'Publisher'}</label><input className="input" value={f.publisher_ar || ''} onChange={e => set('publisher_ar', e.target.value)} /></div>
                <div className="field"><label>{isAr ? 'المترجم' : 'Translator'} <span className="hint">({isAr ? 'للكتب المترجمة' : 'translated'})</span></label><input className="input" value={f.translator_ar || ''} onChange={e => set('translator_ar', e.target.value)} /></div>
                <div className="field"><label>{isAr ? 'اللغة' : 'Language'}</label><input className="input" value={f.language_ar || ''} onChange={e => set('language_ar', e.target.value)} /></div>
                <div className="field"><label>{isAr ? 'نوع التغليف' : 'Format'}</label>
                  <select className="select" value={f.format_ar || 'غلاف ورقي'} onChange={e => set('format_ar', e.target.value)}>
                    <option value="غلاف ورقي">{isAr ? 'غلاف ورقي' : 'Paperback'}</option>
                    <option value="غلاف مُجلّد">{isAr ? 'غلاف مُجلّد' : 'Hardcover'}</option>
                  </select>
                </div>
                <div className="field"><label>{isAr ? 'الطبعة' : 'Edition'}</label><input className="input" value={f.edition_ar || ''} onChange={e => set('edition_ar', e.target.value)} /></div>
                <div className="field"><label>{isAr ? 'الأبعاد' : 'Dimensions'}</label><input className="input" value={f.dimensions || ''} onChange={e => set('dimensions', e.target.value)} dir="ltr" /></div>
                <div className="field"><label>{isAr ? 'الوزن (غرام)' : 'Weight (g)'}</label><input className="input tnum" type="number" min="0" value={f.weight_g ?? ''} onChange={e => set('weight_g', e.target.value)} /></div>
              </div>
            </div>

            <label className="row" style={{ gap: 10, fontWeight: 600, cursor: 'pointer' }}>
              <input type="checkbox" checked={f.is_active} onChange={e => set('is_active', e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--brand)' }} />
              {isAr ? 'مفعّل (يظهر في المتجر)' : 'Active (visible in store)'}
            </label>

            <div className="row" style={{ gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>{isAr ? 'إلغاء' : 'Cancel'}</button>
              <button type="submit" className="btn btn-primary"><Ic.check style={{ width: 17, height: 17 }} /> {isAr ? 'حفظ الكتاب' : 'Save book'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- استيراد مجمّع (CSV / JSON) ---------------- */
// محلّل CSV يدعم الحقول المقتبسة والفواصل داخلها
function parseCSV(text) {
  const rows = []; let i = 0, field = '', row = [], inQ = false;
  while (i < text.length) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue; } inQ = false; i++; continue; }
      field += ch; i++; continue;
    }
    if (ch === '"') { inQ = true; i++; continue; }
    if (ch === ',') { row.push(field); field = ''; i++; continue; }
    if (ch === '\r') { i++; continue; }
    if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
    field += ch; i++;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(c => (c || '').trim() !== ''));
}

// كل أعمدة الاستيراد: req=إلزامي. باقي الأعمدة اختيارية وتُملأ تلقائياً عند تركها فارغة.
const BULK_FIELDS = [
  { k: 'title_ar',      req: true,  ar: 'العنوان (عربي)',         en: 'Title (Arabic)', sample: 'موسم الهجرة إلى الشمال' },
  { k: 'base_price',    req: true,  ar: 'السعر داخل ليبيا (د.ل)', en: 'Price in Libya (LYD)', sample: '35' },
  { k: 'price_usd',     req: false, ar: 'السعر خارج ليبيا ($)',   en: 'Price outside Libya (USD)', sample: '7' },
  { k: 'title_en',      req: false, ar: 'العنوان (إنجليزي)',      en: 'Title (English)', sample: 'Season of Migration' },
  { k: 'subtitle_ar',   req: false, ar: 'عنوان فرعي',             en: 'Subtitle', sample: '' },
  { k: 'author_ar',     req: false, ar: 'المؤلف (عربي)',          en: 'Author (Arabic)', sample: 'الطيب صالح' },
  { k: 'author_en',     req: false, ar: 'المؤلف (إنجليزي)',       en: 'Author (English)', sample: 'Tayeb Salih' },
  { k: 'category',      req: false, ar: 'التصنيف',                en: 'Category', sample: 'روايات عربية' },
  { k: 'stock',         req: false, ar: 'المخزون',                en: 'Stock', sample: '14' },
  { k: 'isbn',          req: false, ar: 'ردمك ISBN',              en: 'ISBN', sample: '9789953701004' },
  { k: 'year',          req: false, ar: 'سنة النشر',              en: 'Year', sample: '1966' },
  { k: 'pages',         req: false, ar: 'عدد الصفحات',            en: 'Pages', sample: '169' },
  { k: 'publisher_ar',  req: false, ar: 'الناشر',                 en: 'Publisher', sample: 'دار الوليد' },
  { k: 'translator_ar', req: false, ar: 'المترجم',               en: 'Translator', sample: '' },
  { k: 'language_ar',   req: false, ar: 'اللغة',                  en: 'Language', sample: 'العربية' },
  { k: 'format_ar',     req: false, ar: 'نوع التغليف',           en: 'Format', sample: 'غلاف ورقي' },
  { k: 'edition_ar',    req: false, ar: 'الطبعة',                 en: 'Edition', sample: 'الطبعة الأولى' },
  { k: 'dimensions',    req: false, ar: 'الأبعاد',                en: 'Dimensions', sample: '14 × 21.5 سم' },
  { k: 'weight_g',      req: false, ar: 'الوزن (غرام)',          en: 'Weight (g)', sample: '270' },
  { k: 'description',   req: false, ar: 'الوصف',                  en: 'Description', sample: 'رائعة الأدب العربي الحديث' },
  { k: 'image',         req: false, ar: 'رابط صورة الغلاف',       en: 'Cover image URL', sample: '' },
];
const BULK_COLS = BULK_FIELDS.map(f => f.k);
const BULK_REQ = BULK_FIELDS.filter(f => f.req).map(f => f.k);

function BulkImportModal({ store, onClose }) {
  const { state } = store;
  const isAr = state.lang === 'ar';
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState(null); // {books, errors}
  const cats = state.categories;

  // خريطة التصنيف: اسم عربي/إنجليزي/slug/id → id
  function catId(v) {
    const s = String(v || '').trim().toLowerCase();
    if (!s) return cats[0].id;
    const m = cats.find(c => [c.id, c.slug, c.name_ar, c.name_en].some(x => String(x).toLowerCase() === s));
    return m ? m.id : cats[0].id;
  }

  function buildFromCSV(t) {
    const rows = parseCSV(t);
    if (!rows.length) return { books: [], errors: [isAr ? 'لا توجد بيانات' : 'No data'] };
    const header = rows[0].map(h => h.trim().toLowerCase().replace(/\*+$/, ''));
    if (!header.includes('title_ar') && !header.includes('title_en'))
      return { books: [], errors: [isAr ? 'العمود title_ar مفقود في الترويسة' : 'Missing title_ar column in header'] };
    const books = [], errors = [];
    for (let r = 1; r < rows.length; r++) {
      const o = {}; header.forEach((h, i) => { o[h] = (rows[r][i] || '').trim(); });
      const title = o.title_ar || o.title_en;
      if (!title) continue;                                  // صف فارغ — تجاهل صامت
      if (!o.base_price) { errors.push((isAr ? 'بلا سعر (تجاهل): ' : 'No price (skipped): ') + title); continue; }
      const bk = {};
      header.forEach(h => {
        const v = o[h]; if (v === '') return;
        if (h === 'category') bk.cat = catId(v);
        else if (h === 'description') bk.desc_ar = v;
        else bk[h] = v;                                      // باقي الأعمدة تطابق أسماء حقول الكتاب
      });
      if (!bk.title_ar) bk.title_ar = title;
      if (!bk.cat) bk.cat = catId('');
      books.push(bk);
    }
    return { books, errors };
  }

  function buildFromJSON(t) {
    try {
      const data = JSON.parse(t);
      const arr = Array.isArray(data) ? data : [data];
      const books = arr.filter(x => x && (x.title_ar || x.title_en)).map(x => ({ ...x, cat: x.cat || catId(x.category) }));
      return { books, errors: [] };
    } catch (e) { return { books: [], errors: [(isAr ? 'JSON غير صالح: ' : 'Invalid JSON: ') + e.message] }; }
  }

  function preview() {
    const t = text.trim();
    if (!t) { setParsed({ books: [], errors: [isAr ? 'الصق بيانات أولاً' : 'Paste data first'] }); return; }
    setParsed(t[0] === '[' || t[0] === '{' ? buildFromJSON(t) : buildFromCSV(t));
  }

  function onFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => { setText(r.result); setParsed(null); };
    r.readAsText(file);
  }

  function csvCell(v) {
    const s = String(v == null ? '' : v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function downloadTemplate() {
    // الترويسة: الأعمدة الإلزامية معلّمة بـ * (المحلّل يتجاهل العلامة)، ثم صفّا مثال
    const headerKeys = BULK_FIELDS.map(f => f.k + (f.req ? '*' : ''));
    const sample1 = BULK_FIELDS.map(f => f.sample);
    const sample2 = ['الخيميائي', '30', '6', 'The Alchemist', '', 'باولو كويلو', 'Paulo Coelho', 'أدب عالمي مترجم', '22', '9789953290034', '1988', '197', 'دار الوليد', 'بهاء طاهر', 'العربية', 'غلاف ورقي', 'الطبعة الأولى', '14 × 21.5 سم', '180', 'رحلة بحث عن الكنز', ''];
    const lines = [headerKeys, sample1, sample2].map(r => r.map(csvCell).join(','));
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'books-template.csv';
    document.body.appendChild(a); a.click(); a.remove();
  }

  function doImport() {
    const res = parsed || (text.trim()[0] === '[' || text.trim()[0] === '{' ? buildFromJSON(text) : buildFromCSV(text));
    if (!res.books.length) { store.toast(isAr ? 'لا كتب صالحة للاستيراد' : 'No valid books to import'); return; }
    const n = store.importBooks(res.books);
    store.toast(isAr ? `تم استيراد ${n} كتاب ✓` : `Imported ${n} books ✓`);
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(43,34,28,.55)' }} />
      <div className="fade-up card" style={{ position: 'absolute', insetInline: 0, insetBlock: 0, margin: 'auto', width: 'min(720px,96vw)', maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="between" style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)' }}>
          <h2 style={{ fontSize: '1.25rem' }}>{isAr ? 'استيراد مجمّع للكتب' : 'Bulk import books'}</h2>
          <button className="btn btn-ghost" style={{ padding: '.55em', borderRadius: 99 }} onClick={onClose}><Ic.x style={{ width: 18, height: 18 }} /></button>
        </div>
        <div style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p className="muted" style={{ fontSize: '.9rem', lineHeight: 1.7, margin: 0 }}>
            {isAr ? 'الصق ملف CSV أو مصفوفة JSON، أو ارفع ملف .csv. الأعمدة الفارغة تُملأ تلقائياً.' : 'Paste CSV or a JSON array, or upload a .csv file. Empty optional columns are auto-filled.'}
          </p>
          <div className="card" style={{ padding: 14, background: 'var(--surface-2)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <span className="badge" style={{ background: 'var(--brand-tint)', color: 'var(--brand-deep)', marginInlineEnd: 8 }}>{isAr ? 'إلزامي' : 'Required'}</span>
              {BULK_FIELDS.filter(f => f.req).map(f => (
                <code key={f.k} dir="ltr" style={{ fontSize: '.8rem', color: 'var(--brand)', marginInlineEnd: 10 }}>{f.k}<span className="muted" style={{ fontWeight: 400 }}> ({isAr ? f.ar : f.en})</span></code>
              ))}
            </div>
            <div>
              <span className="badge badge-soft" style={{ marginInlineEnd: 8 }}>{isAr ? 'اختياري' : 'Optional'}</span>
              <span style={{ fontSize: '.8rem', lineHeight: 1.9 }} dir="ltr">
                {BULK_FIELDS.filter(f => !f.req).map((f, i) => (
                  <span key={f.k}><code style={{ color: 'var(--ink-soft)' }} title={isAr ? f.ar : f.en}>{f.k}</code>{i < BULK_FIELDS.filter(x => !x.req).length - 1 ? '، ' : ''}</span>
                ))}
              </span>
            </div>
          </div>
          <div className="row wrap" style={{ gap: 10 }}>
            <button type="button" className="btn btn-soft btn-sm" onClick={downloadTemplate}><Ic.book style={{ width: 15, height: 15 }} /> {isAr ? 'تحميل قالب CSV' : 'Download CSV template'}</button>
            <label className="btn btn-soft btn-sm" style={{ cursor: 'pointer' }}>
              <Ic.plg style={{ width: 15, height: 15 }} /> {isAr ? 'رفع ملف CSV' : 'Upload CSV file'}
              <input type="file" accept=".csv,text/csv,application/json,.json" onChange={onFile} style={{ display: 'none' }} />
            </label>
          </div>
          <textarea className="textarea" value={text} onChange={e => { setText(e.target.value); setParsed(null); }} dir="ltr"
            placeholder={'title_ar*,base_price*,price_usd,title_en,author_ar,category,stock,isbn,year,pages,…'}
            style={{ minHeight: 160, fontFamily: 'ui-monospace, monospace', fontSize: '.84rem' }} />
          {parsed && (
            <div className="card" style={{ padding: 14, background: 'var(--surface-2)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {parsed.books.length
                ? <div>
                    <b style={{ color: 'var(--success)' }}>{isAr ? `جاهز لاستيراد ${parsed.books.length} كتاب` : `Ready to import ${parsed.books.length} books`}</b>
                    <div className="muted" style={{ fontSize: '.82rem', marginTop: 6 }}>{parsed.books.slice(0, 5).map(b => b.title_ar).join(' · ')}{parsed.books.length > 5 ? ' …' : ''}</div>
                  </div>
                : <span className="err-msg">{parsed.errors.join(' · ')}</span>}
              {parsed.books.length > 0 && parsed.errors.length > 0 && (
                <span style={{ color: 'var(--amber)', fontSize: '.82rem', fontWeight: 600 }}>⚠ {parsed.errors.length} {isAr ? 'صف تم تجاهله (سعر ناقص)' : 'rows skipped (missing price)'}</span>
              )}
            </div>
          )}
        </div>
        <div className="row" style={{ gap: 10, justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid var(--line)' }}>
          <button type="button" className="btn btn-ghost" onClick={onClose}>{isAr ? 'إلغاء' : 'Cancel'}</button>
          <button type="button" className="btn btn-soft" onClick={preview}>{isAr ? 'معاينة' : 'Preview'}</button>
          <button type="button" className="btn btn-primary" onClick={doImport}><Ic.check style={{ width: 17, height: 17 }} /> {isAr ? 'استيراد' : 'Import'}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- الإعدادات — سعر الصرف + الشحن ---------------- */
function AdminSettings({ store }) {
  const { state, setUsdRate, setShipLibya, setShipIntl } = store;
  const isAr = state.lang === 'ar';
  const current = (state.settings && state.settings.usdRate) || 5;
  const [val, setVal] = useState(String(current));
  const [saved, setSaved] = useState(false);
  const [shipLy, setShipLy] = useState(String(state.settings.shipLibya ?? 5));
  const [shipUsd, setShipUsd] = useState(String(state.settings.shipIntl ?? 25));
  const [shipSaved, setShipSaved] = useState(false);

  useEffect(() => { setVal(String(current)); }, [current]);
  useEffect(() => { setShipLy(String(state.settings.shipLibya ?? 5)); setShipUsd(String(state.settings.shipIntl ?? 25)); }, [state.settings.shipLibya, state.settings.shipIntl]);

  const num = Number(val);
  const valid = num > 0;
  const samples = [25, 35, 45, 60];

  function save(e) {
    e.preventDefault();
    if (!valid) return;
    setUsdRate(num);
    store.toast(isAr ? 'تم حفظ سعر الصرف ✓' : 'Exchange rate saved ✓');
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }
  function saveShip(e) {
    e.preventDefault();
    if (Number(shipLy) < 0 || Number(shipUsd) < 0) return;
    setShipLibya(shipLy); setShipIntl(shipUsd);
    store.toast(isAr ? 'تم حفظ رسوم الشحن ✓' : 'Shipping saved ✓');
    setShipSaved(true);
    setTimeout(() => setShipSaved(false), 1800);
  }

  return (
    <div>
      <AdminHeader title={isAr ? 'الإعدادات' : 'Settings'} sub={isAr ? 'سعر صرف العملة للطلبات خارج ليبيا' : 'Currency exchange rate for orders outside Libya'} />
      <div style={{ padding: 'clamp(20px,3vw,32px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 22, alignItems: 'start' }}>
        {/* محرّر سعر الصرف */}
        <form onSubmit={save} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 className="row" style={{ gap: 9, fontSize: '1.1rem' }}><Ic.coins style={{ width: 20, height: 20, color: 'var(--brand)' }} /> {isAr ? 'سعر الصرف' : 'Exchange rate'}</h3>
          <p className="muted" style={{ fontSize: '.88rem', lineHeight: 1.7 }}>
            {isAr
              ? 'الأسعار داخل ليبيا بالدينار الليبي. للطلبات من «خارج ليبيا» تظهر الأسعار بالدولار، وتُحسب بقسمة السعر بالدينار على هذا الرقم.'
              : 'Prices inside Libya are in LYD. For “outside Libya” orders, prices show in USD, computed by dividing the LYD price by this number.'}
          </p>
          <div className="field">
            <label>{isAr ? 'كم دينار ليبي يساوي 1 دولار؟' : 'How many LYD per 1 USD?'} <span className="req">*</span></label>
            <div className="row" style={{ gap: 10, alignItems: 'center' }}>
              <span style={{ fontWeight: 800, color: 'var(--info)' }}>1 $ =</span>
              <input className="input tnum" type="number" min="0.1" step="0.1" value={val} onChange={e => { setVal(e.target.value); setSaved(false); }} style={{ maxWidth: 140 }} />
              <span style={{ fontWeight: 800, color: 'var(--brand)' }}>{isAr ? 'د.ل' : 'LYD'}</span>
            </div>
            {!valid && <span className="err-msg">{isAr ? 'أدخل رقماً أكبر من صفر' : 'Enter a number greater than 0'}</span>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={!valid}>
            {saved ? <><Ic.check style={{ width: 17, height: 17 }} /> {isAr ? 'تم الحفظ' : 'Saved'}</> : (isAr ? 'حفظ' : 'Save')}
          </button>
        </form>

        {/* رسوم التوصيل */}
        <form onSubmit={saveShip} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 className="row" style={{ gap: 9, fontSize: '1.1rem' }}><Ic.truck style={{ width: 20, height: 20, color: 'var(--brand)' }} /> {isAr ? 'رسوم التوصيل' : 'Shipping fees'}</h3>
          <p className="muted" style={{ fontSize: '.88rem', lineHeight: 1.7 }}>
            {isAr ? 'رسوم ثابتة تُضاف عند الطلب حسب الموقع. اجعلها صفراً لتوصيل مجاني.' : 'Flat fee added at checkout based on location. Set 0 for free delivery.'}
          </p>
          <div className="field">
            <label>{isAr ? 'التوصيل داخل ليبيا' : 'Delivery inside Libya'}</label>
            <div className="row" style={{ gap: 10, alignItems: 'center' }}>
              <input className="input tnum" type="number" min="0" value={shipLy} onChange={e => { setShipLy(e.target.value); setShipSaved(false); }} style={{ maxWidth: 140 }} />
              <span style={{ fontWeight: 800, color: 'var(--brand)' }}>{isAr ? 'د.ل' : 'LYD'}</span>
            </div>
          </div>
          <div className="field">
            <label>{isAr ? 'الشحن خارج ليبيا' : 'Shipping outside Libya'}</label>
            <div className="row" style={{ gap: 10, alignItems: 'center' }}>
              <input className="input tnum" type="number" min="0" value={shipUsd} onChange={e => { setShipUsd(e.target.value); setShipSaved(false); }} style={{ maxWidth: 140 }} />
              <span style={{ fontWeight: 800, color: 'var(--info)' }}>$ USD</span>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            {shipSaved ? <><Ic.check style={{ width: 17, height: 17 }} /> {isAr ? 'تم الحفظ' : 'Saved'}</> : (isAr ? 'حفظ' : 'Save')}
          </button>
        </form>

        {/* معاينة التحويل */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontSize: '1.1rem' }}>{isAr ? 'معاينة التحويل' : 'Conversion preview'}</h3>
          <p className="muted" style={{ fontSize: '.84rem' }}>{isAr ? `حسب السعر الحالي: 1 دولار = ${valid ? num : current} د.ل` : `At current rate: 1 USD = ${valid ? num : current} LYD`}</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: isAr ? 'right' : 'left' }}>
                <th style={{ padding: '8px 10px', fontSize: '.78rem', color: 'var(--muted)', fontWeight: 700 }}>{isAr ? 'السعر بالدينار' : 'LYD price'}</th>
                <th style={{ padding: '8px 10px', fontSize: '.78rem', color: 'var(--muted)', fontWeight: 700 }}>{isAr ? 'يظهر خارج ليبيا' : 'Shows outside Libya'}</th>
              </tr>
            </thead>
            <tbody>
              {samples.map(s => (
                <tr key={s} style={{ borderTop: '1px solid var(--line-soft)' }}>
                  <td style={{ padding: '9px 10px' }}><b className="tnum">{s}</b> <span className="muted" style={{ fontSize: '.75rem' }}>د.ل</span></td>
                  <td style={{ padding: '9px 10px' }}><b className="tnum" style={{ color: 'var(--info)' }}>{WALID_DATA.convertFromLyd(s, 'USD', valid ? num : current)} $</b></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="hint">{isAr ? 'يُقرَّب سعر الدولار لأقرب رقم صحيح.' : 'USD prices are rounded to the nearest whole number.'}</p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminBooks, BookFormModal, BulkImportModal, AdminSettings });
