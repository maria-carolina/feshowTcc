import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from '../../../styles';


const Item = (props) => {
    let text = props.singlePick ? 
        <Text style = {props.selected === props.index ? 
            {...styles.itemText, fontWeight: 'bold'} : styles.itemText}
        >{props.item}</Text> :
        <Text
            style = {props.selected.includes(props.index) ? 
                {...styles.itemText, fontWeight: 'bold'} : styles.itemText}
        >{props.item}</Text>

    return(
        <TouchableOpacity
            onPress = {props.select}
            style={styles.listItem}
        >
            {text}
        </TouchableOpacity>
    )
}

export default Item;