import React, { createContext, useState, useEffect } from 'react';
import Auth from '../services/auth';
import AsyncStorage from '@react-native-community/async-storage';


const AuthContext = createContext({ signed: false });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData(){
        
            const storagedUser = await AsyncStorage.getItem('auth_user');
            const storagedToken = await AsyncStorage.getItem('auth_token');

            if(storagedUser && storagedToken){
                setUser(JSON.parse(storagedUser));
                setToken(storagedToken);
                setLoading(false);
            }else if (!storagedUser && !storagedToken){
                setLoading(false);
            }
                
        }

        loadStorageData();
        
    }, [])


    signIn = async (data) => {
        let result = await Auth.signIn(data);
        
        if (!result.user){
            return result;
        }


        setToken(result.token);
        setUser(result.user);
        
        await AsyncStorage.setItem('auth_user', JSON.stringify(result.user));
        await AsyncStorage.setItem('auth_token', result.token);    
        
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
                token,
                signIn,
                signOut,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;