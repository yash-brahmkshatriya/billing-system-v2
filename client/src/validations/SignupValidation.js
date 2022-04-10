import { ValidationEnum } from '../data/enums/ValidationEnum';
export const SignupValidation = {
  firstName: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'First Name is required.',
    },
    {
      type: ValidationEnum.PATTERN,
      value: /^[a-zA-Z ]+$/,
      message: 'Only characters allowed in First Name.',
    },
    {
      type: ValidationEnum.MAXLENGTH,
      value: 25,
      message: 'Only 25 characters are allowed in First Name.',
    },
  ],
  lastName: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Last Name is required.',
    },
    {
      type: ValidationEnum.PATTERN,
      value: /^[a-zA-Z ]+$/,
      message: 'Only characters allowed in Last Name.',
    },
    {
      type: ValidationEnum.MAXLENGTH,
      value: 25,
      message: 'Only 25 characters are allowed in Last Name.',
    },
  ],
  email: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Email is required.',
    },
    {
      type: ValidationEnum.PATTERN,
      value:
        // eslint-disable-next-line
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Invalid email.',
    },
  ],
  password: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Password is required.',
    },
  ],
};
