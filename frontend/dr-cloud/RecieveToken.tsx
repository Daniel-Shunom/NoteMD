// notemd-kohl/pages/receive-token.tsx (Patient Application)

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from './context/Authcontext'; // Adjust the path as needed

const ReceiveToken = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!router.isReady) return; // Ensure the router is ready

    const { token } = router.query;

    if (token && typeof token === 'string') {
      // Store the token in localStorage
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage:', token);

      // Fetch and set the current user
      authContext?.fetchCurrentUser(); // Ensure this method exists in AuthContext

      // Redirect to the dashboard after storing the token
      router.replace('/dashboard'); // Adjust the path as needed
    } else {
      console.error('No token found in URL');
      // Redirect to login or show an error message
      router.replace('/');
    }
  }, [router, authContext]);

  return <div>Processing authentication...</div>;
};

export default ReceiveToken;
