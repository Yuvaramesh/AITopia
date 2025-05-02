"use client";

import React, { Suspense } from 'react';
import AuthProvider from './AuthProvider';

function Provider({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Suspense>
  );
}

export default Provider;
