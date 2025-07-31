import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import FileList from '../components/files/FileList';
import StorageInfo from '../components/files/StorageInfo';
import { fetchFiles, uploadFile } from '../store/slices/filesSlice';


/**
 * Component representing the storage page.
 *
 * This component displays the user's storage
 * usage with a progress bar, a list of the user's
 * files and a form to upload a new file. It fetches
 * the user's files list every time the component
 * mounts and displays a warning message if the
 * usage is higher than 90%.
 *
 * @returns {ReactElement} The StoragePage component
 */
const StoragePage = () => {
  const dispatch = useDispatch();

  const {
    files,
    loading,
    error
  } = useSelector(
    (state) => state.files
  );

  const [
    comment,
    setComment
  ] = useState('');

  const [
    fileToUpload,
    setFileToUpload
  ] = useState(null);

  const [
    isDragging,
    setIsDragging
  ] = useState(false);

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  const onDrop = useCallback((acceptedFiles) => {
    setIsDragging(false);
    if (acceptedFiles.length === 0) return;
    setFileToUpload(acceptedFiles[0]);
  }, []);

  /**
   * Handles the submission
   * of the file upload form.
   *
   * Checks if a file is selected
   * and if so, creates a FormData
   * object, appends the file and comment
   * to it, and dispatches an action to
   * upload the file to the server. If
   * the upload is successful, fetches
   * the files list again and resets the form.
   *
   * @returns {void}
   */
  const handleUpload = () => {
    if (!fileToUpload) return;
    const formData = new FormData();

    formData.append(
      'file',
      fileToUpload
    );

    formData.append(
      'comment',
      comment
    );

    dispatch(uploadFile(formData))
      .unwrap()

      .then(() => {
        dispatch(fetchFiles());
        setFileToUpload(null);
        setComment('');
      })

      .catch((error) => {
        console.error(
          'Ошибка загрузки файла:',
          error
        );

        alert(
          'Ошибка загрузки файла: ' + (
            error.message || 'Обратитесь к администратору'
          )
        );
      });
  };

  /**
   * Handles a change event
   * on the file input element.
   *
   * Checks if the event target has a files
   * property and if the length of the files
   * array is greater than 0, sets the fileToUpload
   * state to the first element of the files array.
   *
   * @param {Event} e - The event object.
   * @returns {void}
   */
  const handleFileInputChange = (e) => {
    if (e.target.files.length) {
      setFileToUpload(
        e.target.files[0]
      );
    }
  };

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    noClick: true
  });

  return (
    <div {...getRootProps()} className="storage-page-container">
      <input {...getInputProps()} />

      {isDragging && (
        <div className="dropzone-overlay">
          <div className="dropzone-content">
            Отпустите файл для загрузки
          </div>
        </div>
      )}

      <div className="storage-page">
        <h1>Мое хранилище</h1>
        <StorageInfo />

        <div className="upload-section">

          {fileToUpload ? (
            <div className="file-preview">
              <h3>Файл готов к загрузке:</h3>
              <p><strong>Имя:</strong> {fileToUpload.name}</p>
              <p><strong>Размер:</strong> {(
                  fileToUpload.size / 1024 / 1024
                ).toFixed(2)} MB
              </p>

              <div className="form-group">
                <label htmlFor="comment">Комментарий</label>
                <input
                  type="text"
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Добавьте комментарий к файлу"
                />
              </div>

              <div className="upload-actions">
                <button
                  onClick={handleUpload}
                  className="submit-btn"
                >
                  Загрузить файл
                </button>
                <button
                  onClick={() => {
                    setFileToUpload(null);
                    setComment('');
                  }}
                  className="cancel-btn"
                >
                  Отмена
                </button>
              </div>
            </div>

          ) : (
            <>
              <div className="file-upload-area">
                <label
                  htmlFor="file-input"
                  className="file-upload-btn"
                >
                  Выберите файл
                </label>

                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileInputChange}
                  hidden
                />

                <p className="drag-hint">
                  или перетащите файл в эту область
                </p>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="storage-error">
            <p>{error}</p>
          </div>
        )}

        {
          loading ?
          <p>Загрузка...</p> :
          <FileList files={files} />
        }
      </div>
    </div>
  );
};

export default StoragePage;
