import React, { Component, useContext, useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Dimensions, Alert} from 'react-native';
import styles from '../../styles';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';
import ImageChangeModal from '../utils/ImageChange';
import ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';



function blobTo64data(imageBlob) {
    return new Promise((resolve) => {
        const fileReader = new FileReader();

        var base64data;

        fileReader.readAsDataURL(imageBlob);
        
        fileReader.onload = () => {
            base64data = fileReader.result;
            resolve(base64data);
        }
    }) 
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
                alignSelf: 'flex-start',
                width: '100%'
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



const ProfilePage = (props) => {
    
    const [isFirstTabSelected, setIsFirstTabSelected] = useState(true);
    const [profile, setProfile] = useState(null);
    const [historicPreview, setHistoricPreview] = useState(null);
    const [isImageChangeVisible, setImageChangeVisible] = useState(false);
    const [newAvatar, setNewAvatar] = useState(null);


    const authContext = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            let id = props.route.params ? props.route.params.id : authContext.user.id;
            loadProfileData(id);
        })

        return unsubscribe;
        
    }, [])

    const loadProfileData = async (id) => {

        setProfile(null);
        setHistoricPreview(null)

        const config = {
            headers: {
                Authorization: `Bearer ${authContext.token}`
            }
        }
        try{
            let result = await api.get(
                `/showUser/${id}`,
                config
            );

            if(!('error' in result.data)){
                if(result.data.imageStatus){
                    let imageBlob = await api.get(
                        `/getUserImage/${id}`,
                        {...config, responseType: 'blob'},
                    )

                    result.data.image = await blobTo64data(imageBlob.data);
                }else{
                    result.data.image = null;
                }


                setProfile(result.data)
                
            }else{
                Alert.alert('Ops', result.data.error)
            }


        }catch(e){
            console.log(e)
        }
    }

    const loadHistoricPreview = async () => {
        try{
            let result = await api.get(
                `previewPastEvents/${authContext.user.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authContext.token}`
                    }
                }
            )

            if(!('error' in result.data)){
               setHistoricPreview(result.data)
            }else{
                Alert.alert('Ops', result.data.error)
            }

        }catch(e){
            console.log(e)
        }
    }

    const openProfileEditPage = () => {
        navigation.navigate('profileUpdate')
    }

    const openCalendarPage = (id) => {
        navigation.navigate('calendarPage', {id})
    }

    const openRequestPage = () => {
        navigation.navigate(
            'requestPage',
            {
                venue: profile
            }
        )
    }

    const openInvitationPage = () => {
        navigation.navigate(
            'profilePageInvitation',
            {
                artist: profile
            }
        )
    }

    const changeTab = () => {
        setIsFirstTabSelected(!isFirstTabSelected);

        if(!historicPreview){
            loadHistoricPreview();
        }
    }

    const handleLinkClick = (isAProfilePage, id) => {

        if(isAProfilePage){
            setIsFirstTabSelected(true);
            setProfile(null);
            setHistoricPreview(null)

            navigation.navigate('profilePage', { id });
        }else{
            navigation.navigate('eventPage', { id });
        }

    }

    const pickImage = () => {
        ImagePicker.showImagePicker({
            title: 'Selecione uma imagem',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }},
            (response) => {
                if (response.didCancel) return;
                if (response.error) return;

                const avatar = {
                    uri: response.uri,
                    name: response.fileName,
                    type: response.type
                }

                setNewAvatar(avatar);
                setImageChangeVisible(true);
            })
    }

    const saveImage = async () => {
        try{
            var formData = new FormData();
            formData.append('file', newAvatar);
            await api.post(`/storeImage/`, 
                formData, 
                { 
                    headers: {
                        Authorization: `Bearer ${authContext.token}`, 
                        'Content-type': 'multipart/form-data', 
                        'Accept': 'application/json'
                    }
                }
            )

            setImageChangeVisible(false);
            setNewAvatar(null);
            loadProfileData(authContext.user.id);

        }catch(e){
            throw (e);
        }
    }

    const removeImage = async () => { 
        try{
            await api.delete(`/deleteUserImage/`, 
                { 
                    headers: {
                        Authorization: `Bearer ${authContext.token}`
                    }
                }
            )
            setImageChangeVisible(false);
            loadProfileData(authContext.user.id)

        }catch(e){
            throw (e);
        }
    }
    

    if(profile){
        var profileImage = (
            <TouchableOpacity
                style = {{
                    width: '50%',
                    height: '45%',
                }}

                activeOpacity = { 
                    authContext.user.id === profile.id ?
                    0.2 : 1
                }

                onPress = {authContext.user.id === profile.id ? 
                    () => {
                        if(profile.image === null){
                            pickImage();
                        }else{
                            setImageChangeVisible(true);
                        }
                    }: null
                }
            >
                <Image
                    source = { 
                        profile.image === null ? 
                        require('../../assets/defaultProfileImage.jpeg'):
                        {uri: profile.image}}
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

        if(authContext.user.id === profile.id){
            firstButton = {
                label: 'Editar perfil',
                handleClick: () => openProfileEditPage()
            }
        }else if(profile.type === 0){
            firstButton = {
                label: 'Convidar para evento',
                handleClick: () => openInvitationPage()
            }
        }else if(profile.type === 1){
            firstButton = {
                label: 'Marcar show',
                handleClick: () => openRequestPage()
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
                                    `${profile.members} membro(s)`: 
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
                            onPress = {() => openCalendarPage(profile.id)}
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
                                onPress = {changeTab}
                            >
                                <Text>Descrição</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style = {
                                    isFirstTabSelected ?
                                    styles.halfRowTab : styles.selectedHalfRowTab
                                }
                                onPress = {changeTab}
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
                                            handleLinkClick(true, item.venue.userId)
                                        }
                                        handleEventClick = {() => 
                                            handleLinkClick(false, item.id)
                                        }
                                    />
                                )
                            })} 


                            {historicPreview.length > 0 ?
                                <TouchableOpacity
                                    style = {{...styles.outlineButton, marginVertical: 15}}
                                    onPress = {() => 
                                        navigation.navigate('historicPage', 
                                        {
                                            id: profile.id, 
                                            name: profile.name,
                                            type: profile.type
                                        })
                                    }
                                >
                                    <Text
                                        style = {styles.outlineButtonLabel}
                                    >
                                        Ver mais
                                    </Text>
                                </TouchableOpacity>
                            : <Text style = {{alignSelf: 'flex-start', marginVertical: 15}}>
                                Nenhum evento passado.
                            </Text>}
                            </View> 
                        ) || 
                        <ActivityIndicator
                            size = 'large'
                            color = '#000'
                        />
                    )
                    }
                        
                    </View>

                    <ImageChangeModal
                        visible = {isImageChangeVisible}
                        source = {newAvatar ? newAvatar : {uri: profile.image}}
                        hasANewAvatar = {!!newAvatar}
                        firstButtonHandleClick = {
                            newAvatar ?
                            () => saveImage() : () => pickImage() 
                        }
                        secondButtonHandleClick = {
                            newAvatar ?
                            () => {
                                setImageChangeVisible(false);
                                loadProfileData(authContext.user.id);
                            }:
                            () => removeImage() 
                        }

                        closeModal = {
                            () => {
                                setImageChangeVisible(false);
                                loadProfileData(authContext.user.id);
                            }
                        }
                    />

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

export default ProfilePage;