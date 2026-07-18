import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSite } from '../lib/SiteContext';

export default function Navbar() {
  const { pages, settings } = useSite();
  const [open, setOpen] = useState(false);
  const navPages = pages.filter((p) => p.showInNav);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="nav-brand">
          {settings.brand || 'Digital Atelier'}
        </Link>
        <nav className={`nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          {navPages.map((p) => (
            <NavLink key={p.slug} to={p.slug === 'home' ? '/' : `/${p.slug}`} end>
              {p.navLabel}
            </NavLink>
          ))}
          <Link to="/about#contact" className="btn btn-primary nav-cta">
            Hire Me
          </Link>
        </nav>
        <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
        </button>
      </div>
    </header>
  );
}
