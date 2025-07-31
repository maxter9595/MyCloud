import axios from 'axios';

/**
 * Axios instance with base
 * configuration for API requests
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});


/**
 * Asynchronously gets a CSRF
 * token from the server.
 * 
 * @returns {Promise} Resolves
 * when the token has been retrieved.
 */
const getCSRFToken = async () => {
  try {
    await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/auth/csrf/`,
    {
      withCredentials: true
    });
  } catch (error) {
    console.error(
      'Error getting CSRF token:',
      error
    );
  }
};

getCSRFToken();


/**
 * Request interceptor that:
 * 1. Adds Authorization header if token exists
 * 2. Handles CSRF token for non-GET requests
 */
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  if (config.method !== 'get') {
    const csrfToken = getCookie('csrftoken');

    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;

    } else {
      await getCSRFToken();
      const newCsrfToken = getCookie('csrftoken');

      if (newCsrfToken) {
        config.headers['X-CSRFToken'] = newCsrfToken;
      }
    }
  }

  return config;
});


/**
 * Response interceptor that:
 * 1. Handles 401/403 errors with custom messages
 * 2. Extracts error messages from response data
 * 3. Provides fallback error message
 */
api.interceptors.response.use(
  response => response,

  error => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        return Promise.reject(
          new Error(
            "Invalid credentials or your account has been deactivated. " +
            "If your account is deactivated, please contact the " +
            "administrator at admin@mail.ru"
          )
        );
      }

      const errorMessage = error.response.data?.error ||
                          error.response.data?.detail ||
                          'Ошибка загрузки данных';

      return Promise.reject(new Error(errorMessage));
    }

    return Promise.reject(error);
  }
);


/**
 * Gets a cookie by name.
 * 
 * @param {string} name The name of
 * the cookie to be retrieved.
 * @returns {?string} The value of
 * the cookie, or null if not found.
 */
function getCookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}

export default api;
