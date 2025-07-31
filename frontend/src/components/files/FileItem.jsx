import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  FaDownload,
  FaEdit,
  FaTrash,
  FaLink
} from 'react-icons/fa';

import {
  deleteFile,
  downloadFile,
  updateFile
} from '../../store/slices/filesSlice';


/**
 * Component representing a file item with actions.
 *
 * This component displays the file's name, size, and
 * comment. It provides actions to download the file,
 * copy the download link, edit the comment, update
 * the comment, and delete the file. State management
 * for editing and updating comments is handled locally
 * using useState, while file operations are dispatched
 * through Redux actions.
 *
 * @param {Object} props - The properties for the component.
 * @param {Object} props.file - The file object containing
 * details like id, original name, size, comment, and shared link.
 */
const FileItem = ({ file }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState(file.comment);
  const dispatch = useDispatch();

  const handleDownload = async () => {
    try {
      const response = await dispatch(
        downloadFile(file.id)
      ).unwrap();

      const url = window.URL.createObjectURL(
        new Blob([response])
      );

      const link = document.createElement('a');

      link.href = url;
      link.setAttribute(
        'download',
        file.original_name
      );

      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Ошибка скачивания файла:', error);
    }
  };

/**
 * Handles the deletion of a file. 
 * Prompts the user  with a confirmation 
 * dialog before proceeding with the deletion. 
 * Dispatches an action to delete the file 
 * from the server via Redux.
 * 
 * @returns {void}
 */
  const handleDelete = async () => {
    if (window.confirm(
      'Вы уверены, что хотите удалить этот файл?')
    ) {

      try {
        await dispatch(
          deleteFile(file.id)
        ).unwrap();
      
      } catch (error) {
        console.error(
          'Ошибка удаления файла:', 
          error
        );
      }
    }
  };

  /**
   * Handles the update of a file's comment. 
   * Dispatches an action to update the file's
   * comment on the server via Redux. Sets
   * the isEditing state to false after the
   * update is successfully completed.
   * 
   * @returns {void}
   */
  const handleUpdate = () => {
    dispatch(
      updateFile({ 
        id: file.id, 
        data: { comment } 
      })
    ).then(
      () => setIsEditing(false)
    );
  };

  /**
   * Copies the download link to 
   * the clipboard. Shows an alert 
   * notification if copying was 
   * successful. If an error occurs 
   * while copying, logs the error 
   * to the console.
   * @returns {void}
   */
  const copyDownloadLink = async () => {
    const apiBase = process.env.REACT_APP_API_BASE_URL;
    
    const downloadLink = `${apiBase}/storage/shared/${file.shared_link}`;
    const downloadLinkWithSlash = `${downloadLink}/`;

    console.log('Формируем ссылки:', { 
      original: downloadLink,
      withSlash: downloadLinkWithSlash 
    });

    try {
      await navigator.clipboard.writeText(downloadLinkWithSlash);
      alert('Ссылка скопирована!');
      
    } catch (err) {
      console.error('Ошибка копирования (Clipboard API):', err);
      
      try {
        const textarea = document.createElement('textarea');
        textarea.value = downloadLinkWithSlash;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (success) {
          alert('Ссылка скопирована');
        } else {
          alert(`Ссылка для скачивания файла: ${downloadLink}`);
        }
        
      } catch (fallbackError) {
        console.error('Ошибка fallback-копирования:', fallbackError);
        alert(`Не удалось скопировать автоматически. Ссылка: ${downloadLink}`);
      }
    }
  };

  return (
    <div className="file-item">

      <div className="file-info">
        <span>{file.original_name}</span>
        <span>{file.size} bytes</span>
        {isEditing ? (
          <input value={comment} onChange={
            (e) => setComment(e.target.value)
          } />
        ) : (
          <span>{file.comment}</span>
        )}
      </div>

      <div className="file-actions">
        <button 
          onClick={handleDownload} 
          title="Скачать"
        >
          <FaDownload />
        </button>

        <button 
          onClick={copyDownloadLink} 
          title="Копировать ссылку"
        >
          <FaLink />
        </button>

        <button 
          onClick={() => setIsEditing(!isEditing)} 
          title={isEditing ? 'Отмена' : 'Редактировать'}
        >
          <FaEdit />
        </button>

        {isEditing && (
          <button 
            onClick={handleUpdate} 
            title="Сохранить"
          >
            Сохранить
          </button>
        )}

        <button 
          onClick={handleDelete} 
          title="Удалить"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default FileItem;
