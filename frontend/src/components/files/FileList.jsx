import FileItem from './FileItem';


/**
 * Component for displaying 
 * a list of files.
 *
 * This component renders a list 
 * of file items using the FileItem 
 * component. If the list is empty, it
 * displays a message indicating that 
 * there are no files.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.files - An array of file 
 * objects to be displayed, each containing details 
 * like id, original name, size, comment, and shared link.
 */
const FileList = ({ files }) => {
  return (
    <div className="file-list">
      {files.length === 0 ? (
        <p>Нет файлов</p>
      ) : (
        files.map(
          (file) => <FileItem key={file.id} file={file} />
        )
      )}
    </div>
  );
};

export default FileList;
