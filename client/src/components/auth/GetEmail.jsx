import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StandardButton from '../shared/forms/StandardButton/StandardButton';
import StandardInput from '../shared/forms/StandardInput/StandardInput';

const GetEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState(useSelector((state) => state.auth.email));

  return (
    <div className='d-flex h-100'>
      <form>
        <div className='m-auto text-center'>
          <img src='/assets/images/logo.png' alt='logo' className='m-auto' />
          <div className='sub-heading mb-4'>
            Login or Sign Up with your email
          </div>
          <StandardInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label='Email'
            placeholder='example@mail.com'
            className='mb-3'
          />
          <div className='hint text-left'>
            Type in your email to get started! If you already have an account
            we'll get you signed in, if you're new, we'll help you get set up!
          </div>
        </div>
        <div className='mt-3'>
          <StandardButton color='btn-primary' block text='Next' />
        </div>
      </form>
    </div>
  );
};

export default GetEmail;
