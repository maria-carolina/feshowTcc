import React from 'react';
import {View, Text, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import { Formik } from 'formik';
import styles from '../../styles';


AccountInfoEdit = () => {
    return(
        <Formik
            initialValues = {{
                username: 'boogarins',
                email: 'boogarins@bol.com'
            }}
        >
            {({values, handleChange, handleSubmit}) => (
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
                        value = {values.username}
                        style = {{
                            ...styles.textInput,
                            width: '100%',
                            marginTop: 0
                        }}
                        onChangeText = {handleChange('username')}
                    />

                    <Text style = {styles.inputLabel}>
                        email
                    </Text>

                    <TextInput 
                        value = {values.email}
                        style = {{
                            ...styles.textInput,
                            width: '100%',
                            marginTop: 0
                        }}
                        onChangeText = {handleChange('email')}
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
            )}
        </Formik>
    )
}

BasicInfoEdit = () => {
    return (
        <Formik
            initialValues = {{
                name: 'boogarins',
                state: 'GO',
                city: 'Goiânia',
                members: '4',
                payment: '5.000,00',
                description: 'pipipopopopipop'
            }}
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
                        onChangeText = {handleChange('name')}
                    />

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
                                onChangeText = {handleChange('members')}
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
                                onChangeText = {handleChange('payment')}
                            />
                        </View>
                    </View>            
                    
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
                        onChangeText = {handleChange('description')}
                    />


                </View>
            )}

        </Formik>
    )
}

GenreEdit = () => {
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
                <Text>rock | </Text>
                <Text>indie</Text>
            </View>

            <TouchableOpacity>
                <Text style = {{ color: '#3F2058' }} >
                    Alterar generos
                </Text>
            </TouchableOpacity>
        </View>
    )
}

StuffEdit = (props) => {
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
                {props.type} 
            </Text>
            
            <View style = {{marginVertical: 15}}>
                {props.list.map(item => (
                    <Text style = {{textAlign: 'center'}}>{item.quantity} {item.name}</Text>
                ))}
            </View>

            
            <TouchableOpacity>
                <Text style = {{ color: '#3F2058' }} >
                    Alterar equipamentos
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const ProfileEditPage = () => {

    const equipmentList = [
        {
            quantity: 2,
            name : 'amplificadores'
        },
        {
            quantity: 2,
            name : 'monitores'
        },
        {
            quantity: 1,
            name : 'PA'
        },
    ]

    const instrumentList = [
        {
            quantity: 2,
            name : 'guitarras'
        },
        {
            quantity: 1,
            name : 'baixo'
        },
        {
            quantity: 1,
            name : 'bateria'
        },
    ]
    return (
        <ScrollView
            contentContainerStyle = {{
                paddingHorizontal: 20,
                paddingTop: 10,
            }}
        >
            <Text
                style = {{
                    fontSize: 18,
                    fontWeight: 'bold'
                }}
            >
                Editar Perfil
            </Text>

            <AccountInfoEdit />
            <BasicInfoEdit />
            <GenreEdit />

            <StuffEdit
                type = {'Instrumentos'}
                list = {instrumentList} 
            />

            <StuffEdit
                type = {'Equipamento'}
                list = {equipmentList} 
            />

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

        </ScrollView>
    );
}

export default ProfileEditPage;