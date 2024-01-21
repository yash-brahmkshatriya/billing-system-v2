import { ValidationEnum } from '../data/enums/ValidationEnum';
export const ChangePasswordValidation = {
  oldPassword: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Old password is required.',
    },
  ],
  newPassword: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'New password is required.',
    },
  ],
  repeatNewPassword: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Confirm password is required.',
    },
    {
      type: ValidationEnum.COMPAREVALUE,
      // Will be added in component
      value: '',
      message: 'Passwords does not match',
    },
  ],
};
