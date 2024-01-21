import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as authActions from '@/redux/auth/authActions';
import { useBoolean } from '@/base/hooks';
import StandardInput from '../shared/forms/StandardInput/StandardInput';
import { ChangePasswordValidation } from '@/validations/ChangePasswordValidation';
import { ValidationEnum } from '@/data/enums/ValidationEnum';
import StandardButton from '../shared/forms/StandardButton/StandardButton';
import { DASHBOARD } from '@/data/routeUrls';

function PasswordChange() {
  const navigate = useNavigate();
  const [loading, setLoading] = useBoolean(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');

  const dispatch = useDispatch();

  const sendChangePasswordReq = async (oldPassword, newPassword) => {
    const data = {
      old: oldPassword,
      new: newPassword,
    };
    try {
      setLoading.on();
      await dispatch(authActions.changePassword(data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading.off();
    }
  };

  const changePasswordButtonDisabled = useMemo(() => {
    return (
      !oldPassword ||
      !newPassword ||
      !repeatNewPassword ||
      newPassword !== repeatNewPassword ||
      loading
    );
  }, [oldPassword, newPassword, repeatNewPassword, loading]);

  const passwordChangeValidations = useMemo(() => {
    const compareValueRule = ChangePasswordValidation.repeatNewPassword.find(
      (rule) => rule.type === ValidationEnum.COMPAREVALUE
    );
    compareValueRule.value = newPassword;
    return ChangePasswordValidation;
  }, [newPassword]);

  return (
    <div className='row'>
      <div className='col-12 col-md-4 offset-md-4 d-flex flex-column justify-content-center'>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await sendChangePasswordReq(oldPassword, newPassword);
            navigate(DASHBOARD);
          }}
        >
          <StandardInput
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className='mb-3'
            label='Old password'
            validations={passwordChangeValidations.oldPassword}
            type='password'
          />
          <StandardInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='mb-3'
            label='New password'
            type='password'
            validations={passwordChangeValidations.newPassword}
          />
          <StandardInput
            value={repeatNewPassword}
            onChange={(e) => setRepeatNewPassword(e.target.value)}
            className='mb-3'
            label='Confirm password'
            type='password'
            validations={passwordChangeValidations.repeatNewPassword}
            hidePasswordIcon={true}
          />
          <StandardButton
            color='btn-primary'
            bold={true}
            block={true}
            text='Change password'
            type='submit'
            className='mt-2'
            disabled={changePasswordButtonDisabled}
          />
        </form>
      </div>
    </div>
  );
}

export default PasswordChange;
