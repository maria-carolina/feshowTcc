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
        console.log(props.item);
        navigation.navigate('profilePage', {id: props.item.venue.user_id /* tem que vir user Id*/})
    }

    let splitted = props.item.start_date.split('-');
    let formattedDate = `${splitted[2]}/${splitted[1]}/${splitted[0]}`
    return(
        <View 
            style = {{
                ...styles.listItem,
                alignItems: 'center',
                flexDirection: 'row',
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
            <View
                style = {{
                    width: '100%',
                    padding: 5
                }}
            >
                <TouchableOpacity
                    onPress = {() => openEventPage()}
                    style = {{width: '70%'}}
                >
                    <Text
                        style = {{
                            marginLeft: 5,
                            fontSize: 18,
                            color: '#3F2058',
                        }}
                    >
                        {props.item.name}
                    </Text>
                </TouchableOpacity>
                <View
                    style = {{
                        flexDirection: 'row'
                    }}
                >
                    <Text> @ </Text>

                    <TouchableOpacity
                        onPress = {() => openVenuePage()}
                    >
                        <Text
                            style = {{
                                fontSize: 14,
                                color: '#3F2058',
                            }}
                        >
                            {props.item.venue.name}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

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