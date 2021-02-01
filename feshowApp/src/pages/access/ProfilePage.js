import React, { Component, useContext } from 'react';
import {View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Dimensions} from 'react-native';
import styles from '../../styles';
import AuthContext from '../../contexts/auth';

const LogoutForTest = () => {
    const { signOut } = useContext(AuthContext)
    return(
        <TouchableOpacity 
            style = {styles.button}
            onPress = {() => signOut()}
        >
            <Text style = {styles.buttonLabel}> Sair </Text>
        </TouchableOpacity>
    )
}


const artistInvitationModal = () => {
    return;
}

const noticeModal = () => {
    return;
}

class ProfilePage extends Component{
    constructor(props){
        super(props)
        this.state = {
            profile: {
                id: 2,
                artistId: 1,
                image: null,
                type: 1,
                name: 'Metá Metá',
                members: 3,
                city: 'São Paulo',
                genres: ['mpb', 'samba', 'jazz'],
                description: "xxxxxxx",
            },
            isFirstTabSelected: true
        }
    }

    static contextType = AuthContext;

    componentDidMount(){}
    loadProfileData = () => {}

    openProfileEditPage = () => {}
    openCalendarPage = () => {}
    openHistoricPage = () => {}
    openChatPage = () => {}
    openRequestPage = () => {}
    openNoticeModal = () => {}
    deleteNotice = () => {}

    openInvitation = () => {
        this.props.navigation.navigate(
            'profilePageInvitation',
            {
                artist: this.state.profile
            }
        )
    }

    changeTab = () => {
        this.setState({
            isFirstTabSelected: !this.state.isFirstTabSelected
        })
    }
    
    render(){
        var { profile, isFirstTabSelected } = this.state;

        console.log(this.context.user.id);

        var profileImage = (
            <TouchableOpacity
                style = {{
                    width: '50%',
                    height: '45%',
                }}

                activeOpacity = { 
                    this.context.user.id === profile.id ?
                    0.2 : 1
                }
            >
                <Image
                    source = { 
                        profile.image === null ? 
                        require('../../assets/defaultProfileImage.jpeg'):{uri: this.profile.image}}
                    style = {{
                        width: '100%',
                        height: '100%', 
                        borderRadius: Dimensions.get('window').width / 2
                    }}
                    
                />

            </TouchableOpacity>
        );

        var genreList = "";

        for(var item of profile.genres){
            genreList += profile.genres.indexOf(item) == 0 ?
            item : ` | ${item}`
        }

        var firstButton;

        if(this.context.user.id === profile.id){
            firstButton = {
                label: 'Editar perfil'
            }
        }else if(profile.type === 1){
            firstButton = {
                label: 'Convidar para evento',
                handleClick: () => this.openInvitation()
            }
        }else if(profile.type === 2){
            firstButton = {
                label: 'Solicitar organização'
            }
        }else if(profile.type === 3){
            firstButton = {
                label: 'Abrir chat'
            }
        }
       
        return(
            <View style = {styles.container}>
                {(profile &&
                    <ScrollView
                        style = {{width: '100%', height: '100%'}}
                        contentContainerStyle = {{
                            ...styles.center,
                            justifyContent: 'flex-start',
                            padding: 10,
                        }}
                    >
                        <View
                            style = {{
                                ...styles.center,
                                width: '100%',
                                height: 375,
                            }}
                        >
                            {profileImage}

                            <Text style = {{
                                fontSize: 22,
                                fontWeight: 'bold'
                            }}>
                                {profile.name}
                            </Text>

                            {profile.type !== 3 &&
                                <Text style = {styles.profileHeadInfos}>
                                    {(
                                        profile.type == 1?
                                        `${profile.members} membros`: 
                                        `${profile.capacity} pessoas`
                                    )} 
                                </Text>
                            }

                            <Text style = {styles.profileHeadInfos}> 
                                {profile.city} 
                            </Text>

                            <Text
                                style = {styles.profileHeadInfos}
                            >
                                {genreList}
                            </Text>

                            
                            <TouchableOpacity
                                style = {{...styles.outlineButton, marginTop: 5}}
                                onPress = {firstButton.handleClick}
                            >
                                <Text
                                    style = {styles.outlineButtonLabel}
                                >
                                    {firstButton.label}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style = {{
                                    marginTop: 10
                                }}
                            >
                                <Text
                                    style = {styles.outlineButtonLabel}
                                >
                                    Ver agenda
                                </Text>
                            </TouchableOpacity>

                        </View>

                        <View
                            style = {{
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            <View
                                style = {styles.row}
                            >
                                <TouchableOpacity
                                    style = {
                                        isFirstTabSelected ?
                                        styles.selectedHalfRowTab: styles.halfRowTab
                                    }
                                    onPress = {() => this.changeTab()}
                                >
                                    <Text>Descrição</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style = {
                                        isFirstTabSelected ?
                                        styles.halfRowTab : styles.selectedHalfRowTab
                                    }
                                    onPress = {() => this.changeTab()}
                                >
                                    <Text>Histórico</Text>
                                </TouchableOpacity>

                            </View>

                        {isFirstTabSelected && (
                            <View style = {{marginTop: 15}}>
                                <Text>
                                    {
                                        profile.description !== null ?
                                        profile.description : 'Nenhuma descrição disponível' 
                                    }
                                </Text>
                            </View>
                        )}

                        {isFirstTabSelected && profile.type === 2 && (
                            <View style = {{marginTop: 15}}>
                                <Text
                                    style = {{
                                        ...styles.title,
                                        textAlign: 'left',
                                        fontSize: 16
                                    }}
                                >
                                    Endereço
                                </Text>
                                <Text>
                                    {`${profile.address.street}, `+ 
                                    `${profile.address.number} - ${profile.address.district}, `+ 
                                    `${profile.address.city} - ${profile.address.uf}`}
                                </Text>

                            </View>
                        )}
                            
                        </View>

                    </ScrollView>
                ) || 
                <ActivityIndicator
                    size = 'large'
                    color = '#000'
                />
            }
              
            </View>
            
        )
    }
}

export default ProfilePage;