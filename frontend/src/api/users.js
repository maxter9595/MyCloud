import api from './index';

const usersApi = {
  /**
   * Get list of users.
   * 
   * @returns {Promise<AxiosResponse>} - 
   * Promise resolving to Axios response
   */
  getUsers: () => api.get(
    '/auth/users/'
  ).then(response => {
    console.log(
      'Users data from API:', 
      response.data
    );
    return response;
  }),

  /**
   * Deletes a user from the server.
   * 
   * @param {number} id - ID 
   * of the user to be deleted
   * @returns {Promise<AxiosResponse>} - 
   * Promise resolving to the server response
   */
  deleteUser: (id) => api.delete(
    `/auth/users/${id}/`
  ),

  /**
   * Updates a user on the server.
   * 
   * @param {number} id - ID 
   * of the user to be updated
   * @param {Object} data - Object 
   * containing data to be updated
   * @returns {Promise<AxiosResponse>} - 
   * Promise resolving to the server response
   */
  updateUser: (id, data) => api.patch(
    `/auth/users/${id}/`, 
    data
  ),

  /**
   * Creates a new admin user on the server.
   * 
   * @param {Object} userData - Object 
   * containing data about the user to 
   * be created
   * @param {string} userData.username - 
   * Username of the user to be created
   * @param {string} userData.email - 
   * Email of the user to be created
   * @param {string} userData.full_name - 
   * Full name of the user to be created
   * @param {string} userData.password - 
   * Password of the user to be created
   * @param {string} userData.confirmPassword - 
   * Confirmation of the password of the user 
   * to be created
   * @returns {Promise<AxiosResponse>} - 
   * Promise resolving to the server response
   */
  createAdmin: (userData) => api.post(
      '/auth/admin/create/', {
      username: userData.username,
      email: userData.email,
      full_name: userData.full_name,
      password: userData.password,
      confirmPassword: userData.confirmPassword
    }
  ),
};

export default usersApi;
