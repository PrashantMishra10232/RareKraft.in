import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
   const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      navigate("/login");
    } else if (user.role !== "Seller") {
      navigate("/");
    }
  }, [user, navigate]);

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <>{children}</>
  )
}

export default ProtectedRoute