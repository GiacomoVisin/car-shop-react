import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Catalog from './pages/catalog'


function App() {
  const [user, setUser] = useState(null);

  // Controllo se c'è un utente salvato in precedenza
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <BrowserRouter>
      <div style={{ backgroundColor: '#1e2225', minHeight: '100vh', color: '#e9ecef', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
        <Navbar user={user} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;