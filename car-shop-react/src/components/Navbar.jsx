import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
    const navigate = useNavigate();

    return (
        <nav style={{
            backgroundColor: '#2b3035',
            padding: '15px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #495057',
            color: '#fff'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                <Link to="/" style={{ color: '#f8f9fa', textDecoration: 'none' }}>🚗 CarShop SPA</Link>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link to="/" style={{ color: '#ced4da', textDecoration: 'none' }}>Catalogo</Link>

                {user ? (
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <span style={{ color: '#ffc107', fontSize: '0.9rem' }}>Ciao, {user.name}</span>
                        <button
                            onClick={onLogout}
                            style={{
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        style={{
                            backgroundColor: '#5a6268',
                            color: '#fff',
                            padding: '6px 14px',
                            borderRadius: '4px',
                            textDecoration: 'none'
                        }}
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}