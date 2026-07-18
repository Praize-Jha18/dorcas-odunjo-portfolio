import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { SiteSettings } from '../lib/types';
import { useSite } from '../lib/SiteContext';

export default function SettingsAdmin() {
  const { refresh } = useSite();
  const [settings, setSettings] = useState<SiteSettings>({});
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get<SiteSettings>('/api/settings/site').then(setSettings);
  }, []);

  const set = (patch: Partial<SiteSettings>) => {
    setSettings({ ...settings, ...patch });
    setDirty(true);
    setMessage('');
  };

  const socials = settings.socials ?? [];

  const save = async () => {
    try {
      await api.put('/api/settings/site', settings);
      setDirty(false);
      setMessage('Saved ✓');
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Save failed');
    }
  };

  return (
    <div>
      <h1>Site Settings</h1>
      <div className="sub">Brand, footer and social links shown across every page.</div>

      <div className="admin-card">
        <div className="f-inline">
          <div className="f-field">
            <label>Brand name</label>
            <input type="text" value={settings.brand ?? ''} onChange={(e) => set({ brand: e.target.value })} />
          </div>
          <div className="f-field">
            <label>Contact email</label>
            <input type="text" value={settings.email ?? ''} onChange={(e) => set({ email: e.target.value })} />
          </div>
        </div>
        <div className="f-field">
          <label>Footer tagline</label>
          <input
            type="text"
            value={settings.footerTagline ?? ''}
            onChange={(e) => set({ footerTagline: e.target.value })}
          />
        </div>
        <div className="f-field">
          <label>Footer note</label>
          <input type="text" value={settings.footerNote ?? ''} onChange={(e) => set({ footerNote: e.target.value })} />
        </div>
        <div className="f-field">
          <label>Location</label>
          <input type="text" value={settings.location ?? ''} onChange={(e) => set({ location: e.target.value })} />
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 12 }}>Social links</h3>
        {socials.map((social, i) => (
          <div className="admin-row" key={i} style={{ marginBottom: 10 }}>
            <div className="f-inline" style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Label"
                value={social.label}
                onChange={(e) =>
                  set({ socials: socials.map((s, j) => (j === i ? { ...s, label: e.target.value } : s)) })
                }
              />
              <input
                type="text"
                placeholder="https://…"
                value={social.url}
                onChange={(e) =>
                  set({ socials: socials.map((s, j) => (j === i ? { ...s, url: e.target.value } : s)) })
                }
              />
            </div>
            <button className="icon-btn danger" onClick={() => set({ socials: socials.filter((_, j) => j !== i) })}>
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
        <button className="icon-btn" onClick={() => set({ socials: [...socials, { label: '', url: '' }] })}>
          <span className="material-symbols-outlined">add</span>&nbsp;Add link
        </button>
      </div>

      {(dirty || message) && (
        <div className="save-bar">
          <span className="msg">{message || 'Unsaved changes'}</span>
          {dirty && (
            <button className="btn btn-primary" onClick={save}>
              Save settings
            </button>
          )}
        </div>
      )}
    </div>
  );
}
