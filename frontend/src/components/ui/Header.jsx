import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { logout } from '../../store/slices/authSlice';
import { ReactComponent as Logo } from '../../assets/logo.svg';


/**
 * Header component that displays navigation 
 * links and a logout button when the user 
 * is authenticated.
 *
 * @returns {React.ReactElement} The 
 * header component.
 */
const Header = () => {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleLogoClick = (e) => {
    if (isAuthenticated) {
      e.preventDefault();
      navigate('/storage');
    }
  };

  const currentPath = window.location.pathname;
  const showAdditionalLinks = ![
    '/', 
    '/login', 
    '/register'
  ].includes(currentPath);

  return (
    <header>
      <nav>
        <Link
          to="/"
          className="logo"
          onClick={handleLogoClick}
        >
          <Logo />
        </Link>

        {showAdditionalLinks && (
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/storage">Хранилище</Link>
                {user?.is_superuser && <Link to="/admin">Админ-панель</Link>}
              </>
            ) : (
              <>
                <Link to="/login">Вход</Link>
                <Link to="/register">Регистрация</Link>
              </>
            )}
          </div>
        )}

        {isAuthenticated ? (
          <button onClick={handleLogout} className="btn btn-outline btn-exit">
            Выйти
          </button>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-outline">
              Вход
            </Link>
            <Link to="/register" className="btn btn-primary">
              Регистрация
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
