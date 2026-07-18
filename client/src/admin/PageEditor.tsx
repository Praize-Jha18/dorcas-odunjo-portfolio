import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { Page, Section } from '../lib/types';
import { SECTION_DEFS, defFor } from '../sections/registry';
import { useSite } from '../lib/SiteContext';
import SectionForm from './SectionForm';

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

function sectionTitle(section: Section): string {
  const d = section.data ?? {};
  const raw = d.title || d.heading || d.eyebrow || '';
  return String(raw).replace(/\|/g, '') || '(untitled)';
}

export default function PageEditor() {
  const { slug = '' } = useParams();
  const { refresh } = useSite();
  const [page, setPage] = useState<Page | null>(null);
  const [openUid, setOpenUid] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get<Page>(`/api/pages/${slug}`).then(setPage);
  }, [slug]);

  if (!page) return <div className="sub">Loading…</div>;

  const update = (patch: Partial<Page>) => {
    setPage({ ...page, ...patch });
    setDirty(true);
    setMessage('');
  };

  const updateSection = (i: number, data: Record<string, any>) => {
    const sections = page.sections.map((s, j) => (j === i ? { ...s, data } : s));
    update({ sections });
  };

  const move = (i: number, dir: -1 | 1) => {
    const sections = [...page.sections];
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    [sections[i], sections[j]] = [sections[j], sections[i]];
    update({ sections });
  };

  const remove = (i: number) => {
    const sec = page.sections[i];
    if (!confirm(`Delete the “${defFor(sec.type)?.label ?? sec.type}” section? This is permanent once saved.`)) return;
    update({ sections: page.sections.filter((_, j) => j !== i) });
  };

  const add = (type: string) => {
    const def = defFor(type);
    if (!def) return;
    const section: Section = { uid: uid(), type, data: JSON.parse(JSON.stringify(def.defaultData)) };
    update({ sections: [...page.sections, section] });
    setOpenUid(section.uid);
    setAddOpen(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const saved = await api.put<Page>(`/api/pages/${page.slug}`, page);
      setPage(saved);
      setDirty(false);
      setMessage('Saved ✓');
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <Link to="/admin/pages" className="icon-btn">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div className="grow">
          <h1>{page.title}</h1>
          <div className="sub" style={{ marginBottom: 0 }}>
            /{page.slug === 'home' ? '' : page.slug} · {page.sections.length} sections
          </div>
        </div>
        <a
          href={page.slug === 'home' ? '/' : `/${page.slug}`}
          target="_blank"
          rel="noreferrer"
          className="icon-btn"
          title="View live"
        >
          <span className="material-symbols-outlined">open_in_new</span>&nbsp;View
        </a>
      </div>

      <div className="admin-card">
        <div className="f-inline">
          <div className="f-field">
            <label>Page title</label>
            <input type="text" value={page.title} onChange={(e) => update({ title: e.target.value })} />
          </div>
          <div className="f-field">
            <label>Nav label</label>
            <input type="text" value={page.navLabel} onChange={(e) => update({ navLabel: e.target.value })} />
          </div>
        </div>
        <div className="f-inline">
          <div className="f-field">
            <label>Nav position</label>
            <input
              type="number"
              value={page.navOrder}
              onChange={(e) => update({ navOrder: Number(e.target.value) })}
            />
          </div>
          <div className="f-field">
            <label>Visibility</label>
            <label className="f-check">
              <input
                type="checkbox"
                checked={page.showInNav}
                onChange={(e) => update({ showInNav: e.target.checked })}
              />
              Show in navigation
            </label>
          </div>
        </div>
      </div>

      {page.sections.map((section, i) => {
        const def = defFor(section.type);
        const open = openUid === section.uid;
        return (
          <div className="sec-item" key={section.uid}>
            <div className="sec-item-head" onClick={() => setOpenUid(open ? null : section.uid)}>
              <span className="material-symbols-outlined" style={{ color: 'var(--ink-soft)' }}>
                {open ? 'expand_less' : 'expand_more'}
              </span>
              <span className="type">{def?.label ?? section.type}</span>
              <span className="title">{sectionTitle(section)}</span>
              <span className="admin-actions" onClick={(e) => e.stopPropagation()}>
                <button className="icon-btn" disabled={i === 0} onClick={() => move(i, -1)} title="Move up">
                  <span className="material-symbols-outlined">arrow_upward</span>
                </button>
                <button
                  className="icon-btn"
                  disabled={i === page.sections.length - 1}
                  onClick={() => move(i, 1)}
                  title="Move down"
                >
                  <span className="material-symbols-outlined">arrow_downward</span>
                </button>
                <button className="icon-btn danger" onClick={() => remove(i)} title="Delete section">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </span>
            </div>
            {open && (
              <div className="sec-item-body">
                {def ? (
                  <SectionForm fields={def.fields} data={section.data} onChange={(d) => updateSection(i, d)} />
                ) : (
                  <div className="sub">Unknown section type “{section.type}”.</div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="add-section">
        <button className="btn btn-ghost" onClick={() => setAddOpen(!addOpen)}>
          <span className="material-symbols-outlined">add</span> Add section
        </button>
        {addOpen && (
          <div className="add-menu">
            {SECTION_DEFS.map((def) => (
              <button key={def.type} onClick={() => add(def.type)}>
                <b>{def.label}</b>
                <span>{def.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {(dirty || message) && (
        <div className="save-bar">
          <span className="msg">{message || 'Unsaved changes'}</span>
          {dirty && (
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save page'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
