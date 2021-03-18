import React, { useState } from 'react';
import {View, Text, TouchableOpacity, Modal, Image, ActivityIndicator} from 'react-native';
import styles from '../../styles';

const ImageChangeModal = (props) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    return(
        <Modal
            visible = {props.visible}
            transparent = {true}
            animationType = 'fade'
            onRequestClose = {props.closeModal}
        >
            <View style = {styles.container}>
                    <Text style = {{
                        ...styles.title, 
                        marginBottom: 10
                    }}>
                        Nova Imagem de perfil
                    </Text>

                    <Image 
                        source = {props.source}
                        style = {{
                            width: '80%',
                            height: '70%',
                        }}
                    />


                    <View
                        style = {{
                            flexDirection: 'row',
                            marginTop: 15
                        }}
                    >
                        <TouchableOpacity 
                            style = {{
                                ...styles.button,
                                width: '45%',
                                height: 40,
                                marginRight: '5%'
                            }}
                            onPress = {() => {
                                if(props.hasANewAvatar){
                                    setIsSaving(true);
                                }
                                props.firstButtonHandleClick();
                            }}
                        >
                            {isSaving ? 
                                <ActivityIndicator 
                                    size = {'small'}
                                    color = {'#FFF'}
                                />
                                : 
                                <Text style = {styles.buttonLabel}>
                                    {props.hasANewAvatar ? 'Salvar' : 'Alterar'}
                                </Text>
                            }
                            
                        </TouchableOpacity>

                        <TouchableOpacity
                            style = {{
                                ...styles.button,
                                height: 40,
                                width: '45%',
                                backgroundColor: '#FD0505'
                            }}
                            onPress = {() => {
                                if(!props.hasANewAvatar){
                                    setIsDeleting(true);
                                }
                                props.secondButtonHandleClick();
                            }}
                        >

                            {isDeleting ? 
                                <ActivityIndicator 
                                    size = {'small'}
                                    color = {'#FFF'}
                                />
                                : 
                                <Text style = {styles.buttonLabel}>
                                    {props.hasANewAvatar ? 'Cancelar' : 'Remover'}
                                </Text>
                            }
                            
                        </TouchableOpacity>

                    </View>
            </View>

        </Modal>
    )
}

export default ImageChangeModal;