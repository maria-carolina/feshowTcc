import React, { useContext } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles';
import AuthContext from '../../contexts/auth';

const FilterModal = (props) => {
    let type;
    if(props.selectedTab === 'artists'){ 
        type = 'Artistas' ;
    }else if (props.selectedTab === 'venues'){
        type = 'Espaços';
    }else if (props.selectedTab ===  'producers'){
        type = 'Produtores';
    }else if (props.selectedTab ===  'events'){
        type = 'Eventos';
    }

    const context = useContext(AuthContext);

    return(
        <Modal
            visible = {props.visible}
            animationType = 'slide'
            transparent = {true}
            onRequestClose = {props.closeModal}
        >
            <View
                style = {{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}
            >
                <View
                    style = {{
                        backgroundColor: '#FFF',
                        width: '90%',
                        padding: 15,
                        borderRadius: 5,
                        marginBottom: 7
                    }}
                >
                    
                    <Text 
                        style = {{
                            alignSelf: 'center',
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 15
                        }}>
                        Filtros
                    </Text>

                    {props.selectedTab === 'venues' && context.user.type === 0 &&
                        <TouchableOpacity 
                            style = {{
                                ...styles.listItem
                            }}
                            onPress = {() => props.applyFilter(props.selectedTab, 'Equipment')}
                        >
                            <Text style={{fontSize: 15}}>
                                Espaços que tenham os equipamentos que você precisa.
                            </Text>
                        </TouchableOpacity>
                    }

                    {context.user.type !== 2 &&
                        <TouchableOpacity
                            style = {{
                                ...styles.listItem
                            }}
                            onPress = {() => props.applyFilter(props.selectedTab, 'Genre')}
                        >
                            <Text style={{fontSize: 15}}>
                                {type} com os mesmos gêneros
                            </Text>
                        </TouchableOpacity>
                        
                    }

                    <TouchableOpacity 
                        style = {{
                            ...styles.listItem
                        }}
                        onPress = {() => props.applyFilter(props.selectedTab, 'City')}
                    >
                        <Text style={{fontSize: 15}}>
                            {type} na sua cidade
                        </Text>
                    </TouchableOpacity>

                    
                </View>
            </View>
        </Modal>
    )
}

export default FilterModal;