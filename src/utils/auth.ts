// utils/auth.ts
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    return !!token; // Return true if the token exists
  };
  