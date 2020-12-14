import React, { Component, useState } from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import styles from '../../../styles';
import ImagePicker from 'react-native-image-picker';
import api from '../../../services/api';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



const ImagePick = (props) => {
    const [avatar, setAvatar] = useState(null);
    const [source, setSource] = useState(null);
    const user = props.route.params.user; 

    const advance = async () => {
        try{
            var response = await api.post('/store', user);
            if(avatar){
                var formData = new FormData();
                formData.append('file', avatar);
                await api.post('/storeImage', formData, 
                {headers: 
                    {
                        Authorization: `Bearer ${response.data.token}`, 
                        'Content-type': 'multipart/form-data', 
                        'Accept': 'application/json'
                    }
                })
            }  
        }catch(e){
            throw e;
        }

        console.log(response.data);
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
                    backgroundColor: '#6A3F6F',
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
                onPress = {advance}
                style = {styles.button}
            >
                <Text style = {styles.buttonLabel}>{avatar ? 'Avançar' : 'Pular'}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ImagePick;