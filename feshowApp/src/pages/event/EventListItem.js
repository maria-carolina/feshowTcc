import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../../styles';
import { useNavigation } from '@react-navigation/native';

const ListItem = (props) => {
    const navigation = useNavigation();

    const openEventPage = () => {
        navigation.navigate('eventPage', {id: props.item.id})
    }

    const openVenuePage = () => {
        navigation.navigate('profilePage', {id: props.item.venue.userId})
    }

    let splitted = props.item.start_date.split('-');
    let formattedDate = `${splitted[2]}/${splitted[1]}/${splitted[0]}`
    return(
        <View 
            style = {{
                ...styles.listItem,
                alignItems: 'center',
                flexDirection: 'row',
                height: 60,
                position: 'relative',
            }}
            key = {props.item.id.toString()}
        >
            <Text
                style = {{
                    fontWeight: 'bold'
                }}
            >
                {formattedDate}
            </Text>

            <TouchableOpacity
                onPress = {() => openEventPage()}
            >
                <Text
                    style = {{
                        marginLeft: 20,
                        fontSize: 16,
                        color: '#3F2058',
                    }}
                >
                    {props.item.name}
                </Text>
            </TouchableOpacity>

            <Text> @ </Text>

            <TouchableOpacity
                onPress = {() => openVenuePage()}
            >
                <Text
                    style = {{
                        fontSize: 16,
                        color: '#3F2058',
                    }}
                >
                    {props.item.venue.name}
                </Text>
            </TouchableOpacity>

            {props.showStatus &&
            <Text 
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 10,
                    fontWeight: 'bold',
                    color: '#3F2058',
                }}
            >
                {props.item.status == 1 ? 'aberto' : 'feshow!'}
            </Text>
            }
        </View>
    )

}

export default ListItem;