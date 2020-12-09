import React, { Component, useState } from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import styles from '../../../styles';
import ImagePicker from 'react-native-image-picker';
import api from '../../../services/api'


const ImagePick = (props) => {
    const [avatar, setAvatar] = useState();
    const [source, setSource] = useState();
    const user = props.route.params.user; 
    console.log(user);

    const advance = async () => {
        user.profile.image = avatar; 
        var formData = new FormData();
        formData.append('file', avatar);
        try{
            var response = await api.post('http://localhost:3001/store', user);
            await api.post('http://localhost:3001/storeImage', formData, 
            {headers: 
                {
                    Authorization: `Bearer ${response.data.token}`, 
                    'Content-type': 'multipart/form-data', 
                    'Accept': 'application/json'
                }
            })
        }catch(e){
            throw e;
        }

        console.log(response.data);
    }

    return(
        <View style = {styles.container}>
            <Image 
                source = {source ? source : 'http://camo.githubusercontent.com/b7b7dca15c743879821e7cfc14e8034ecee3588e221de0a6f436423e304d95f5/68747470733a2f2f7a7562652e696f2f66696c65732f706f722d756d612d626f612d63617573612f33363664616462316461323032353338616531333332396261333464393030362d696d6167652e706e67'} 
                style = {{
                    width: 200, 
                    height: 200, 
                    margin: 5,
                    borderRadius: 100
                }}
            />
            <TouchableOpacity
                style = {styles.button}
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

                    console.log(avatar);
                    setAvatar(avatar);
                    setSource(source);
                })}
            >
                <Text style = {styles.buttonLabel}>Adicione uma imagem</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress = {advance}
                style = {styles.button}
            >
                <Text style = {styles.buttonLabel}>Avançar</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ImagePick;