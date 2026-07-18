import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { Page } from '../lib/types';
import { useSite } from '../lib/SiteContext';

export default function PagesAdmin() {
  const { refresh } = useSite();
  const [pages, setPages] = useState<Page[]>([]);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');

  const load = () => api.get<Page[]>('/api/pages?all=1').then(setPages);
  useEffect(() => {
    load();
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/pages', { title, slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
      setTitle('');
      setSlug('');
      setCreating(false);
      await load();
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create page');
    }
  };

  const remove = async (p: Page) => {
    if (!confirm(`Delete the page “${p.title}” and all its sections? This cannot be undone.`)) return;
    await api.delete(`/api/pages/${p.slug}`);
    await load();
    refresh();
  };

  return (
    <div>
      <h1>Pages</h1>
      <div className="sub">Every page is a stack of sections you can edit, reorder, add and delete.</div>

      {pages.map((p) => (
        <div className="admin-card admin-row" key={p.slug}>
          <div>
            <h3>{p.title}</h3>
            <div className="meta">
              /{p.slug === 'home' ? '' : p.slug} · {p.sections.length} sections ·{' '}
              {p.showInNav ? 'in navigation' : 'hidden from navigation'}
            </div>
          </div>
          <div className="admin-actions">
            <Link to={`/admin/pages/${p.slug}`} className="icon-btn" title="Edit">
              <span className="material-symbols-outlined">edit</span>&nbsp;Edit
            </Link>
            <button className="icon-btn danger" onClick={() => remove(p)} title="Delete page">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      ))}

      {creating ? (
        <form className="admin-card" onSubmit={create}>
          <div className="f-inline">
            <div className="f-field">
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
            </div>
            <div className="f-field">
              <label>Slug (URL)</label>
              <input
                type="text"
                value={slug}
                placeholder="auto from title"
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>
          {error && <div className="login-error">{error}</div>}
          <div className="admin-actions">
            <button className="btn btn-primary" type="submit">
              Create page
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => setCreating(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button className="btn btn-ghost" onClick={() => setCreating(true)}>
          <span className="material-symbols-outlined">add</span> New page
        </button>
      )}
    </div>
  );
}
