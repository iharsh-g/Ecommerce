import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authenticatedUser } from '../redux/services/operations/authApi';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({children}) {
    const dispatch = useDispatch();
    const {token, isAuthenticated} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
          navigate('/login');
        }
    
        dispatch(authenticatedUser(token, navigate));
    }, [dispatch, navigate, token]);
    
    return isAuthenticated ? children : null;
}

export default ProtectedRoute