import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { Page } from '../lib/types';
import { RENDERERS } from '../sections/registry';

export default function DynamicPage() {
  const { slug = 'home' } = useParams();
  const location = useLocation();
  const [page, setPage] = useState<Page | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading');

  useEffect(() => {
    setState('loading');
    api
      .get<Page>(`/api/pages/${slug}`)
      .then((p) => {
        setPage(p);
        setState('ready');
        document.title = `${p.title} — Digital Atelier`;
      })
      .catch(() => setState('missing'));
  }, [slug]);

  // Honor #anchors once content is on the page.
  useEffect(() => {
    if (state === 'ready' && location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    } else if (state === 'ready') {
      window.scrollTo(0, 0);
    }
  }, [state, location]);

  if (state === 'loading') return <div className="page-loading">Curating…</div>;
  if (state === 'missing' || !page)
    return <div className="page-error">This page has left the atelier. (404)</div>;

  return (
    <>
      {page.sections.map((section) => {
        const Renderer = RENDERERS[section.type];
        if (!Renderer) return null;
        return <Renderer key={section.uid} data={section.data} />;
      })}
    </>
  );
}
