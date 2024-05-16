import React from 'react';

const NotFoundPage = () => {
  return (
    <div className='flex flex-col text-center space-y-5'>
      <h1 className='font-bold text-4xl'>404 Page Not Found</h1>
      <p className='text-2xl'>We're sorry, the page you requested could not be found, please go back.</p>
    </div>
  );
};

export default NotFoundPage;