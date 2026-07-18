import { Routes, Route, Outlet } from 'react-router-dom';
import { SiteProvider } from './lib/SiteContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DynamicPage from './pages/DynamicPage';
import AdminApp from './admin/AdminApp';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route element={<PublicLayout />}>
          <Route index element={<DynamicPage />} />
          <Route path=":slug" element={<DynamicPage />} />
        </Route>
      </Routes>
    </SiteProvider>
  );
}
