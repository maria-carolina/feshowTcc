import React, { useContext } from 'react';
import AccessRoute from './accessRoute';
import AppRoute from './appRoute';
import { View, ActivityIndicator } from 'react-native';
import Auth from '../contexts/auth';


const Root = () => {
    const {signed, loading} = useContext(Auth);

    if (loading) {
        return (
          <ActivityIndicator
              size = 'large'
              color = '#000'
          />
        )
    }

    return signed ? <AppRoute /> : <AccessRoute />
}

export default Root;