import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../api/files';


/**
 * Fetches files from the server,
 * optionally filtered by user ID.
 *
 * @param {string|null} userId - ID of the user
 * to filter files by (null for all files).
 * @returns {Promise<Array>} Array of file objects.
 * @throws {Object} Error response from the server.
 */
export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',

  async (userId, { rejectWithValue }) => {
    try {
      const params = userId ? { user_id: userId } : {};
      const response = await api.getFiles(params);
      return response.data;

    } catch (err) {
      return rejectWithValue(
        err.response.data
      );
    }
  }
);

/**
 * Deletes a file from the server.
 *
 * @param {string} id - ID of the file to delete.
 * @returns {Promise<string>} ID of the deleted file.
 * @throws {Object} Error response from the server.
 */
export const deleteFile = createAsyncThunk(
  'files/deleteFile',

  async (id, { rejectWithValue }) => {
    try {
      await api.deleteFile(id);
      return id;

    } catch (err) {
      return rejectWithValue(
        err.response.data
      );
    }
  }
);

/**
 * Downloads a file from the server.
 *
 * @param {string} id - ID of the file to download.
 * @returns {Promise<Object>} File data
 * including download URL.
 * @throws {Object|string} Error response
 * from server or default error message.
 */
export const downloadFile = createAsyncThunk(
  'files/downloadFile',

  async (id, { rejectWithValue }) => {
    try {
      const response = await api.downloadFile(id);
      return response.data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data ||
        'Ошибка скачивания файла'
      );
    }
  }
);

/**
 * Uploads a new file to the server.
 *
 * @param {FormData} formData - File data
 * to upload, including the file and metadata.
 * @returns {Promise<Object>} Uploaded file data.
 * @throws {Object|string} Error response
 * from server or default error message.
 */
export const uploadFile = createAsyncThunk(
  'files/uploadFile',

  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.uploadFile(formData);
      return response.data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
        err.message ||
        'Ошибка загрузки файла'
      );
    }
  }
);

/**
 * Updates file metadata on the server.
 *
 * @param {Object} payload - Update parameters.
 * @param {string} payload.id - ID of the file to update.
 * @param {Object} payload.data - New file metadata.
 * @returns {Promise<Object>} Updated file data.
 * @throws {Object} Error response from the server.
 */
export const updateFile = createAsyncThunk(
  'files/updateFile',

  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.updateFile(id, data);
      return response.data;

    } catch (err) {
      return rejectWithValue(
        err.response.data
      );
    }
  }
);

/**
 * Redux slice for managing
 * file operations state.
 *
 * @property {Array} files -
 * List of file objects.
 * @property {boolean} loading -
 * Indicates if an operation is in progress.
 * @property {Object|null} error -
 * Current error object or null.
 */
const filesSlice = createSlice({
  name: 'files',

  initialState: {
    files: [],
    loading: false,
    error: null,
  },

  reducers: {
    /**
     * Clears the error message in the files state.
     *
     * @param {Object} state - Redux state object.
     */
    clearFilesError: (state) => {
      state.error = null;
    }
  },

  /**
   * Handles side effects of file operations actions.
   *
   * @param {Object} builder -
   * createSlice extraReducers builder.
   * @returns {Object} Modified builder.
   * @property {function} pending - Set
   * loading to true and clear error.
   * @property {function} fulfilled - Set
   * files, clear error, and set loading to false.
   * @property {function} rejected - Set
   * error and set loading to false.
   */
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.files = action.payload;
        state.loading = false;
      })

      .addCase(fetchFiles.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(updateFile.fulfilled, (state, action) => {
        const index = state.files.findIndex(
          f => f.id === action.payload.id
        );
        if (index !== -1) {
          state.files[index] = action.payload;
        }
      })

      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(uploadFile.fulfilled, (state, action) => {
        state.files.push(action.payload);
        state.loading = false;
      })

      .addCase(uploadFile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(downloadFile.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(
          file => file.id !== action.payload
        );
      });
  },
});

export default filesSlice.reducer;
