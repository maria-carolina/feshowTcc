import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../../../styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const Item = (props) => {
    let text;
    if(props.selected === props.item.id || 
        (!props.singlePick && props.selected.includes(props.item.id))){
        text = (
            <View style = {styles.row}>
                <Text style = {{...styles.itemText, fontWeight: 'bold'}}>
                    {props.item.name}
                </Text>
                <FontAwesome 
                    name = {'check'} 
                    size = {30} 
                    color = {'#3F2058'}
                    style = {{position: 'absolute', right: 0}}
                />
            </View>
        )
    }else{
        text = <Text style = {styles.itemText}>
                    {props.item.name}
                </Text>
    } 
        

    return(
        <TouchableOpacity
            onPress = {props.select}
            style = {styles.listItem}
        >
            {text}
            
        </TouchableOpacity>
    )
}

export default Item;