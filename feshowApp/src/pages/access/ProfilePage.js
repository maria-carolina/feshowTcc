import React, { Component, useContext } from 'react';
import {View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Dimensions, Alert} from 'react-native';
import styles from '../../styles';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';


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

const HistoricPreviewItem = (props) => {
    let splitted = props.item.start_date.split('-');
    let formattedDate = `${splitted[2]}/${splitted[1]}`
    return (
        <View
            style = {{
                padding: 15,
                borderBottomWidth: .5,
                borderBottomColor: '#cecece',
                flexDirection: 'row',
                alignSelf: 'flex-start'
            }}
        >
            <Text
                style = {{
                    color: '#3f2058',
                    fontWeight: 'bold'
                }}
            > 
            {formattedDate} 
            </Text>
            <Text> - </Text>

            <TouchableOpacity
                onPress = {props.handleEventClick}
            >
                <Text
                    style = {{
                        fontWeight: 'bold'
                    }}
                >
                    {props.item.name} 
                </Text>
            </TouchableOpacity>

            <Text> @ </Text>

            <TouchableOpacity
                onPress = {props.handleVenueClick}
            >
                <Text
                    style = {{
                        fontWeight: 'bold'
                    }}
                >
                    {props.item.venue.name}
                </Text>
            </TouchableOpacity>
        </View>
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
        this.focus;
        this.state = {
            isFirstTabSelected: true
        }
    }

    static contextType = AuthContext;

    componentDidMount(){
        let id = this.props.route.params ? this.props.route.params.id : this.context.user.id
        this.focus = this.props.navigation.addListener('focus', () => {
            console.log('oi');
            this.loadProfileData(id);
        })
    }

    loadProfileData = async (id) => {

        this.setState({
            profile: undefined,
            historicPreview: undefined
        })

        let config = {
            headers: {
                Authorization: `Bearer ${this.context.token}`
            }
        }
        try{
            let result = await api.get(
                `/showUser/${id}`,
                config
            );

            if(!('error' in result.data)){
                if(result.data.imageStatus){
                    let imageResult = await api.get(
                        `/getUserImage/${id}`,
                        config
                    )

                    if(!('error' in imageResult.data)){
                        result.data.image = imageResult.data;
                    }else{
                        Alert.alert('Ops', result.data.error);
                    }
                }else{
                    result.data.image = null;
                }


                this.setState({
                    profile: result.data
                })
                
            }else{
                Alert.alert('Ops', result.data.error)
            }


        }catch(e){
            console.log(e)
        }
    }

    loadHistoricPreview = async () => {
        try{
            let result = await api.get(
                `previewPastEvents/2`,
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            )

            if(!('error' in result.data)){
                this.setState({
                    historicPreview: result.data
                })
            }else{
                Alert.alert('Ops', result.data.error)
            }

        }catch(e){
            console.log(e)
        }
    }

    openProfileEditPage = () => {
        this.props.navigation.navigate('profileUpdate')
    }

    openCalendarPage = (id) => {
        this.props.navigation.navigate('calendarPage', {id})
    }

    openHistoricPage = () => {}
    openChatPage = () => {}

    openRequestPage = () => {
        this.props.navigation.navigate(
            'requestPage',
            {
                venue: this.state.profile
            }
        )
    }

    openNoticeModal = () => {}
    deleteNotice = () => {}

    openInvitationPage = () => {
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

        if(!this.state.historicPreview){
            this.loadHistoricPreview();
        }
    }

    handleLinkClick = (isAProfilePage, id) => {
        if(isAProfilePage){
            this.setState({
                isFirstTabSelected: true,
                profile: undefined,
                historicPreview: undefined
            })

            this.props.navigation.navigate('profilePage', { id });
        }else{
            this.props.navigation.navigate('eventPage', { id });
        }
    }
    
    render(){
        var { profile, isFirstTabSelected, historicPreview } = this.state;

        if(profile){
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
                            require('../../assets/defaultProfileImage.jpeg'):{uri: this.state.profile.image}}
                        style = {{
                            width: '100%',
                            height: '100%', 
                            borderRadius: Dimensions.get('window').width / 2
                        }}
                        
                    />

                </TouchableOpacity>
            );

            if(profile.type !== 2){
                var genreList = "";

                for(var item of profile.genres){
                    genreList += profile.genres.indexOf(item) == 0 ?
                    item.name : ` | ${item.name}`
                }
            }

            var firstButton;

            if(this.context.user.id === profile.id){
                firstButton = {
                    label: 'Editar perfil',
                    handleClick: () => this.openProfileEditPage()
                }
            }else if(profile.type === 0){
                firstButton = {
                    label: 'Convidar para evento',
                    handleClick: () => this.openInvitationPage()
                }
            }else if(profile.type === 1){
                firstButton = {
                    label: 'Marcar show',
                    handleClick: () => this.openRequestPage()
                }
            }else if(profile.type === 2){
                firstButton = {
                    label: 'Abrir chat'
                }
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

                            {profile.type !== 2 &&
                                <Text style = {styles.profileHeadInfos}>
                                    {(
                                        profile.type == 0 ?
                                        `${profile.members} membros`: 
                                        `${profile.capacity} pessoas`
                                    )} 
                                </Text>
                            }

                            <Text style = {styles.profileHeadInfos}> 
                                {(profile.city||profile.address.city)} 
                            </Text>

                            <Text
                                style = {styles.profileHeadInfos}
                            >
                                {genreList}
                            </Text>

                            
                            <TouchableOpacity
                                style = {{...styles.outlineButton, marginTop: 3}}
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
                                onPress = {() => this.openCalendarPage(profile.id)}
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

                        {isFirstTabSelected && profile.type === 1 && (
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

                        {!isFirstTabSelected && 
                        (
                            (historicPreview &&
                                <View style = {styles.center}>
                                {historicPreview.map(item => {
                                    return (
                                        <HistoricPreviewItem 
                                            item = {item}
                                            handleVenueClick = {() => 
                                                this.handleLinkClick(true, item.venue.userId)
                                            }
                                            handleEventClick = {() => 
                                                this.handleLinkClick(false, item.id)
                                            }
                                        />
                                    )
                                })}

                                <TouchableOpacity
                                    style = {styles.button}
                                    onPress = {() => 
                                        this.props.navigation.navigate('historicPage', 
                                        {
                                            id: profile.id, 
                                            name: profile.name,
                                            type: profile.type
                                        })
                                    }
                                >
                                    <Text
                                        style = {styles.buttonLabel}
                                    >
                                        Ver mais
                                    </Text>
                                </TouchableOpacity>
                                </View> 
                            ) || 
                            <ActivityIndicator
                                size = 'large'
                                color = '#000'
                            />
                        )
                        }
                            
                        </View>

                    </ScrollView>
                ) || 
                <ActivityIndicator
                    size = 'large'
                    color = '#000'
                />
            }
            <LogoutForTest />
            </View>
            
        )
    }
}

export default ProfilePage;