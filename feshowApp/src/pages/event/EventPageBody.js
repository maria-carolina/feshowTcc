import React from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import styles from '../../styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PageBody = (props) => {
    if(props.selectedTab == 0){
        return (
            <View style = {{width: '90%'}}>
                {(props.loaded !== null &&
                    <Text>{props.loaded}</Text>
                ) || 
                    <Text>Nenhuma descrição</Text>
                }
            </View>
        )
    }

    //lista diferente de acordo com o usuário
    if(props.selectedTab == 3){
        console.log(props.loaded)
        return (
            props.loaded.equipments.map((item) => {
                var equipment = item.quantity > 1 ? 
                (item.equipment.charAt(item.equipment.length - 1) === 'r' ? 
                `${item.equipment}es`: `${item.equipment}s`)
                : item.equipment;
            
                return(
                    <View
                        style = {{
                            borderBottomWidth: .5,
                            padding: 20,
                        }}
                        key = {props.loaded.equipments.indexOf(item)}
                    >
                        <Text>{`É necessário arrumar ${item.quantity} ${equipment} para ${item.name}`}</Text>
                    </View>
                )
            })
        )
    }

    //listas fixas do evento, independente do usuário
    
    var list = props.loaded.map((item) => {
        if(props.selectedTab == 1){ 
            return (
                <View 
                    style = {{...styles.row, 
                        borderBottomWidth: .5,
                        padding: 20,
                        position: 'relative'
                    }}
                    key = {props.loaded.indexOf(item)}
                >
                    <Text style = {{color: '#000', 
                        fontWeight: 'bold',
                        marginLeft: 25
                        }}>
                            {item.artists.name || null}
                        </Text>
                    <Text style = {{
                        right: 80,
                        position: 'absolute'
                    }}>
                        {item.start_time} 
                    </Text>
                </View>
            )
        }else if(props.selectedTab == 2){
            return(
                <View 
                    style = {{ 
                        borderBottomWidth: .5,
                        padding: 10,
                        position: 'relative'
                    }}
                    key = {props.loaded.indexOf(item)}
                >
                    <Text 
                        style = {{
                            fontWeight: 'bold', 
                            color: '#3F2058'
                        }}>
                        {item.name}
                    </Text>

                    <Text>
                        {item.post}
                    </Text>

                    {   
                        props.loggedUserId === item.userId &&
                        <View style = {{
                            ...styles.row,
                            alignSelf: 'flex-end',
                            position: 'absolute',
                            top: '50%'
                        }}>

                            <TouchableOpacity
                                onPress = {() => 
                                    props.editPost({
                                        id: item.postId,
                                        text: item.post
                                    })
                                }
                                style = {{marginRight: 10}}
                            >
                                <FontAwesome 
                                    name = {'pencil'}
                                    size = {25}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress = {() => props.deletePost(item.postId)}
                            >
                                <FontAwesome
                                    name = {'trash-o'}
                                    size = {25} 
                                />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            )
        }
    })

    return (
        <View style = {{width: '90%'}}>
            {props.selectedTab == 1 && 
            props.isOrganizer &&
            props.loaded.length > 0 &&
                <TouchableOpacity
                    style = {
                        {
                            ...styles.outlineButton,
                            alignSelf: 'flex-end',
                            right: 10,
                        }
                    }
                    onPress = {props.openLineUpEdit}
                >
                    <Text style = {styles.outlineButtonLabel}>
                        Alterar line-up
                    </Text>
                </TouchableOpacity>
            }

            {
                props.selectedTab == 2 && 
                (props.isRelatedToEvent || props.isOrganizer) &&
                <TouchableOpacity
                    style = {{...styles.textInput,
                        padding: 10,
                        width: '100%',
                        marginTop: 5
                    }}
                    onPress = {props.openPostModal}
                >
                    <Text
                        style = {{color: '#8E8E8E'}} 
                    >
                        Insira um comentário...
                    </Text>
                </TouchableOpacity>
            }

            {list}

            {props.selectedTab == 1 &&
            props.isOrganizer &&
                <TouchableOpacity
                    style = {{...styles.button, alignSelf: 'center', width: '60%'}}
                    onPress = {props.openInvitation}
                >
                    <Text style = {{...styles.buttonLabel, fontSize: 18}}>
                        Convidar artistas
                    </Text>
                </TouchableOpacity>
            }
        </View>
    );
}

export default PageBody;