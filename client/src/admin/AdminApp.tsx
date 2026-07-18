import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import PagesAdmin from './PagesAdmin';
import PageEditor from './PageEditor';
import GalleryAdmin from './GalleryAdmin';
import SettingsAdmin from './SettingsAdmin';
import './admin.css';

function Shell() {
  const { ready, authed, logout } = useAuth();

  if (!ready) return <div className="page-loading">Opening the desk…</div>;
  if (!authed) return <Login />;

  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="brand">Atelier Desk</div>
        <NavLink to="/admin/pages">
          <span className="material-symbols-outlined">web</span> Pages
        </NavLink>
        <NavLink to="/admin/gallery">
          <span className="material-symbols-outlined">palette</span> Art Gallery
        </NavLink>
        <NavLink to="/admin/settings">
          <span className="material-symbols-outlined">settings</span> Site Settings
        </NavLink>
        <div className="spacer" />
        <a href="/" target="_blank" rel="noreferrer">
          <span className="material-symbols-outlined">open_in_new</span> View site
        </a>
        <button className="linklike" onClick={logout}>
          <span className="material-symbols-outlined">logout</span> Sign out
        </button>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route index element={<Navigate to="pages" replace />} />
          <Route path="pages" element={<PagesAdmin />} />
          <Route path="pages/:slug" element={<PageEditor />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Routes>
      </main>
    </div>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
