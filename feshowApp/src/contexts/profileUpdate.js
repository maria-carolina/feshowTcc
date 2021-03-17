import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';
import AuthContext from './auth';

const ProfileUpdateContext = createContext();

export const ProfileUpdateProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const authContext = useContext(AuthContext);

    const loadProfile = async () => {
        
        try{
            let result = await api.get(
                `/showUser/${authContext.user.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authContext.token}`
                    }
                }
            )

            if(!result.data.error){
                setProfile(result.data);
            }else{
                Alert.alert('Ops', result.data.error)
            }

        }catch(e){
            console.log(e);
        }
       
    }

    const alterProfile = (property, data) => {
        let profileAux = profile;
        profileAux[property] = data;
        setProfile({...profileAux});
    }

    const saveUpdate = async (values) => {
        let data;
        if(authContext.user.type === 0){
            data = {
                "email": values.email, 
                "profile": {
                    "name": values.name,
                    "description" : values.description,
                    "state": profile.state, 
                    "city": profile.city, 
                    "cache": values.cache, 
                    "equipment": profile.equipments,
                    "instruments": profile.instruments,
                    "genres": profile.genres.map(item => item.id), 
                    "members": values.members, 
                },
                "username": values.username
            }
        }else if(authContext.user.type === 1){
            data = {
                "email": values.email, 
                "profile": {
                    "address": profile.address,
                    "capacity": values.capacity, 
                    "equipment": profile.equipments,
                    "genres": profile.genres.map(item => item.id), 
                    "name": values.name, 
                    "description" : values.description,
                    "openinghours": profile.openinghours
                },  
                "username": values.username
            }
        }else{
            data = {
                "email": values.email, 
                "profile": {
                    "name": values.name,
                    "description" : values.description,
                    "state": profile.state,
                    "city": profile.city,
                }, 
                "username": values.username
            }
        }

        try{
            const config = {
                headers:{
                    Authorization: `Bearer ${authContext.token}`
                }
            }

            let result = await api.post('/verifyUsernameUpdate', {username: values.username}, config);

            if(!result.data.error){
                result = await api.post('/verifyEmailUpdate', {email: values.email}, config);
                if(!result.data.error){
                    let result = await api.put(
                        '/updateUser',
                        data,
                        config
                    )
        
                    if(!result.data.error){
                        Alert.alert("Pronto!","Perfil alterado com sucesso");
                    }else{
                        Alert.alert("Ops.", result.data.error);
                    }
                }else{
                    Alert.alert("Ops.", result.data.error);
                }
            }else{
                Alert.alert("Ops.", result.data.error);
            }
            

        }catch(e){
            console.log(e);
        }
    }

    return(
        <ProfileUpdateContext.Provider
            value = {{
                isProfileFetched: !!profile,
                profile,
                loadProfile,
                alterProfile,
                saveUpdate,
            }}
        >
            {children}
        </ProfileUpdateContext.Provider>
    )
}

export default ProfileUpdateContext;