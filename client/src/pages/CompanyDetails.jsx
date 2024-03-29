import React from 'react';
import CompanyDetailsForm from '@/components/settings/CompanyDetailsForm';
import AuthSideInfo from '@/components/shared/AuthSideInfo/AuthSideInfo';

const CompanyDetails = () => {
  return (
    <div className='container-fluid h-100'>
      <div className='row h-100'>
        <div className='col-12 col-md-7 col-lg-6'>
          <div className='row my-auto h-100'>
            <div className='col-12 col-md-10 offset-md-1 my-md-auto'>
              <CompanyDetailsForm showLogo={true} onlyCompanyDetails={true} />
            </div>
          </div>
        </div>
        <div className='col-md-5 col-lg-6 px-0 d-md-block d-none'>
          <AuthSideInfo img='/assets/images/company_details.svg' />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
