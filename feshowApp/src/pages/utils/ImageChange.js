import React, { Component } from 'react';
import {View, Text, TouchableOpacity, Modal, Image} from 'react-native';
import styles from '../../styles';

const ImageChangeModal = (props) => {
    return(
        <Modal
            visible = {props.visible}
            transparent = {true}
            animationType = 'fade'
            onRequestClose = {props.closeModal}
        >
            <View style = {styles.container}>
                    <Text style = {{...styles.title, marginBottom: 10}}>Novo Flyer</Text>

                    <Image 
                        source = {props.source}
                        style = {{
                            width: '80%',
                            height: '70%',
                        }}
                    />

                    <TouchableOpacity 
                        style = {{
                            ...styles.button, 
                            marginTop: 10, 
                            marginBottom: 5
                        }}
                        onPress = {props.firstButtonHandleClick}
                    >
                        <Text style = {styles.buttonLabel}>
                            {props.newAvatar ? 'Salvar' : 'Alterar'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style = {{
                            ...styles.button, 
                            marginTop: 5
                        }}
                        onPress = {props.secondButtonHandleClick}
                    >
                        <Text style = {styles.buttonLabel}>
                            {props.newAvatar ? 'Cancelar' : 'Remover'}
                        </Text>
                    </TouchableOpacity>
            </View>

        </Modal>
    )
}

export default ImageChangeModal;