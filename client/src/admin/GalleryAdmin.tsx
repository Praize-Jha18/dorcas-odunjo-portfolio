import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Artwork } from '../lib/types';
import { ImageField } from './SectionForm';

const EMPTY: Partial<Artwork> = {
  title: '',
  description: '',
  category: 'Paintings',
  imageUrl: '',
  year: '',
  medium: '',
  published: true,
};

export default function GalleryAdmin() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [editing, setEditing] = useState<Partial<Artwork> | null>(null);
  const [error, setError] = useState('');

  const load = () => api.get<Artwork[]>('/api/artworks?all=1').then(setArtworks);
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing?.title) {
      setError('A title is required.');
      return;
    }
    setError('');
    try {
      if (editing._id) await api.put(`/api/artworks/${editing._id}`, editing);
      else await api.post('/api/artworks', { ...editing, order: artworks.length });
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    }
  };

  const remove = async (a: Artwork) => {
    if (!confirm(`Delete “${a.title}” from the gallery? This cannot be undone.`)) return;
    await api.delete(`/api/artworks/${a._id}`);
    await load();
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= artworks.length) return;
    const next = [...artworks];
    [next[i], next[j]] = [next[j], next[i]];
    setArtworks(next);
    await Promise.all(next.map((a, idx) => api.put(`/api/artworks/${a._id}`, { order: idx })));
    await load();
  };

  const togglePublished = async (a: Artwork) => {
    await api.put(`/api/artworks/${a._id}`, { published: !a.published });
    await load();
  };

  const set = (patch: Partial<Artwork>) => setEditing({ ...editing, ...patch });

  return (
    <div>
      <div className="admin-toolbar">
        <div className="grow">
          <h1>Art Gallery</h1>
          <div className="sub" style={{ marginBottom: 0 }}>
            Pieces shown in the Creative Canvas grid. Categories become the public filters automatically.
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({ ...EMPTY })}>
          <span className="material-symbols-outlined">add</span> New piece
        </button>
      </div>

      <div className="art-admin-grid">
        {artworks.map((a, i) => (
          <div className="art-admin-card" key={a._id}>
            {a.imageUrl ? (
              <img src={a.imageUrl} alt={a.title} />
            ) : (
              <div style={{ aspectRatio: '4/3', background: 'var(--blush)' }} />
            )}
            <div className="pad">
              <h3>{a.title}</h3>
              <div className="meta">
                {[a.category, a.medium, a.year].filter(Boolean).join(' · ')}
              </div>
              <div className="admin-row">
                <span className={`badge ${a.published ? '' : 'off'}`}>{a.published ? 'Published' : 'Hidden'}</span>
                <span className="admin-actions">
                  <button className="icon-btn" disabled={i === 0} onClick={() => move(i, -1)} title="Move up">
                    <span className="material-symbols-outlined">arrow_upward</span>
                  </button>
                  <button
                    className="icon-btn"
                    disabled={i === artworks.length - 1}
                    onClick={() => move(i, 1)}
                    title="Move down"
                  >
                    <span className="material-symbols-outlined">arrow_downward</span>
                  </button>
                  <button className="icon-btn" onClick={() => togglePublished(a)} title="Publish / hide">
                    <span className="material-symbols-outlined">{a.published ? 'visibility_off' : 'visibility'}</span>
                  </button>
                  <button className="icon-btn" onClick={() => setEditing(a)} title="Edit">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button className="icon-btn danger" onClick={() => remove(a)} title="Delete">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing._id ? 'Edit piece' : 'New piece'}</h2>
            <div className="f-field">
              <label>Image</label>
              <ImageField value={editing.imageUrl} onChange={(url) => set({ imageUrl: url })} />
            </div>
            <div className="f-field">
              <label>Title</label>
              <input type="text" value={editing.title ?? ''} onChange={(e) => set({ title: e.target.value })} />
            </div>
            <div className="f-inline">
              <div className="f-field">
                <label>Category</label>
                <input
                  type="text"
                  list="category-options"
                  value={editing.category ?? ''}
                  onChange={(e) => set({ category: e.target.value })}
                />
                <datalist id="category-options">
                  {Array.from(new Set(artworks.map((a) => a.category).filter(Boolean))).map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div className="f-field">
                <label>Year</label>
                <input type="text" value={editing.year ?? ''} onChange={(e) => set({ year: e.target.value })} />
              </div>
            </div>
            <div className="f-field">
              <label>Medium</label>
              <input type="text" value={editing.medium ?? ''} onChange={(e) => set({ medium: e.target.value })} />
            </div>
            <div className="f-field">
              <label>Description</label>
              <textarea value={editing.description ?? ''} onChange={(e) => set({ description: e.target.value })} />
            </div>
            <div className="f-field">
              <label className="f-check">
                <input
                  type="checkbox"
                  checked={editing.published ?? true}
                  onChange={(e) => set({ published: e.target.checked })}
                />
                Published (visible on the site)
              </label>
            </div>
            {error && <div className="login-error">{error}</div>}
            <div className="admin-actions">
              <button className="btn btn-primary" onClick={save}>
                Save piece
              </button>
              <button className="btn btn-ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
