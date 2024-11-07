// notemd-kohl/pages/receive-token.tsx

"use client";

import { useEffect, useContext } from 'react';
import { AuthContext } from './context/Authcontext'; // Adjust the path as needed

const ReceiveToken = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    // Ensure the component is mounted on the client
    if (typeof window === 'undefined') return;

    // Extract token from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store the token in localStorage
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage:', token);

      // Fetch and set the current user
      authContext?.fetchCurrentUser();

      // Redirect to the dashboard after a short delay to ensure fetchCurrentUser completes
      setTimeout(() => {
        window.location.href = '/dashboard'; // Adjust the path as needed
      }, 1000);
    } else {
      console.error('No token found in URL');
      // Redirect to login or show an error message
      window.location.href = process.env.NEXT_PUBLIC_HOMEPAGE_URL || '/';
    }
  }, [authContext]);

  return <div>Processing authentication...</div>;
};

export default ReceiveToken;
