import React, { useContext } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../../styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';

const Warnings = (props) => {
    return(
        <View style = {{width: '90%'}}>
            {props.list.equipments.map((item) => {
                var equipment = item.quantity > 1 ? 
                (item.equipment.charAt(item.equipment.length - 1) === 'r' ? 
                `${item.equipment}es`: `${item.equipment}s`)
                : item.equipment;
            
                return(
                    <View
                        style = {{
                            width: '100%',
                            borderBottomWidth: .5,
                            paddingVertical: 20,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                        key = {props.list.equipments.indexOf(item)}
                    >
                        <FontAwesome
                            name = {'exclamation-circle'}
                            size = {20}
                            color = {'#3f2058'}
                            style = {{marginRight: 5}} 
                        />
                        <Text style = {{width: '95%'}}>{`É necessário arrumar ${item.quantity} ${equipment} para ${item.name}`}</Text>
                    </View>
                )
            })}
        </View>
    )
}

export default Warnings;