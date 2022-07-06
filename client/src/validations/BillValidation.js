import { ValidationEnum } from '@/data/enums/ValidationEnum';

export const BillItemValidation = {
  description: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Description is required.',
    },
  ],
  rate: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Rate is required.',
    },
    {
      type: ValidationEnum.PATTERN,
      value: /^[0-9]+(\.)?([0-9]+)?$/,
      message: 'Only numbers are allowed.',
    },
  ],
  quantity: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Quantity is required.',
    },
    {
      type: ValidationEnum.PATTERN,
      value: /^[0-9]+(\.)?([0-9]+)?$/,
      message: 'Only numbers are allowed.',
    },
  ],
  qtyPerUnit: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Quantity per Unit is required.',
    },
    {
      type: ValidationEnum.PATTERN,
      value: /^[0-9]+(\.)?([0-9]+)?$/,
      message: 'Only numbers are allowed.',
    },
  ],
  unit: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Unit is required.',
    },
  ],
};

export const BillValidation = {
  bill: {
    number: [
      {
        type: ValidationEnum.REQUIRED,
        message: 'Bill Number is required.',
      },
    ],
    date: [
      {
        type: ValidationEnum.REQUIRED,
        message: 'Bill Date is required.',
      },
    ],
  },
  dc: {
    number: [
      {
        type: ValidationEnum.REQUIRED,
        message: 'DC Number is required.',
      },
    ],
    date: [
      {
        type: ValidationEnum.REQUIRED,
        message: 'DC Date is required.',
      },
    ],
  },
  po: {
    number: [
      {
        type: ValidationEnum.REQUIRED,
        message: 'PO Number is required.',
      },
    ],
    date: [
      {
        type: ValidationEnum.REQUIRED,
        message: 'PO Date is required.',
      },
    ],
  },
  partyDetails: [
    {
      type: ValidationEnum.REQUIRED,
      message: 'Party Details is required.',
    },
  ],
  items: BillItemValidation,
};
