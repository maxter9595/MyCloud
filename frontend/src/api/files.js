import api from './index';

const filesApi = {
  /**
   * Get list of files for given user 
   * (or all users if no user ID is given).
   * 
   * @param {number} [userId] - ID 
   * of user to get files for
   * @returns {Promise<AxiosResponse>} - Promise
   * resolving to Axios response
   */
  getFiles: (userId = null) => {
    const params = userId ? { user_id: userId } : {};
    return api.get(
      '/storage/files/', 
      { params }
    );
  },

  /**
   * Uploads a file to the server.
   * 
   * @param {FormData} formData - The form 
   * data containing the file to be uploaded.
   * @returns {Promise<AxiosResponse>} - Promise 
   * resolving to the server response.
   */
  uploadFile: (formData) => api.post(
    '/storage/files/', 
      formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  ),

  /**
   * Deletes a file from the server.
   * 
   * @param {number} id - ID 
   * of the file to be deleted
   * @returns {Promise<AxiosResponse>} - Promise 
   * resolving to the server response
   */
  deleteFile: (id) => api.delete(
    `/storage/files/${id}/`
  ),

  /**
   * Downloads a file from the server.
   * 
   * @param {number} id - ID 
   * of the file to be downloaded
   * @returns {Promise<AxiosResponse>} - Promise 
   * resolving to the server response. The response 
   * data is a blob containing the file contents.
   */
  downloadFile: (id) => api.get(
    `/storage/files/${id}/download/`, 
    {
      responseType: 'blob',
      headers: {
        'Accept': 'application/octet-stream'
      }
    }
  ),

  /**
   * Updates a file on the server.
   * 
   * @param {number} id - ID 
   * of the file to be updated
   * @param {Object} data - Object 
   * containing data to be updated
   * @returns {Promise<AxiosResponse>} - Promise 
   * resolving to the server response
   */
  updateFile: (id, data) => api.patch(
    `/storage/files/${id}/`, 
    data
  ),
};

export default filesApi;
