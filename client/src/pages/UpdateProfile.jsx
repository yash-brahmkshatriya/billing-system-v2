import React from 'react';
import AppLayout from '@/base/Layout/AppLayout';
import CompanyDetailsForm from '@/components/settings/CompanyDetailsForm';

const UpdateProfile = () => {
  return (
    <AppLayout>
      <CompanyDetailsForm onlyCompanyDetails={true} />
    </AppLayout>
  );
};

export default UpdateProfile;
