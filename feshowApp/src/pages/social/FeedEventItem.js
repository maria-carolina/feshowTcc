import React, { useContext } from 'react';
import {View, Text, TouchableOpacity, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AuthContext from '../../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles';


const FeedEventItem = (props) => {
    const { user } = useContext(AuthContext);
    const navigation = useNavigation();
    return(
        <TouchableOpacity
            style = {{
                width: '100%',
                backgroundColor: 'white',
                marginBottom: 15,
                padding: 10
            }}
            onPress = {() => navigation.navigate('eventPage', {id: props.item.id})}
            activeOpacity = {0.9}
        >
            <View 
                style = {{
                    width: '100%',
                    position: 'relative',
                    marginTop: 10, 
                    paddingLeft: 15
                }}
            >
                <View style = {styles.row}>
                    <Text 
                        style = {{
                            color: '#3F2058', 
                            fontSize: 22,
                            fontWeight: 'bold'
                        }}
                    >
                        {props.item.name}
                    </Text>

                </View>
                <Text>por {props.item.organizer.name}</Text>

                <View style = {{position: 'absolute', alignSelf: 'flex-end'}}>

                    <View style = {styles.row}>
                        <FontAwesome
                            name = {'home'}
                            size = {15}
                            color = {'#3f2058'} 
                        />
                        <Text> {props.item.venue.name}</Text>
                    </View>

                    <View style = {styles.row}>
                        <FontAwesome
                            name = {'calendar'}
                            size = {15}
                            color = {'#3f2058'} 
                        />
                        <Text> {props.item.start_date}</Text>
                    </View>
                    
                    <View style = {styles.row}>
                        <FontAwesome
                            name = {'clock-o'}
                            size = {15}
                            color = {'#3f2058'} 
                        />
                        <Text> {props.item.start_time} às {props.item.end_time}</Text>
                    </View>
                </View>
            </View>

            <View 
                style = {{
                    width: '100%',
                    alignItems: 'center',
                    paddingTop: user.type === 0 ? 10 : 30
                }}
            >

                {(props.item.lineup.length > 0 &&
                    <View style = {{...styles.row, marginBottom: 15, marginTop: 15}}>
                        <Text style = {{
                            color: '#3F2058', 
                            fontWeight: 'bold',
                            fontSize: 16
                        }}> 
                            {'Lineup: '} 
                        </Text>
                        {props.item.lineup.map((item, index) => {
                            let artistName = index === 0 ? item.name : ` | ${item.name}`;
                            return (
                                <Text 
                                    key = {item.id}
                                    style = {{fontSize: 16}}
                                >
                                    {artistName}
                                </Text>
                            );
                        })}
                    </View>) ||
                    <Text style = {{marginBottom: 15, marginTop: 10}}>
                        Ainda não há ninguém no line-up
                    </Text>
                }
                
                { user.type === 0 && !props.item.inEvent &&
                <TouchableOpacity
                    style = {{
                        ...styles.outlineButton
                    }}
                    onPress = {props.showSolicitationModal}
                >
                    
                    <Text style = {{
                        ...styles.outlineButtonLabel,
                        fontSize: 14
                    }}>
                        Participar desse evento
                    </Text>
                    
                </TouchableOpacity>
                }

                {user.type === 0 && props.item.inEvent &&
                <Text>
                    Você já está no line-up!
                </Text>
                }
            </View>

            
        </TouchableOpacity>
    )
}

export default FeedEventItem;