import api from './index';

const authApi = {
  /**
   * Sends a POST request to the login 
   * endpoint with the given credentials.
   * 
   * @param {Object} credentials - The 
   * credentials to use for the login request.
   * @returns {Promise} The API 
   * response from the login request.
   */
  login: (credentials) => api.post(
    '/auth/login/',
    credentials
  ),

  /**
   * Sends a POST request to the register 
   * endpoint with the given user data.
   * 
   * @param {Object} userData - The user 
   * data to use for the register request.
   * @returns {Promise} The API response 
   * from the register request.
   */
  register: (userData) => api.post(
    '/auth/register/',
    userData
  ),

  /**
   * Sends a POST request to 
   * the logout endpoint.
   * 
   * @returns {Promise} The API 
   * response from the logout request.
   */
  logout: () => api.post(
    '/auth/logout/'),

  /**
   * Sends a GET request to the user 
   * endpoint for the current user.
   * 
   * @returns {Promise} The API 
   * response from the user request.
   */
  getMe: () => api.get(
    '/auth/users/me/'
  ),
};

export default authApi;
