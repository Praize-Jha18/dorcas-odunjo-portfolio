import { useRef, useState } from 'react';
import { api } from '../lib/api';
import type { FieldDef } from '../sections/fields';

type Data = Record<string, any>;

function getPath(obj: Data, path: string): any {
  return path.split('.').reduce((acc: any, key) => (acc == null ? undefined : acc[key]), obj);
}

function setPath(obj: Data, path: string, value: any): Data {
  const keys = path.split('.');
  const clone = { ...obj };
  let cursor: Data = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    cursor[keys[i]] = { ...(cursor[keys[i]] ?? {}) };
    cursor = cursor[keys[i]];
  }
  cursor[keys[keys.length - 1]] = value;
  return clone;
}

export function ImageField({ value, onChange }: { value?: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File) => {
    setBusy(true);
    try {
      const { url } = await api.upload(file);
      onChange(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="img-field">
      {value ? (
        <img src={value} alt="" />
      ) : (
        <div className="placeholder">
          <span className="material-symbols-outlined">image</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" className="icon-btn" onClick={() => fileRef.current?.click()} disabled={busy}>
          <span className="material-symbols-outlined">upload</span>&nbsp;{busy ? 'Uploading…' : 'Upload'}
        </button>
        {value && (
          <button type="button" className="icon-btn danger" onClick={() => onChange('')}>
            <span className="material-symbols-outlined">delete</span>
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) pick(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  switch (field.type) {
    case 'text':
      return <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'textarea':
      return <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
    case 'select':
      return (
        <select value={value ?? field.options?.[0] ?? ''} onChange={(e) => onChange(e.target.value)}>
          {(field.options ?? []).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
    case 'boolean':
      return (
        <label className="f-check">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> Enabled
        </label>
      );
    case 'image':
      return <ImageField value={value} onChange={onChange} />;
    case 'tags':
      return (
        <input
          type="text"
          value={Array.isArray(value) ? value.join(', ') : (value ?? '')}
          placeholder="Comma-separated"
          onChange={(e) =>
            onChange(
              e.target.value
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            )
          }
        />
      );
    case 'link': {
      const link = value ?? {};
      return (
        <div className="f-inline">
          <input
            type="text"
            placeholder="Label"
            value={link.label ?? ''}
            onChange={(e) => onChange({ ...link, label: e.target.value })}
          />
          <input
            type="text"
            placeholder="Link, e.g. /gallery or #contact"
            value={link.href ?? ''}
            onChange={(e) => onChange({ ...link, href: e.target.value })}
          />
        </div>
      );
    }
    case 'images': {
      const images: string[] = Array.isArray(value) ? value : [];
      return (
        <div className="f-list">
          {images.map((src, i) => (
            <div className="f-list-item" key={i}>
              <div className="f-list-item-head">
                <span>Image {i + 1}</span>
                <button
                  type="button"
                  className="icon-btn danger"
                  onClick={() => onChange(images.filter((_, j) => j !== i))}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
              <ImageField value={src} onChange={(url) => onChange(images.map((s, j) => (j === i ? url : s)))} />
            </div>
          ))}
          <button type="button" className="icon-btn" onClick={() => onChange([...images, ''])}>
            <span className="material-symbols-outlined">add</span>&nbsp;Add image
          </button>
        </div>
      );
    }
    case 'list': {
      const items: Data[] = Array.isArray(value) ? value : [];
      const blank = () => Object.fromEntries((field.itemFields ?? []).map((f) => [f.key, f.type === 'list' || f.type === 'tags' ? [] : '']));
      return (
        <div className="f-list">
          {items.map((item, i) => (
            <div className="f-list-item" key={i}>
              <div className="f-list-item-head">
                <span>
                  {field.label} {i + 1}
                </span>
                <span className="admin-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    disabled={i === 0}
                    onClick={() => {
                      const next = [...items];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      onChange(next);
                    }}
                  >
                    <span className="material-symbols-outlined">arrow_upward</span>
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    disabled={i === items.length - 1}
                    onClick={() => {
                      const next = [...items];
                      [next[i], next[i + 1]] = [next[i + 1], next[i]];
                      onChange(next);
                    }}
                  >
                    <span className="material-symbols-outlined">arrow_downward</span>
                  </button>
                  <button
                    type="button"
                    className="icon-btn danger"
                    onClick={() => onChange(items.filter((_, j) => j !== i))}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </span>
              </div>
              {(field.itemFields ?? []).map((sub) => (
                <div className="f-field" key={sub.key}>
                  <label>{sub.label}</label>
                  <FieldInput
                    field={sub}
                    value={getPath(item, sub.key)}
                    onChange={(v) => onChange(items.map((it, j) => (j === i ? setPath(it, sub.key, v) : it)))}
                  />
                  {sub.hint && <div className="f-hint">{sub.hint}</div>}
                </div>
              ))}
            </div>
          ))}
          <button type="button" className="icon-btn" onClick={() => onChange([...items, blank()])}>
            <span className="material-symbols-outlined">add</span>&nbsp;Add {field.label.toLowerCase()}
          </button>
        </div>
      );
    }
    default:
      return null;
  }
}

export default function SectionForm({
  fields,
  data,
  onChange,
}: {
  fields: FieldDef[];
  data: Data;
  onChange: (data: Data) => void;
}) {
  const [showJson, setShowJson] = useState(false);
  const [jsonDraft, setJsonDraft] = useState('');
  const [jsonError, setJsonError] = useState('');

  return (
    <div>
      {fields.map((field) => (
        <div className="f-field" key={field.key}>
          <label>{field.label}</label>
          <FieldInput
            field={field}
            value={getPath(data, field.key)}
            onChange={(v) => onChange(setPath(data, field.key, v))}
          />
          {field.hint && <div className="f-hint">{field.hint}</div>}
        </div>
      ))}
      <div className="f-field">
        <button
          type="button"
          className="icon-btn"
          onClick={() => {
            setShowJson(!showJson);
            setJsonDraft(JSON.stringify(data, null, 2));
            setJsonError('');
          }}
        >
          <span className="material-symbols-outlined">data_object</span>&nbsp;
          {showJson ? 'Hide advanced editor' : 'Advanced (edit as JSON)'}
        </button>
        {showJson && (
          <div style={{ marginTop: 10 }}>
            <textarea
              style={{ minHeight: 180, fontFamily: 'ui-monospace, monospace', fontSize: 12.5 }}
              value={jsonDraft}
              onChange={(e) => setJsonDraft(e.target.value)}
            />
            {jsonError && <div className="login-error">{jsonError}</div>}
            <button
              type="button"
              className="icon-btn"
              onClick={() => {
                try {
                  onChange(JSON.parse(jsonDraft));
                  setJsonError('');
                } catch {
                  setJsonError('Invalid JSON — not applied.');
                }
              }}
            >
              <span className="material-symbols-outlined">check</span>&nbsp;Apply JSON
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
