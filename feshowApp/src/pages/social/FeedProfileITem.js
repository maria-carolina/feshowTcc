import React, { useContext } from 'react';
import {View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles';


const FeedProfileItem = (props) => {
    const buttonLabel = props.type === 0 ? 
    'Convidar para evento' : (props.type === 1 ? 'Marcar show': 'Enviar mensagem');
    
    const navigation = useNavigation();

    const handleButtonClick = () => {
        if(props.type === 0){
            navigation.navigate('profilePageInvitation', {artist: props.item})
        }else if(props.type === 1){
            navigation.navigate('requestPage', {venue: props.item})
        }
    }

    return(
        <TouchableOpacity
            style = {{
                width: '100%',
                height: 160,
                backgroundColor: 'white',
                marginBottom: 15,
                flexDirection: 'row',
                alignItems: 'center'
            }}
            onPress = {() => navigation.navigate('profilePage', {id: props.item.user_id})}
            activeOpacity = {0.9}
        >
            <View
                style = {{
                    width: '45%',
                    height: '90%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }} 
            >

                <Image
                    source = {props.item.image ? {uri: props.item.image} : 
                    require('../../assets/defaultProfileImage.jpeg')}
                    style = {{
                        width: '80%',
                        height: '80%',
                        borderRadius: 100,
                    }}
                />

            </View>

            <View
                style = {{
                    width: '55%',
                    height: '100%',
                    paddingTop: 15,
                    justifyContent: 'center'
                }}
            >
                <Text
                    style = {{
                        fontSize: 18,
                        marginLeft: 15
                    }}
                >
                    {props.item.name}
                </Text>

                <View
                    style = {{
                        marginLeft: 17
                    }} 
                >
                    <Text>{(props.item.city || props.item.address.city)}</Text>
                    {props.type !== 2 && 
                    <View style = {styles.row}>
                        {props.item.genres.map((item, index) => {
                            let genreName = index === 0 ? item.name : ` | ${item.name}`;
                            return <Text key={item.id}>{genreName}</Text>;
                        })}
                    </View>}                
                    
                    {(props.type === 0 && 
                        <Text>{props.item.members} membros</Text>
                    ) || (props.type === 1 &&
                        <Text>{props.item.capacity} pessoas</Text>
                    )}

                </View>

                <TouchableOpacity
                    style = {{
                        ...styles.outlineButton,
                        width: '90%',
                        marginTop: 10
                    }}
                    onPress = {handleButtonClick}
                >
                    <Text
                        style = {{
                            ...styles.outlineButtonLabel,
                            fontSize: 14
                        }}
                    >
                       {buttonLabel}
                    </Text>
                </TouchableOpacity>

            </View>
        </TouchableOpacity>
    )
}

export default FeedProfileItem;