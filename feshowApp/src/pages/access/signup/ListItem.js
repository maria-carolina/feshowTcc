import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from '../../../styles';


const Item = (props) => {
    let text = props.singlePick ? 
        <Text style = {props.selected === props.item.id ? 
            {...styles.itemText, fontWeight: 'bold'} : styles.itemText}
        >{props.item.name}</Text> :
        <Text
            style = {props.selected.includes(props.item.id) ? 
                {...styles.itemText, fontWeight: 'bold'} : styles.itemText}
        >{props.item.name}</Text>

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