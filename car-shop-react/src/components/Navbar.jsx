import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  // Controlla se il token esiste nel localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    // Rimuove token e utente dal localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reindirizza alla pagina di login
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#1e2225', color: '#fff' }}>
      <div>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '1rem' }}>Catalogo Auto</Link>
        {token && (
          <Link to="/cars/create" style={{ color: '#fff', textDecoration: 'none' }}>Aggiungi Auto</Link>
        )}
      </div>

      <div>
        {!token ? (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', marginRight: '1rem' }}>Accedi</Link>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Ciao, {user?.name || 'Utente'}</span>
            <button 
              onClick={handleLogout}
              style={{ background: '#e03131', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}