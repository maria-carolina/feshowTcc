import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from '../../../styles';


const Item = (props) => {
    return(
        <TouchableOpacity
            onPress = {props.select}
            style={styles.listItem}
        >
            <Text
                style = {props.selected == props.item ? 
                    {...styles.itemText, fontWeight: 'bold'} : styles.itemText}
            >{props.item}</Text>
        </TouchableOpacity>
    )
}

export default Item;