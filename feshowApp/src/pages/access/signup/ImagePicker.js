import React, { Component, useState, useContext } from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import styles from '../../../styles';
import ImagePicker from 'react-native-image-picker';
import api from '../../../services/api';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AuthContext from '../../../contexts/auth';



const ImagePick = (props) => {
    const [avatar, setAvatar] = useState(null);
    const [source, setSource] = useState(null);
    const user = props.route.params.user; 
    const authContext = useContext(AuthContext);

    const save = async () => {
        try{
            var result = await api.post('/store', user);
            console.log(user);

            if(!result.data.error){
                if(avatar){
                    var formData = new FormData();
                    formData.append('file', avatar);
                    result = await api.post('/storeImage', formData, 
                        {
                            headers: 
                            {
                                Authorization: `Bearer ${result.data.token}`, 
                                'Content-type': 'multipart/form-data', 
                                'Accept': 'application/json'
                            }
                        }
                    )
                }

                if(!result.data.error){
                    authContext.signIn({
                        username: user.username,
                        password: user.password
                    })
                }else{
                    Alert.alert("Ops", result.data.error);
                }
                
                
            }else{
                Alert.alert("Ops", result.data.error)
            }
        }catch(e){
            throw e;
        }

    }

    return(
        <View style = {styles.container}>
            <Text style = {styles.title}>Adicione uma imagem de perfil</Text>
            { (source &&
            <Image 
                source = {source} 
                style = {{
                    width: 200, 
                    height: 200,
                    margin: 5,
                    borderRadius: 100
                }}
            />) || 
             <TouchableOpacity
                style = {{
                    width: 200, 
                    height: 200,
                    margin: 5,
                    borderWidth: .5,
                    borderRadius: 100,
                    borderColor: '#6A1F6F',
                    backgroundColor: '#D8D8D8',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onPress = {() => ImagePicker.showImagePicker({title:'Selecione uma imagem',
                storageOptions:{
                    skipBackup: true,
                    path: 'images',
                    
                }}, 
                (response) => {
                    if(response.didCancel) return;
                    if(response.error) return;
                    
                    const source = {uri: response.uri}
                    const avatar = {...source, 
                        name: response.fileName,
                        type: response.type}

                    setAvatar(avatar);
                    setSource(source);
                })}
             >
                 <FontAwesome name = {'plus'} size = {50} color = {'#3A0E54'}/>
             </TouchableOpacity>
            }
            
            <TouchableOpacity
                onPress = {save}
                style = {styles.button}
            >
                <Text style = {styles.buttonLabel}>{avatar ? 'Avançar' : 'Pular'}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ImagePick;