import React, { useContext } from 'react';
import AccessRoute from './accessRoute';
import AppRoute from './appRoute';
import { View } from 'react-native';
import Auth from '../contexts/auth';


const Root = () => {
    const {signed, loading} = useContext(Auth);

    if (loading) {
        return (
          <View 
            style = {{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItem: 'center',
            }}>
            
          </View>
        )
    }

    return   <AppRoute />
}

export default Root;