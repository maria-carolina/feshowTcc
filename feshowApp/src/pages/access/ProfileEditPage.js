import React, { useEffect, useContext, useState } from 'react';
import {View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import Format from '../utils/Format';
import { useNavigation } from '@react-navigation/native';
import ProfileUpdateContext from '../../contexts/profileUpdate';
import {apiIbge} from '../../services/api';



AccountInfoEdit = (props) => {
    const { alterProfile } = useContext(ProfileUpdateContext);
    const navigation = useNavigation();
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
                    alterProfile('username', text.replace(/\s/g, ''))
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
                    alterProfile('email', text);
                }}
            />

            <TouchableOpacity
                style = {{
                    alignSelf: 'flex-end',
                    marginVertical: 15
                }}
                onPress = {() => navigation.navigate('emailInsert')}
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
    const [ufs, setUfs] = useState([]);
    const [selectedUf, setSelectedUf] = useState(props.profile.state); 
    const [selectedCity, setSelectedCity] = useState(); 

    const [cities, setCities] = useState([]);

    useEffect(() => {
        loadUfs();
        loadCities(selectedUf);
    }, [])

    const loadUfs = async () => {
        try{
            var result = await apiIbge.get();
        }catch(e){
            return;
        }

        setUfs(result.data);
    }


    const loadCities = async (uf) => {
        try{
            var result = await apiIbge.get(`/${uf}/municipios`);
        }catch(e){
            return;
        }

        setCities(result.data);
        const currentCity = result.data.filter(item => item.nome === props.profile.city)[0];
        setSelectedCity(currentCity ? currentCity.id : null)
    }

    const getCityName = (id) => {
        return cities.filter(item => item.id === id)[0].nome;
    }

    return (
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
                value = {props.profile.name}
                style = {{
                    ...styles.textInput,
                    width: '100%',
                    marginTop: 0
                }}
                onChangeText = {(text) => {
                    alterProfile('name', text)
                }}
            />

            {authContext.user.type !== 1 &&
                <View style = {{ flexDirection: 'row' }}>


                <View 
                    style = {{
                        width: '49%',
                        marginRight: '2%',
                    }}
                >
                    <Text style = {styles.inputLabel}>
                        estado
                    </Text>

                    <Picker
                        selectedValue={selectedUf}
                        style={{
                            ...styles.textInput,
                            width: '100%',
                            marginTop: 0,
                        }}
                        onValueChange = {(value) => {
                            setSelectedUf(value);
                            loadCities(value);
                            alterProfile('state', value)
                        }}
                    >
                        {ufs.map(item => (
                            <Picker.Item  
                                label = {item.nome} 
                                value = {item.sigla} 
                                key = {item.id}
                            />
                        ))}
                    </Picker>

                </View>

                <View style = {{ width: '49%' }}>
                    <Text style = {styles.inputLabel}>
                        cidade
                    </Text>

                    <Picker
                        selectedValue={selectedCity}
                        style={{
                            ...styles.textInput,
                            width: '100%',
                            marginTop: 0,
                        }}
                        onValueChange = {(value) => {
                            setSelectedCity(value);
                            alterProfile('city', getCityName(value));
                        }}
                    >
                        {cities.map(item => (
                            <Picker.Item  
                                label = {item.nome} 
                                value = {item.id} 
                                key = {item.id}
                            />
                        ))}
                    </Picker>
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
                            value = {props.profile.members.toString()}
                            style = {{
                                ...styles.textInput,
                                width: '100%',
                                marginTop: 0
                            }}
                            onChangeText = {(text) => {
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
                            value = {props.profile.cache.toString()}
                            style = {{
                                ...styles.textInput,
                                width: '100%',
                                marginTop: 0
                            }}
                            onChangeText = {(text) => {
                                alterProfile('cache', text)
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
                    value = {props.profile.capacity.toString()}
                    style = {{
                        ...styles.textInput,
                        width: '100%',
                        marginTop: 0
                    }}
                    onChangeText = {(text) => {
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
                value = {props.profile.description}
                style = {{
                    ...styles.textInput,
                    width: '100%',
                    height: 70,
                    marginTop: 0,
                    textAlignVertical: 'top'
                }}
                onChangeText = {(text) => {
                    alterProfile('description', text)
                }}
            />


        </View>
           
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
                    <Text 
                        style = {{textAlign: 'center'}}
                    >
                        {item.quantity} {item.name}
                    </Text>
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
    const { profile, loadProfile, saveUpdate } = useContext(ProfileUpdateContext);
    const authContext = useContext(AuthContext);
    const navigation = useNavigation();

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
                            id: profile.openinghours.initialDay, 
                            label: Format.getWeekDay(profile.openinghours.initialDay)
                        },

                        finalDay: {
                            id: profile.openinghours.finalDay,
                            label: Format.getWeekDay(profile.openinghours.finalDay)
                        },

                        initialHour: Format.formatTime(profile.openinghours.initialHour),
                        finalHour: Format.formatTime(profile.openinghours.finalHour)
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
                    onPress = {async () => {
                        await saveUpdate();
                        navigation.goBack();
                    }}
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