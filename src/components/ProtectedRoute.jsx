import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authenticatedUser, logoutUser } from '../redux/services/operations/authApi';
import { Navigate, useNavigate } from 'react-router-dom';

function ProtectedRoute({children}) {
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
      async function isAuthenticatedUser() {
        const response = await authenticatedUser(token, navigate);
        // console.log("Response", response);
        if(!response) {
          dispatch(logoutUser(token, navigate));
        }
      }
      
      if(token) {
        isAuthenticatedUser();
      }
    }, [token]);
    
    if(token === null) {
      return <Navigate to="/login" />
    }

    return children;
}

export default ProtectedRoute