import React, { useEffect, useContext, useState } from 'react';
import {View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator} from 'react-native';
import { Formik } from 'formik';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import Format from '../utils/Format';
import { useNavigation } from '@react-navigation/native';
import ProfileUpdateContext from '../../contexts/profileUpdate';


AccountInfoEdit = (props) => {
    const { alterProfile } = useContext(ProfileUpdateContext);
    return(
        <View
            style = {{
                marginTop: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#cecece'
            }}
        >

            <Text style = {styles.inputLabel}>
                username
            </Text>

            <TextInput 
                value = {props.profile.username}

                style = {{
                    ...styles.textInput,
                    width: '100%',
                    marginTop: 0
                }}

                onChangeText = {(text) => {
                    alterProfile('username', text)
                }}
            />

            <Text style = {styles.inputLabel}>
                email
            </Text>

            <TextInput 
                value = {props.profile.email}

                style = {{
                    ...styles.textInput,
                    width: '100%',
                    marginTop: 0
                }}

                onChangeText = {(text) => {
                    handleChange('email');
                    alterProfile('email', text);
                }}
            />

            <TouchableOpacity
                style = {{
                    alignSelf: 'flex-end',
                    marginVertical: 15
                }}
            >
                <Text
                    style = {{
                        fontSize: 15,
                        color: '#3f2058'
                    }}
                >
                    Alterar senha
                </Text>
            </TouchableOpacity>

        </View>
        )
    
}

BasicInfoEdit = (props) => {
    const authContext = useContext(AuthContext);
    const { alterProfile } = useContext(ProfileUpdateContext);

    let initialValues;
    if(authContext.user.type === 0){
        initialValues = {
            name: props.profile.name,
            state: 'SP',
            city: props.profile.city,
            members: String(props.profile.members),
            payment: String(props.profile.cache),
            description: props.profile.description
        }
    }else if(authContext.user.type === 1){
        initialValues = {
            name: props.profile.name,
            capacity: String(props.profile.capacity),
            description: props.profile.capacity
        }
    }else{
        initialValues = {
            name: props.profile.name,
            state: 'GO',
            city: 'Goiânia',
        }
    }

    return (
        <Formik
            initialValues = {initialValues}
        >
            {({values, handleChange, handleSubmit}) => (
                <View
                    style = {{
                        paddingVertical: 15,
                        borderBottomWidth: 1,
                        borderBottomColor: '#cecece',
                    }}
                >
                    <Text style = {styles.inputLabel}>
                        nome
                    </Text>

                    <TextInput 
                        value = {values.name}
                        style = {{
                            ...styles.textInput,
                            width: '100%',
                            marginTop: 0
                        }}
                        onChangeText = {(text) => {
                            handleChange('name');
                            alterProfile('name', text)
                        }}
                    />

                    {authContext.user.type !== 1 &&
                        <View style = {{ flexDirection: 'row' }}>


                        <View 
                            style = {{
                                width: '49%',
                                marginRight: '2%'
                            }}
                        >
                            <Text style = {styles.inputLabel}>
                                estado
                            </Text>

                            <TextInput 
                                value = {values.state}
                                style = {{
                                    ...styles.textInput,
                                    width: '100%',
                                    marginTop: 0
                                }}
                                onChangeText = {handleChange('state')}
                            />
                        </View>

                        <View style = {{ width: '49%' }}>
                            <Text style = {styles.inputLabel}>
                                cidade
                            </Text>

                            <TextInput 
                                value = {values.city}
                                style = {{
                                    ...styles.textInput,
                                    width: '100%',
                                    marginTop: 0
                                }}
                                onChangeText = {handleChange('cidade')}
                            />
                        </View>
                    </View>
                    }

                    {authContext.user.type === 0 &&
                        <View style = {{ flexDirection: 'row' }}>

                            <View 
                                style = {{
                                    width: '49%',
                                    marginRight: '2%'
                                }}
                            >
                                <Text style = {styles.inputLabel}>
                                    membros
                                </Text>

                                <TextInput 
                                    value = {values.members}
                                    style = {{
                                        ...styles.textInput,
                                        width: '100%',
                                        marginTop: 0
                                    }}
                                    onChangeText = {(text) => {
                                        handleChange('members');
                                        alterProfile('members', text)
                                    }}
                                    keyboardType = 'numeric'
                                />
                            </View>
                            

                            
                            <View style = {{ width: '49%' }}>
                                <Text style = {styles.inputLabel}>
                                    cache
                                </Text>

                                <TextInput 
                                    value = {values.payment}
                                    style = {{
                                        ...styles.textInput,
                                        width: '100%',
                                        marginTop: 0
                                    }}
                                    onChangeText = {(text) => {
                                        handleChange('payment');
                                        alterProfile('payment', text)
                                    }}
                                    keyboardType = 'numeric'
                                />
                            </View>
                            
                        </View>
                    }


                    {authContext.user.type === 1 &&
                        <>
                        <Text style = {styles.inputLabel}>
                            capacidade
                        </Text>

                        <TextInput 
                            value = {values.capacity}
                            style = {{
                                ...styles.textInput,
                                width: '100%',
                                marginTop: 0
                            }}
                            onChangeText = {(text) => {
                                handleChange('capacity');
                                alterProfile('capacity', text);
                            }}
                            keyboardType = 'numeric'
                        />
                        </>
                    }
                    
                    <Text style = {styles.inputLabel}>
                        descrição
                    </Text>

                    <TextInput 
                        value = {values.description}
                        style = {{
                            ...styles.textInput,
                            width: '100%',
                            height: 70,
                            marginTop: 0,
                            textAlignVertical: 'top'
                        }}
                        onChangeText = {(text) => {
                            handleChange('description');
                            alterProfile('description', text)
                        }}
                    />


                </View>
            )}

        </Formik>
    )
}

