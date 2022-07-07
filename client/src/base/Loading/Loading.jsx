import React from 'react';
import { colors } from '@/data/colors';
import { ThreeDots } from 'react-loader-spinner';

function Loading() {
  return (
    <div className='d-flex justify-content-center align-items-center h-100 '>
      <ThreeDots color={colors.primary} width={100} height={100} />
    </div>
  );
}

export default Loading;
