import { removeFromObject } from '@/utils/generalUtils';
import { ValidationEnum } from '../data/enums/ValidationEnum';
import { SignupValidation } from './SignupValidation';
export const UserInfoValidationOnlyCompany = {
  firmName: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Firm Name is required.',
    },
    {
      type: ValidationEnum.MAXLENGTH,
      value: 50,
      message: 'Only 50 characters are allowed in Firm Name.',
    },
  ],
  line1: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Address Line 1 is required.',
    },
  ],
  city: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'City is required.',
    },
    {
      type: ValidationEnum.MAXLENGTH,
      value: 25,
      message: 'Only 25 characters are allowed in Firm Name.',
    },
  ],
  state: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'State is required.',
    },
    {
      type: ValidationEnum.MAXLENGTH,
      value: 25,
      message: 'Only 25 characters are allowed in Firm Name.',
    },
  ],
  pincode: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Pincode is required.',
    },
    {
      type: ValidationEnum.PATTERN,
      value: /^[0-9]{6}$/,
      message: 'Invalid Pincode',
    },
  ],
  phone: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Phone No is required.',
    },
    {
      type: ValidationEnum.PATTERN,
      value: /^[0-9]{10}$/,
      message: 'Invalid Pincode',
    },
  ],
};

export const UserInfoValidation = removeFromObject(
  {
    ...UserInfoValidationOnlyCompany,
    ...SignupValidation,
  },
  ['password']
);
