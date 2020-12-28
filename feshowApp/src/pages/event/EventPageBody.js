import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../../styles';

const PageBody = (props) => {
    if(props.selectedTab == 0){
        return (
            <View style = {{width: '90%'}}>
                <Text style = {{...styles.title, textAlign: 'left'}}>Sobre o evento...</Text>
                <Text>{props.loaded}</Text>
            </View>
        )
    }

    //lista diferente de acordo com o usuário
    if(props.selectedTab == 3){
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
                    <Text style = {{color: '#000'}}>{item.artists.name || null}</Text>
                    <Text style = {{
                        right: 50,
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
                </View>
            )
        }
    })

    return (
        <View style = {{width: '90%'}}>
            {props.selectedTab == 2 && 
                <TouchableOpacity
                    style = {{...styles.textInput,
                        padding: 10,
                        width: '100%',
                        marginTop: 5
                    }}
                >
                    <Text
                        style = {{color: '#8E8E8E'}} 
                    >Insira um comentário...</Text>
                </TouchableOpacity>
            }

            {list}

            {props.selectedTab == 1 &&
                <TouchableOpacity
                    style = {{...styles.button, alignSelf: 'center'}}
                    onPress = {props.openInvitation}
                >
                    <Text style = {styles.buttonLabel}>
                        Convidar artistas
                    </Text>
                </TouchableOpacity>
            }
        </View>
    );
}

export default PageBody;