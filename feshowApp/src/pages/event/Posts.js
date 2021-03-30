import React, { useContext, useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import styles from '../../styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import PostModal from './PostModal';


const Posts = (props) => {
    const [isPostModalVisible, setIsPostModalVisible] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null)
    const authContext = useContext(AuthContext);
    const navigation = useNavigation();

    const editPost = (post) => {
        setIsPostModalVisible(true);
        setPostToEdit(post);
    }

    const loadDeleteConfirmation = (postId) => {
        Alert.alert(
            'Opa',
            'Realmente deseja excluir essa postagem?',
            [
                {
                    text: 'Sim',
                    onPress: () => deletePost(postId)
                },
                {
                    text: 'Não',
                    style: 'cancel'
                }
            ]
        )
    }

    const deletePost = async (postId) => {
        try{
            let result = await api.delete(
                `/deletePost/${postId}`,
                {
                    headers: {
                        Authorization: `Bearer ${authContext.token}`
                    }
                }
            );
            
            if(result.data == 'ok'){
                Alert.alert('Pronto', 'Postagem excluída com sucesso');
                props.reload();
            }else{
                Alert.alert('Ops', 'Ocorreu um erro.')
            }
        }catch(e){
            Alert.alert('Ops', 'Ocorreu um erro.')
        }
    }

    return(
        <View style = {{width: '90%'}}>
            {(props.isRelatedToEvent) &&
            <TouchableOpacity
                style = {{...styles.textInput,
                    padding: 10,
                    width: '100%',
                    marginTop: 5
                }}
                onPress = {() => setIsPostModalVisible(true)}
            >
                <Text
                    style = {{color: '#8E8E8E'}} 
                >
                    Insira um comentário...
                </Text>
            </TouchableOpacity>}

            {props.list.map((item) => {
                return(
                    <View 
                        style = {{ 
                            borderBottomWidth: .5,
                            padding: 10,
                            position: 'relative'
                        }}
                        key = {props.list.indexOf(item)}
                    >
                        <View style = {styles.row}>
                            <Text 
                                style = {{
                                    fontWeight: 'bold', 
                                    color: '#3F2058'
                                }}
                            >
                                {item.name}
                            </Text>

                            <Text
                                style = {{
                                    color: '#696969',
                                    marginLeft: 5
                                }}
                            >
                                {item.time}
                            </Text>
                        </View>

                        <Text>
                            {item.post}
                        </Text>

                        {   
                            authContext.user.id === item.userId &&
                            <View style = {{
                                ...styles.row,
                                alignSelf: 'flex-end',
                                position: 'absolute',
                                top: '50%'
                            }}>

                                <TouchableOpacity
                                    onPress = {() => 
                                        editPost({
                                            id: item.postId,
                                            text: item.post
                                        })
                                    }
                                    style = {{marginRight: 10}}
                                >
                                    <FontAwesome 
                                        name = {'pencil'}
                                        size = {25}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress = {() => loadDeleteConfirmation(item.postId)}
                                >
                                    <FontAwesome
                                        name = {'trash-o'}
                                        size = {25} 
                                    />
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                )
            })}
            <PostModal 
                visible = {isPostModalVisible}
                eventId = {props.event.id}
                token = {authContext.token}
                post = {postToEdit}
                reload = {props.reload}
                closeModal = {() => setIsPostModalVisible(false)} 
            />    
        </View>
    )
}

export default Posts;