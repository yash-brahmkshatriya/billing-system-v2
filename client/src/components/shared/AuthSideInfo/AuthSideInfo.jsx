import React from 'react';
import './auth-side-info.scss';

function AuthSideInfo(props) {
  return (
    <div className='auth-side-info text-center d-flex align-items-center justify-content-center flex-column'>
      <div className='d-flex justify-content-center align-items-center'>
        <img src={props.img} alt='img' className='img-fluid' />
      </div>
      {props.heading ? (
        <div className='mt-3 sub-heading'>{props.heading}</div>
      ) : null}
      {props.text ? <div className='mt-3 content'>{props.text}</div> : null}
    </div>
  );
}

export default AuthSideInfo;
