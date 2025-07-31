import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';

import api from './api';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import Header from './components/ui/Header';
import StoragePage from './pages/StoragePage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

import { 
  setUser, 
  fetchCurrentUser  
} from './store/slices/authSlice';


/**
 * The main app component, which renders 
 * the app's header, routes, and handles
 * authentication-related redirects.
 *
 * @returns {React.ReactElement} The app component.
 */
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser());

      api.get('/auth/users/me/')
        .then(response => {
          dispatch(setUser(response.data));

          if (response.data.is_superuser) {
            navigate('/admin');
          } else {
            navigate('/storage');
          }
        })

        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, [
    dispatch, 
    isAuthenticated, 
    navigate
  ]);

  return (
    <>
      <Header />
      <Routes>
        <Route 
          path="/" 
          element={<HomePage />} 
        />

        <Route 
          path="/login" 
          element={<LoginPage />} 
        />

        <Route 
          path="/register" 
          element={<RegisterPage />} 
        />

        <Route 
          element={<ProtectedRoute 
        />}>
          <Route 
            path="/storage" 
            element={<StoragePage />} 
          />
        </Route>

        <Route 
          element={<ProtectedRoute adminOnly />}
        >
          <Route 
            path="/admin" 
            element={<AdminPage />} 
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
