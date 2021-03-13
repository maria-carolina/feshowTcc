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

            console.log(profile);
        }catch(e){
            console.log(e);
        }
       
    }

    const alterProfile = (property, data) => {
        let profileAux = profile;
        profileAux[property] = data;
        setProfile({...profileAux});
    }

    return(
        <ProfileUpdateContext.Provider
            value = {{
                isProfileFetched: !!profile,
                profile,
                loadProfile,
                alterProfile
            }}
        >
            {children}
        </ProfileUpdateContext.Provider>
    )
}

export default ProfileUpdateContext;