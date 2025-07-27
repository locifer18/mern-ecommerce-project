import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';

export default function Private() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/user-auth`);
        if (res.data.ok) setOk(true);
        else setOk(false);
      } catch (err) {
        setOk(false);
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
}