GenreEdit = (props) => {
    const navigation = useNavigation();
    return (
        <View
            style = {{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#cecece',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 120
            }}
        >
            <Text
                style = {{
                    fontSize: 18,
                    fontWeight: 'bold',
                }}
            >
                Generos
            </Text>

            <View style = {{flexDirection: 'row'}}>
                {props.list.length > 0 ? (
                    props.list.map((item, index) => {
                        return (
                            <Text key = {item.id}> 
                                {index === 0 ? item.name: ` | ${item.name}`}
                            </Text> 
                        )
                    })
                ):(
                    <Text>Nenhum gênero cadastrado.</Text>
                )}
                
            </View>

            <TouchableOpacity
                onPress = {() => navigation.navigate('genrePick', { list: props.list })}
            >
                <Text style = {{ color: '#3F2058' }} >
                    {props.list.length > 0 ? 'Alterar' : 'Adicionar'} generos
                </Text>
            </TouchableOpacity>

        </View>
    )
}

StuffEdit = (props) => {
    const navigation = useNavigation();

    return (
        <View
            style = {{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#cecece',
                alignItems: 'center',
            }}
        >
            <Text
                style = {{
                    fontSize: 18,
                    fontWeight: 'bold',
                }}
            >
                {props.type === 'instrumento' ? 'Instrumentos' : 'Equipamentos'} 
            </Text>
            
            <View style = {{marginVertical: 15}}>
                {props.list.length > 0 ? (props.list.map(item => (
                    <Text style = {{textAlign: 'center'}}>{item.quantity} {item.name}</Text>
                ))):
                    <Text>{`Nenhum ${props.type} cadastrado.`}</Text>
                }
            </View>

            
            <TouchableOpacity
                onPress = {() => {
                    let routeName = props.type === 'instrumento' ? 'instrumentPick' : 'equipmentPick';
                    navigation.navigate(routeName, {list: props.list})
                }}
            >
                <Text style = {{ color: '#3F2058' }}>
                    {props.list.length > 0 ? `Alterar ${props.type}`: `Adicionar ${props.type}s`}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

OpeningPeriodEdit = (props) => {
    const navigation = useNavigation();
    return(
        <View
            style = {{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#cecece',
                alignItems: 'center',
            }}
        >
            <Text
                style = {{
                    fontSize: 18,
                    fontWeight: 'bold',
                }}
            >
                Funcionamento
            </Text>

            <View style = {{marginVertical: 15, alignItems: 'center'}}>
                <Text>{props.period.initialDay.label} a {props.period.finalDay.label}</Text>
                <Text>{props.period.initialHour} às {props.period.finalHour}</Text>
            </View>

            <TouchableOpacity
                onPress = {() => navigation.navigate('openingHoursPick', { period: props.period})}
            >
                <Text style = {{ color: '#3F2058' }} >
                    Alterar funcionamento
                </Text>
            </TouchableOpacity>

        </View>
    )
}

AddressEdit = (props) => {
    const navigation = useNavigation();
    return (
        <View
            style = {{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#cecece',
                alignItems: 'center',
            }}
        >

            <Text
                style = {{
                    fontSize: 18,
                    fontWeight: 'bold',
                }}
            >
                Endereço
            </Text>
            
            <View style = {{marginVertical: 15, alignItems: 'center'}}>
                <Text>
                    {props.address.street}
                    , {props.address.number} 
                </Text>

                <Text>
                    {props.address.district}
                    , {props.address.city} - {props.address.uf}
                    
                </Text>

                <Text>

                    {props.address.zipcode}
                </Text>
            </View>

            <TouchableOpacity
                onPress = {() => navigation.navigate('address', {address: props.address})}
            >
                <Text style = {{ color: '#3F2058' }} >
                    Alterar endereço
                </Text>
            </TouchableOpacity>


        </View>
    )
}

const ProfileEditPage = ({ }) => {
    //const [profile, setProfile] = useState(null);
    const { profile, loadProfile } = useContext(ProfileUpdateContext);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        async function load(){
            await loadProfile();
        }
        load();
    }, []);


    return (
        <ScrollView
            contentContainerStyle = {{
                paddingHorizontal: 20,
                paddingTop: 10,
            }}
        >

            {profile ? (
            <>
            <Text
                style = {{
                    fontSize: 18,
                    fontWeight: 'bold'
                }}
            >
                Editar Perfil
            </Text>

            <AccountInfoEdit 
                profile = {profile}
            />

            <BasicInfoEdit
                profile = {profile} 
            />
            
            {authContext.user.type === 1 && 
                <>
                <OpeningPeriodEdit
                    period = {{
                        initialDay: {
                            id: profile.initialDay, 
                            label: Format.getWeekDay(profile.initialDay)
                        },

                        finalDay: {
                            id: profile.finalDay,
                            label: Format.getWeekDay(profile.finalDay)
                        },

                        initialHour: Format.formatTime(profile.initialHour),
                        finalHour: Format.formatTime(profile.finalHour)
                    }}
                    
                />

                <AddressEdit
                    address = {profile.address}
                />

                </>
            }
            
            {authContext.user.type !== 2 &&
                <>
                <GenreEdit 
                    list = {profile.genres}
                />

                <StuffEdit
                    type = {'equipamento'}
                    list = {profile.equipments} 
                />
                </>
            }

            {authContext.user.type === 0 &&
                <StuffEdit
                    type = {'instrumento'}
                    list = {profile.instruments} 
                />
            }
            

            <View 
                style = {{
                    alignSelf: 'center',
                    marginTop: 50,
                    marginBottom: 15
                }}
            >
                <TouchableOpacity
                    style = {styles.outlineButton}
                >
                    <Text style = {styles.outlineButtonLabel}>
                        Salvar alterações
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style = {{
                        ...styles.outlineButton,
                        borderColor: '#FD0505',
                        marginTop: 5
                    }}
                >
                    <Text
                        style = {{
                            fontSize: 15,
                            color: '#FD0505'
                        }}
                    >
                        Deletar perfil
                    </Text>
                </TouchableOpacity>
            </View>
            </>
            ):(
                <ActivityIndicator
                    size = 'large'
                    color = '#000' 
                />
            )}
        </ScrollView>
    );
}

export default ProfileEditPage;