import React, { createContext, useState, useEffect } from 'react';
import Auth from '../services/auth';
import AsyncStorage from '@react-native-community/async-storage';


const AuthContext = createContext({ signed: false });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData(){
            const storageUser = await AsyncStorage.getItem('auth_user');
            const storageToken = await AsyncStorage.getItem('auth_token');

            if(storageUser && storageToken){
                setUser(JSON.parse(storageUser));
            }
        
            setLoading(false);
        }

        loadStorageData();

    }, [])


    signIn = async (data) => {
        let result = await Auth.signIn(data);
        if (!result.error){
            setUser(result.user);
            await AsyncStorage.setItem('auth_user', JSON.stringify(result.user));
            await AsyncStorage.setItem('auth_token', result.token);
        }
        return result;
    }

    signOut = async () => {
        await AsyncStorage.clear();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value = {{
                signed: !!user,
                user,
                signIn,
                signOut,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;