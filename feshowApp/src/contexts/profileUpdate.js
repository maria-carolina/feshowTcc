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

            console.log(result.data)

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

    const saveUpdate = async () => {
        let data;
        if(authContext.user.type === 0){
            data = {
                "email": profile.email, 
                "profile": {
                    "description" : profile.description,
                    "state": profile.state, 
                    "cache": profile.cache, 
                    "city": profile.city, 
                    "equipment": profile.equipments,
                    "genres": profile.genres.map(item => item.id), 
                    
                    "members": profile.members, 
                    "name": profile.name
                },
                "username": profile.username
            }
        }else if(authContext.user.type === 1){
            data = {
                "email": profile.email, 
                "profile": {
                    "address": profile.address,
                    "capacity": profile.capacity, 
                    "equipment": profile.equipments,
                    "genres": profile.genres.map(item => item.id), 
                    "name": profile.name, 
                    "description" : profile.description,
                    "openinghours": profile.openinghours
                },  
                "username": profile.username
            }
        }else{
            data = {
                "email": profile.email, 
                "profile": {
                    "description" : profile.description,
                    "state": profile.state,
                    "city": profile.city,
                    "name": profile.name
                }, 
                "username": profile.username
            }
        }

        try{
            let result = await api.put(
                '/updateUser',
                data,
                {
                    headers:{
                        Authorization: `Bearer ${authContext.token}`
                    }
                }
            )

            if(!result.data.error){
                Alert.alert("Pronto!","Perfil alterado com sucesso");
            }else{
                Alert.alert("Ops.", result.data.error)
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