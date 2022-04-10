import React from 'react';
import StandardButton from '../shared/forms/StandardButton/StandardButton';

const GetEmail = () => {
  return (
    <div className='d-flex h-100'>
      <form>
        <div className='m-auto text-center'>
          <img src='/assets/images/logo.png' alt='logo' className='m-auto' />
          <div className='sub-heading'>Login or Sign Up with your email</div>
          <div className='hint text-left'>
            Type in your email to get started! If you already have an account
            we'll get you signed in, if you're new, we'll help you get set up!
          </div>
        </div>
        <div className='mt-auto'>
          <StandardButton color='btn-primary' block text='Next' />
        </div>
      </form>
    </div>
  );
};

export default GetEmail;
