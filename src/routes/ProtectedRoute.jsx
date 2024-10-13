import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const user = useSelector((state) => state.auth.user);

  return user ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
