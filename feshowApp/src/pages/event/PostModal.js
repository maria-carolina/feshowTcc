import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Modal, Alert, TextInput} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';

const PostModal = (props) => {
    const [postInputValue, setPostInputValue] = useState(null);

    const savePost = async () => {
        if(postInputValue !== '' || postInputValue !== null){
            try{
                let result = await api.post(
                    '/createPost',
                    {
                        eventId: props.eventId,
                        post: postInputValue
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${props.token}`
                        }
                    }
                );

                if(result.data == 'ok'){
                    props.closeModal()
                }else{
                    Alert.alert('Ops', 'Ocorreu um erro.')
                }
            }catch(e){
                Alert.alert('Ops', 'Ocorreu um erro.')
            }
        }else{
            Alert.alert('Opa', 'Digite alguma coisa.')
        }
    }

    return(
        <Modal
            visible = {props.visible}
            onRequestClose = {() => props.closeModal()}
        >
            <View style = {styles.container}>
                <Text
                    style = {styles.title}
                >
                    Nova Postagem
                </Text>
                <TextInput
                    style = {{...styles.textInput,
                        width: '90%', 
                        height: 100, 
                        textAlignVertical: 'top'
                    }}
                    onChangeText = {text => setPostInputValue(text)}
                />

                <TouchableOpacity
                    style = {styles.button}
                    onPress = {() => savePost()}
                >
                    <Text
                        style = {styles.buttonLabel}
                    >
                        Postar
                    </Text>
                </TouchableOpacity>

            </View>

        </Modal>
    )
}

export default PostModal;