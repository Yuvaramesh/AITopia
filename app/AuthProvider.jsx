"use client";

import { useUser } from '@stackframe/stack';
import React, { useEffect, useState } from 'react';
import { UserContext } from './_context/UserContext';

function AuthProvider({ children }) {
  const user = useUser();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      createNewUser();
    }
  }, [user]);

  const createNewUser = async () => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.displayName,
          email: user.primaryEmail,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        console.error("Error creating user:", error.message);
      } else {
        const result = await res.json();
        console.log("User created:", result);
        setUserData(result);
      }
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export default AuthProvider;
