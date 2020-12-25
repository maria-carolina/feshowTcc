import React, { Component } from 'react';
import {View, Image} from 'react-native';

import styles from '../../styles';


const ImageTest = () => {
    return(
        <View style = {styles.container}>
            <Image
                source = {
                    {
                        uri: 'http://192.168.1.33:3001/uploads/events/fb0b17e35fcb-image-316182d6-6e6a-420e-9343-482ada8e84df.jpg'
                    }
                } 
            />
        </View>
    )
}


export default ImageTest;