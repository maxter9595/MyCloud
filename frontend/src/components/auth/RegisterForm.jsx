import * as Yup from 'yup';
import { Formik, Field, ErrorMessage } from 'formik';

import { 
  validateUsername, 
  validatePassword, 
  validateEmail 
} from '../../utils/validators';


/**
 * RegisterForm component for user registration.
 * 
 * This component utilizes Formik for form handling 
 * and validation. It includes fields for username, 
 * email, full name, password, and password confirmation. 
 * Validation is  performed using Yup with custom 
 * validation functions for username, email, and password.
 * 
 * @param {Function} onSubmit - Callback function to handle form submission.
 * @returns {JSX.Element} The rendered registration form component.
 */
const RegisterForm = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        full_name: '',
        password: '',
        confirmPassword: '',
      }}
      
      validationSchema={Yup.object({
        username: Yup.string()
          .test(
            'valid-username', 
            'Некорректный логин', 
            validateUsername
          )
          .required('Обязательное поле'),
        email: Yup.string()
          .test(
            'valid-email', 
            'Некорректный email', 
            validateEmail
          )
          .required('Обязательное поле'),
        full_name: Yup.string()
          .required('Обязательное поле'),
        password: Yup.string()
          .test(
            'valid-password', 
            'Слабый пароль', 
            validatePassword
          )
          .required('Обязательное поле'),
        confirmPassword: Yup.string()
          .oneOf(
            [Yup.ref('password'), null], 
            'Пароли должны совпадать'
          )
          .required('Обязательное поле'),
      })}

      onSubmit={onSubmit}
    >

      {({ handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-group">
            <label htmlFor="username">
              Логин
            </label>
            <Field 
              type="text" 
              name="username" 
              id="username" 
              className="form-input"
            />
            <ErrorMessage 
              name="username" 
              component="div" 
              className="error-message" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>
            <Field 
              type="email" 
              name="email" 
              id="email" 
              className="form-input"
            />
            <ErrorMessage 
              name="email" 
              component="div" 
              className="error-message" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="full_name">
              Полное имя
            </label>
            <Field 
              type="text" 
              name="full_name" 
              id="full_name" 
              className="form-input"
            />
            <ErrorMessage 
              name="full_name" 
              component="div" 
              className="error-message" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              Пароль
            </label>
            <Field 
              type="password" 
              name="password" 
              id="password" 
              className="form-input"
            />
            <ErrorMessage 
              name="password" 
              component="div" 
              className="error-message" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Подтвердите пароль
            </label>
            <Field 
              type="password" 
              name="confirmPassword" 
              id="confirmPassword" 
              className="form-input"
            />
            <ErrorMessage 
              name="confirmPassword" 
              component="div" 
              className="error-message" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
      )}
    </Formik>
  );
};

export default RegisterForm;
