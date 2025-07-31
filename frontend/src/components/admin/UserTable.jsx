import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaDatabase,
} from "react-icons/fa";

import { deleteUser, updateUser } from "../../store/slices/usersSlice";

/**
 * Renders a table of users with functionalities
 * to update password, storage limit, and toggle
 * active status. Allows deleting users and editing
 * user details.
 * 
 * @param {Array} users - List of user
 * objects to display in the table.
 * @param {boolean} isMobile - Flag to
 * indicate if the view is in mobile mode.
 */
const UserTable = ({ users, isMobile }) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [newStorageLimit, setNewStorageLimit] = useState("");

  /**
   * Handles toggling a user's active status. Prevents 
   * event propagation to the parent element and 
   * dispatches an action to update the user's data.
   * 
   * @param {number} userId - ID 
   * of the user to update.
   * @param {boolean} isActive - The 
   * user's current active status.
   * @param {Event} e - The event object 
   * passed from the user's click event.
   */
  const handleToggleActive = async (userId, isActive, e) => {
    e.stopPropagation();

    try {
      await dispatch(
        updateUser({
          id: userId,
          data: { is_active: !isActive },
        })
      ).unwrap();
    
    } catch (error) {
      console.error("Status change error:", error);
    }
  };

  /**
   * Handles deleting a user. Prevents event 
   * propagation to the parent element, asks 
   * the user for confirmation, and dispatches 
   * an action to delete the user.
   * 
   * @param {number} userId - ID 
   * of the user to delete.
   * @param {Event} e - The event object 
   * passed from the user's click event.
   */
  const handleDelete = async (userId, e) => {
    e.stopPropagation();
    let text = "Вы уверены, что хотите удалить этого пользователя?";

    if (window.confirm(text)) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        
      } catch (error) {
        console.error("User deletion error:", error);
      }
    }
  };

  /**
   * Handles changing a user's password. 
   * Prevents event propagation to the 
   * parent element, checks if a new password 
   * has been entered, and dispatches an action
   * to update the user's password.
   * 
   * @param {number} userId - ID 
   * of the user whose password to change.
   * @param {Event} e - The event object 
   * passed from the user's click event.
   */
  const handlePasswordChange = async (userId, e) => {
    e.stopPropagation();

    if (!password) {
      alert("Введите новый пароль");
      return;
    }

    try {
      await dispatch(
        updateUser({
          id: userId,
          data: { password },
        })
      ).unwrap();

      setEditingUserId(null);
      setEditingField(null);
      setPassword("");

    } catch (error) {
      console.error("Ошибка изменения пароля:", error);
    }
  };

  /**
   * Handles changing a user's storage limit. 
   * Prevents event propagation to the 
   * parent element, checks if a valid limit 
   * has been entered, and dispatches an action
   * to update the user's storage limit.
   * 
   * @param {number} userId - ID of the 
   * user whose storage limit to change.
   * @param {Event} e - The event object 
   * passed from the user's click event.
   */
  const handleStorageLimitChange = async (userId, e) => {
    e.stopPropagation();
    const limitGB = parseFloat(newStorageLimit);
    
    if (isNaN(limitGB)) {
      alert("Введите корректное число");
      return;
    }

    const limitBytes = Math.round(
      limitGB * 1024 * 1024 * 1024
    );

    try {
      await dispatch(
        updateUser({
          id: userId,
          data: { max_storage: limitBytes },
        })
      ).unwrap();

      setNewStorageLimit("");
      setEditingUserId(null);
      setEditingField(null);
    
    } catch (error) {
      console.error(
        "Ошибка изменения лимита хранилища:", 
        error
      );
    }
  };

  /**
   * Starts editing a user's field. If 
   * the field is "storage", the value is
   * converted from bytes to gigabytes 
   * and rounded to 2 decimal places.
   * 
   * @param {number} userId - ID 
   * of the user to edit.
   * @param {string} field - Field to edit.
   * @param {number} [currentValue] - Current 
   * value of the field.
   */
  const startEditing = (userId, field, currentValue = "") => {
    setEditingUserId(userId);
    setEditingField(field);
    
    if (field === "storage") {
      setNewStorageLimit(
        (currentValue / (1024 * 1024 * 1024)
      ).toFixed(2));
    }
  };

/**
 * Cancels the current editing 
 * session by resetting the editing 
 * user ID, editing field, password, 
 * and new storage limit to their 
 * initial states.
 */
  const cancelEditing = () => {
    setEditingUserId(null);
    setEditingField(null);
    setPassword("");
    setNewStorageLimit("");
  };

  return (
    <div className="users-section">
      <table className="user-table">

        <thead>
          <tr>
            {!isMobile && <th>ID</th>}
            <th>Логин</th>
            {!isMobile && <th>Email</th>}
            {!isMobile && <th>Полное имя</th>}
            <th>Объем</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
            
              {!isMobile && <td>{user.id}</td>}
              <td>{user.username}</td>
              {!isMobile && <td>{user.email}</td>}
              {!isMobile && <td>{user.full_name}</td>}
              <td>{(user.max_storage / (1024 * 1024 * 1024)).toFixed(1)}G</td>

              <td>
                <button
                  onClick={(e) =>
                    handleToggleActive(user.id, user.is_active, e)
                  }
                  className="status-btn"
                  aria-label={
                    user.is_active ? "Деактивировать" : "Активировать"
                  }
                >
                  {user.is_active ? (
                    <FaToggleOn color="#52c41a" size={20} />
                  ) : (
                    <FaToggleOff color="#ff4d4f" size={20} />
                  )}
                </button>
              </td>
              
              <td className="actions-cell">
                <div className="action-buttons">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(user.id, "password");
                    }}
                    className="action-btn"
                    title="Изменить пароль"
                    aria-label="Изменить пароль"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(user.id, "storage", user.max_storage);
                    }}
                    className="action-btn"
                    title="Изменить объем хранилища"
                    aria-label="Изменить объем хранилища"
                  >
                    <FaDatabase />
                  </button>
                  
                  <button
                    onClick={(e) => handleDelete(user.id, e)}
                    className="action-btn delete"
                    title="Удалить"
                    aria-label="Удалить"
                  >
                    <FaTrash />
                  </button>
                </div>

                {editingUserId === user.id && editingField === "password" && (
                  <div
                    className="password-form"
                    onClick={(e) => e.stopPropagation()}
                  >

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Новый пароль"
                      autoFocus
                    />

                    <div className="form-actions">
                      <button onClick={(e) => handlePasswordChange(user.id, e)}>
                        <FaSave /> {!isMobile && "Сохранить"}
                      </button>

                      <button onClick={cancelEditing}>
                        <FaTimes /> {!isMobile && "Отмена"}
                      </button>
                    </div>
                  </div>
                )}

                {editingUserId === user.id && editingField === "storage" && (
                  <div
                    className="storage-form"
                    onClick={(e) => e.stopPropagation()}
                  >

                    <input
                      type="number"
                      value={newStorageLimit}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || !isNaN(value)) {
                          setNewStorageLimit(value);
                        }
                      }}
                      placeholder="Новый лимит (GB)"
                      step="0.1"
                      min="0.1"
                      autoFocus
                    />

                    <div className="form-actions">
                      <button
                        onClick={(e) => handleStorageLimitChange(user.id, e)}
                      >
                        <FaSave /> {!isMobile && "Сохранить"}
                      </button>

                      <button onClick={cancelEditing}>
                        <FaTimes /> {!isMobile && "Отмена"}
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
