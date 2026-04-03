import { useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import ClientAuth from './pages/ClientAuth';
import ClientDashboard from './pages/ClientDashboard';
import AdminAuth from './pages/AdminAuth';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { page } = useApp();

  if (page.startsWith('/client/dashboard')) return <ClientDashboard />;
  if (page.startsWith('/client')) return <ClientAuth />;
  if (page.startsWith('/admin/dashboard')) return <AdminDashboard />;
  if (page.startsWith('/admin')) return <AdminAuth />;
  return <LandingPage />;
}

export default App;
