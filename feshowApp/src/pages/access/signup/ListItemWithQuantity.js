import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../../../styles';
import InputSpinner from "react-native-input-spinner";


const Item = (props) => {
    const selectedItem = props.selected.filter(item => props.item.id === item.id)[0];
    const [value, setValue] = useState(selectedItem ? selectedItem.quantity : 1);
    
    return(
        <TouchableOpacity
            onPress = {props.select} 
            style={styles.listItem}
        >
            {(selectedItem &&
                <View style = {{...styles.row, height: 50}}>
                    <Text style = {{...styles.itemText, fontWeight: 'bold'}}
                    >{props.item.name}</Text>   

                    <InputSpinner 
                        min = {1}
                        value = {value}
                        rounded = {false}
                        showBorder = {true}
                        style = {{width: 90, position: 'absolute', right: 0}}
                        inputStyle = {{fontSize: 18}}
                        buttonStyle = {{width: 30}}
                        color = {'#61356F'}
                        onChange = {num => {
                            props.quantityHandleChange(num, props.item.id)
                            setValue(num);
                        }}
                    />
                </View>
            ) || <Text style = {styles.itemText}>{props.item.name}</Text>}         
        </TouchableOpacity>
    )
}

export default Item;