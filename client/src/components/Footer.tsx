import { Link } from 'react-router-dom';
import { useSite } from '../lib/SiteContext';

export default function Footer() {
  const { pages, settings } = useSite();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">{settings.brand || 'Digital Atelier'}</div>
          <div className="footer-tagline">{settings.footerTagline || 'Crafting quality, curating beauty.'}</div>
        </div>
        <div className="footer-links">
          {pages
            .filter((p) => p.showInNav)
            .map((p) => (
              <Link key={p.slug} to={p.slug === 'home' ? '/' : `/${p.slug}`}>
                {p.navLabel}
              </Link>
            ))}
        </div>
        <div className="footer-links">
          {(settings.socials ?? []).map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </div>
        <div className="footer-note">{settings.footerNote}</div>
      </div>
    </footer>
  );
}
