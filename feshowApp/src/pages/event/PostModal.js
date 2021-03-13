import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, Modal, Alert, TextInput} from 'react-native';
import styles from '../../styles';
import api from '../../services/api';

const PostModal = (props) => {
    const [postInputValue, setPostInputValue] = useState(null);

    useEffect(() => {
        if(props.post !== undefined){
            console.log('passa dentro')
            setPostInputValue(props.post.text)
        }else{
            setPostInputValue('')
        }
    }, [props])

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
                    Alert.alert('Pronto', 'Postagem realizada.')
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

    const updatePost = async (postId) => {
        if(postInputValue !== '' || postInputValue !== null){
            try{
                let result = await api.put(
                    '/updatePost',
                    {
                        postId,
                        post: postInputValue
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${props.token}`
                        }
                    }
                );

                if(result.data == 'ok'){
                    Alert.alert('Pronto', 'Postagem editada com sucesso.')
                    props.closeModal()
                }else{
                    Alert.alert('Ops', 'Ocorreu um erro1')
                }
            }catch(e){
                Alert.alert('Ops', 'Ocorreu um erro2.')
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
                    {props.post === undefined ? 'Nova':'Editar'} Postagem
                </Text>
                <TextInput
                    style = {{...styles.textInput,
                        width: '90%', 
                        height: 100, 
                        textAlignVertical: 'top'
                    }}
                    onChangeText = {text => setPostInputValue(text)}
                    value = {postInputValue}
                />

                <TouchableOpacity
                    style = {styles.button}
                    onPress = {
                        props.post === undefined ? 
                        () => savePost() : () => updatePost(props.post.id)
                    }
                >
                    <Text
                        style = {styles.buttonLabel}
                    >
                        {props.post === undefined ? 'Postar' : 'Editar'}
                    </Text>
                </TouchableOpacity>

            </View>

        </Modal>
    )
}

export default PostModal;