import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList, ScrollView, Image, ActivityIndicator, Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import PageBody from '../event/EventPageBody';
import ImageChangeModal from '../utils/ImageChange';
import InvitationModal from '../event/EventPageInvitation';
import SolicitationModal from '../event/SolicitationModal';
import PostModal from '../event/PostModal';


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

const TABS = [
    {id: 0, label:'Descrição', value: 'description'},
    {id: 1, label:'Line-up', value: 'lineup'},
    {id: 2, label:'Postagens', value: 'posts'},
    {id: 3, label:'Avisos', value: 'warnings'}, 
]

class EventPage extends Component{
    constructor(props){
        super(props) 
        this.reload;
        this.state = {
            selectedTab: TABS[0],
            currentAvatar: null,
            newAvatar: null
        }
    }

    static contextType = AuthContext;

    componentDidMount(){
        //this.loadEventData();
        this.reload = this.props.navigation.addListener('focus', () => {
            this.loadEventData();
        })
    }

    loadEventData = async () => {
        try{
            var result = await api.get(`/event/show/${this.props.route.params.id}`, {
                headers: {
                    Authorization: `Bearer ${this.context.token}`
                }
            });
            
            if(!('error' in result.data)){
                console.log(this.context.token)
                let splitted = result.data.start_date.split('-'); 
                result.data.start_date = `${splitted[2]}/${splitted[1]}/${splitted[0]}`;

                let newState = { 
                    event: result.data,
                    description: result.data.description,
                    selectedTab: TABS[0],
                    imageChangeVisible: false,
                    invitationVisible: false,
                    solicitationVisible: false,
                    postModalVisible: false,
                    currentAvatar: null,
                    lineup: undefined,
                    posts: undefined,
                    warnings: undefined,
                    postToEdit: undefined
                }

                if(result.data.image){
                    var imageBlob = await api.get(`/imageEvent/${result.data.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${this.context.token}`,
                        },
                        responseType: 'blob'
                    })
                    
                    var currentAvatar = await blobTo64data(imageBlob.data);
                    newState.currentAvatar = currentAvatar;
                }

                
                this.setState(newState)
            }

        }catch(e){
            console.log(e)
        }

    }

    loadLineUp = async () => {
        try{
            var result = await api.get(`event/showLineup/${this.state.event.id}`, 
            {headers: {
                Authorization: `Bearer ${this.context.token}`
            }});

            this.setState({
                lineup: result.data
            })
            
        }catch(e){
            console.log(e) 
        }
         
    
    }

    loadPosts = async () => {
        try{
            var result = await api.get(
                `event/showPosts/${this.state.event.id}`, 
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            );
        }catch(e){
            console.log(e)
        }
        
        this.setState({
            posts: result.data
        })

    }

    loadWarnings = async () => {
        try{
            var result = await api.get(
                `event/showEquipments/${this.state.event.id}`, 
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            ); 

            this.setState({
                warnings: result.data
            })

        }catch(e){
            console.log(e)
        }

       
    }

    changeTab = async (selectedTab) => {

        this.setState({
            selectedTab: selectedTab
        })


        if(this.state[selectedTab.value] === undefined){
            if(selectedTab.id == 0){
                await this.loadEventData(selectedTab);
            }else if(selectedTab.id == 1){
                await this.loadLineUp(selectedTab);
            }else if(selectedTab.id == 2){
                await this.loadPosts(selectedTab)
            }else{
                await this.loadWarnings(selectedTab);
            }
        }

    }

    saveImage = async () => {
        try{
            var formData = new FormData();
            formData.append('file', this.state.newAvatar);
            await api.post(`/event/storeImage/${this.state.event.id}`, 
                formData, 
                { 
                    headers: {
                        Authorization: `Bearer ${this.context.token}`, 
                        'Content-type': 'multipart/form-data', 
                        'Accept': 'application/json'
                    }
                }
            )

            this.setState({
                imageChangeVisible: false
            })

            this.loadEventData(TABS[0]);

        }catch(e){
            throw (e);
        }
    }

    removeImage = async () => { 
        try{
            await api.get(`/event/removeImage/${this.state.event.id}`, 
                { 
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            )

            this.loadEventData(TABS[0]);

        }catch(e){
            throw (e);
        }
    }

    openImagePicker = () => {
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

                this.setState({
                    imageChangeVisible: true,
                    currentAvatar: null,
                    newAvatar: avatar
                })
            })
    }

    openEventEditPage = () => {
        let event = this.state.event;
        this.props.navigation.navigate('newEventPage', 
        {event: event})
    }

    openLineUpEditPage = async () => {

        var limits;

        if(!('limits' in this.state)){
            try{
                var result = 
                await api.get(`/event/getDateTime/${this.state.event.id}`,
                    {headers: {
                        Authorization: `Bearer ${this.context.token}`,
                    }}
                )
            }catch(e){
                console.log(e)
            }

            if(!('error' in result.data)){
                limits = result.data;
            }else{
                Alert.alert('Ops', 'Ocorreu um erro, tente novamente.')
            }
        }else{
            limits = this.state.limits;
        }

        this.props.navigation.navigate('lineUpEditPage', 
            {
                eventId: this.state.event.id,
                lineup: this.state.lineup,
                limits: limits
            }
        )


    }

    openSolicitationModal = async () => {
        try{
            let limitsResult = await api.get(`/event/getDateTime/${this.state.event.id}`,
                {headers: {
                    Authorization: `Bearer ${this.context.token}`,
                }}
            )

            this.setState({
                solicitationVisible: true,
                limits: limitsResult.data, 
            })

        }catch(e){
            console.log(e);
        }
        
    }

    loadConfirmation = (label) => {
        Alert.alert(
            'Opa',
            `Realmente quer cancelar ${label}?`,
            [
                {
                    text: 'Sim',
                    onPress: () => this.removeAssociation(label)
                },
                {
                    text: 'Cancelar',
                    style: 'cancel'
                }
            ]
        )
    }

    removeAssociation = async (label) => {
        try{
            let result = await api.post(
                '/removeAssociation',
                {
                    artistId: this.context.user.artistId,
                    eventId: this.state.event.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                } 

            )

            if(result.data === 'ok'){
                Alert.alert('Pronto', `A ${label} foi cancelada.`);
                this.loadEventData();
            }
        }catch(e){
            Alert.alert('Ops', 'Ocorreu um erro.')
        }

    }

    openPostModal = () => {
        this.setState({
            postModalVisible: true
        })
    }

    editPost = (post) => {
        this.setState({
            postModalVisible: true,
            postToEdit: post
        })
    }

    deletePost = async (id) => {
        
        try{
            let result = await api.delete(
                `/deletePost/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            );
            
            if(result.data == 'ok'){
                Alert.alert('Pronto', 'Postagem excluída com sucesso');
                this.loadEventData();
            }else{
                Alert.alert('Ops', 'Ocorreu um erro.')
            }
        }catch(e){
            Alert.alert('Ops', 'Ocorreu um erro.')
        }
                
        
    }

    changeStatus = async () => {

        try{
            let result = await api.get(
                `/changeStatus/${this.state.event.id}`,
                {
                    headers:{
                        Authorization: `Bearer ${this.context.token}`
                    }
                }
            );

            if(!('error' in result.data)){
                let splitted = result.data.start_date.split('-'); 
                result.data.start_date = `${splitted[2]}/${splitted[1]}/${splitted[0]}`;
                this.setState({
                    event: result.data
                })
            }else{
                Alert.alert('Ops', result.data.error)
            }
        }catch(e){
            console.log(e)
        }
    }
    
    openInvitationModal = async () => {
        try{
            let suggestionsResult = await api.get(`/getSuggestions/${this.state.event.id}`, 
                {headers: {
                    Authorization: `Bearer ${this.context.token}`,
                }}
            )

            let limitsResult = await api.get(`/event/getDateTime/${this.state.event.id}`,
                {headers: {
                    Authorization: `Bearer ${this.context.token}`,
                }}
            )
            

            this.setState({
                suggestions: suggestionsResult.data,
                limits: limitsResult.data, 
                invitationVisible: true 
            })

        }catch(e){
            console.log(e);
        }
    }

    closeInvitationModal = () => {
        this.setState({
            invitationVisible: false
        })
    }

    closeSolicitationModal = () => {
        this.loadEventData();
    }

    closePostModal = () => {
        this.loadEventData();
    }


    render(){
        let mainButton;
        if('event' in this.state){  
            if(this.context.user.id !== this.state.event.organizer_id &&
                this.context.user.id !== this.state.event.venue.id &&
                this.state.event.status === 1){
                if(this.state.event.artistStatus === 0){
                    mainButton = (
                        <TouchableOpacity
                            onPress = {() => this.openSolicitationModal()}
                            style = {{
                                ...styles.outlineButton,
                                marginTop: 15
                            }}
                        >
                            <Text
                                style = {styles.outlineButtonLabel}
                            >
                                Solicitar participação
                            </Text>
                        </TouchableOpacity>
                    )
                }else if(this.state.event.artistStatus === 1){
                    mainButton = (
                        <TouchableOpacity
                            style = {{
                                ...styles.outlineButton,
                                marginTop: 15
                            }}
                        >
                            <Text
                                style = {styles.outlineButtonLabel}
                            >
                                Aceitar convite
                            </Text>
                        </TouchableOpacity>
                    )
                }else if(this.state.event.artistStatus === 2){
                    mainButton = (
                        <TouchableOpacity
                            onPress = {() => this.loadConfirmation('sua solicitação')}
                            style = {{
                                ...styles.outlineButton,
                                marginTop: 15
                            }}
                        >
                            <Text
                                style = {styles.outlineButtonLabel}
                            >
                                Cancelar solicitação
                            </Text>
                        </TouchableOpacity>
                    )
                }else{
                    mainButton = (
                        <TouchableOpacity
                            onPress = {() => this.loadConfirmation('sua participação')}
                            style = {{
                                ...styles.outlineButton,
                                marginTop: 15
                            }}
                        >
                            <Text
                                style = {styles.outlineButtonLabel}
                            >
                                Sair do evento
                            </Text>
                        </TouchableOpacity>
                    )
                }
            }else if(this.context.user.id == this.state.event.organizer_id){
                mainButton = (
                    <TouchableOpacity
                        onPress = {() => this.changeStatus()}
                        style = {{
                            ...styles.outlineButton,
                            marginTop: 15
                        }}
                    >
                        <Text
                            style = {styles.outlineButtonLabel}
                        >
                            {`${this.state.event.status == 0 ? 'Abrir' : 'Fechar'} evento`}
                        </Text>
                    </TouchableOpacity>
                )
                
            }
        }
        return(
            <View style = {styles.container}>
                {('event' in this.state && 
                <ScrollView 
                    contentContainerStyle = {{
                        ...styles.center, 
                        justifyContent: 'flex-start'
                    }}
                >
                    <View style = {styles.row}>
                        {(this.state.currentAvatar == null &&
                        <TouchableOpacity
                            style = {{
                                width: '37%',
                                height: 200,
                                backgroundColor: '#D8D8D8',
                                marginRight: 30,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress = {() => {
                                 this.openImagePicker();
                            }}
                        >
                            <Text>Adicionar flyer</Text>
                        </TouchableOpacity>
                        ) ||
                        <View
                            style = {{
                                width: '37%',
                                height: 175,
                                marginRight: 10
                            }}
                        > 
                            <TouchableOpacity
                                onPress = {() => {
                                    this.setState({
                                        imageChangeVisible: true
                                    })
                                }}
                            >
                                <Image
                                    source = {{uri: this.state.currentAvatar}}
                                    style = {{
                                        width: '100%',
                                        height: '100%', 
                                    }}
                                    
                                />
                            </TouchableOpacity>

                        </View>
                        }

                        <View
                            style ={{
                                width: '45%'
                            }}
                        >
                            
                            <Text 
                                style = {{
                                    ...styles.title,
                                    textAlign: 'left',
                                    marginBottom: 0 
                                }}>
                                    {'event' in this.state && this.state.event.name}
                            </Text>

                            <Text 
                                style = {{
                                    fontSize: 16, 
                                    marginBottom: 10
                                }}
                            >
                                @ {this.state.event.venue.name}
                            </Text>
                            
                            <View>
                                <Text>{this.state.event.start_date}</Text>
                                <Text>das {this.state.event.start_time} às {this.state.event.end_time}</Text>
                            </View>

                            {this.state.event.organizer_id === this.context.user.id &&
                                <TouchableOpacity
                                    onPress = {() => {
                                        this.openEventEditPage();
                                    }}
                                    style = {{alignSelf: 'center', marginTop: 15}}
                                >
                                    <Text 
                                        style = {{
                                            color: '#3F2058', 
                                            fontWeight: 'bold'
                                        }
                                    }>
                                        Editar evento
                                    </Text>
                                </TouchableOpacity>
                            }
                            
                            {(this.context.user.type !== 1 || 
                            this.context.user.id == this.state.event.organizer_id) 
                            && mainButton}            

                        </View> 
                    </View>

                    <FlatList
                        style = {{
                            borderBottomWidth: .5, 
                            width: '100%', 
                            flexGrow: 0,
                            marginTop: 15,
                            marginBottom: 10
                        }}
                        contentContainerStyle = {{justifyContent: 'center', width: '100%'}}
                        data = {TABS}
                        renderItem = {({item}) => (
                            <TouchableOpacity
                                style = {
                                    item.id == this.state.selectedTab.id ? 
                                    {
                                        ...styles.rowTab, 
                                        borderBottomWidth: 2,
                                        borderBottomColor: '#3F2058',
                                    }
                                    :
                                    styles.rowTab
                                }
                                onPress = {() => this.changeTab(item)}
                            >
                                <Text style = {styles.purpleText}>{item.label}</Text>
                            </TouchableOpacity>
                            
                        )}
                        horizontal = {true}
                        keyExtractor = {(item, index) => index.toString()} 
                    />


                    {
                        (  
                            this.state[this.state.selectedTab.value] !== undefined &&
                            <PageBody
                                loaded = {this.state[this.state.selectedTab.value]}
                                loggedUserId = {this.context.user.id} 
                                selectedTab = {this.state.selectedTab.id}
                                openInvitation = {() => this.openInvitationModal()}
                                openLineUpEdit = {() => this.openLineUpEditPage()}
                                openPostModal = {() => this.openPostModal()}
                                editPost = {this.editPost}
                                deletePost = {this.deletePost}
                                isRelatedToEvent = {this.state.event.artistStatus === 3}
                                isOrganizer = {this.context.user.id === this.state.event.organizer_id}
                            />
                        ) || 
                        <ActivityIndicator
                            size = 'large'
                            color = '#000'
                        />
                    }
 
                    <ImageChangeModal
                        visible = {this.state.imageChangeVisible}

                        source = {  
                            this.state.currentAvatar != null ? 
                            {uri: this.state.currentAvatar} : this.state.newAvatar
                        }

                        newAvatar = {this.state.currentAvatar == null}

                        firstButtonHandleClick = {
                            this.state.currentAvatar != null ?
                            () => this.openImagePicker() : () => this.saveImage() 
                        }

                        secondButtonHandleClick = {
                            this.state.currentAvatar != null  ?
                            () => this.removeImage() : 
                            () => {
                                this.setState({
                                    imageChangeVisible: false
                                })
                                this.loadEventData(TABS[1]);
                            }
                        }

                        closeModal = {
                            () => {
                                this.setState({
                                    imageChangeVisible: false
                                })
                                this.loadEventData(TABS[1]);
                            }
                        }
                    />

                    <InvitationModal
                        visible = {this.state.invitationVisible} 
                        suggestions = {this.state.suggestions}
                        limits = {this.state.limits}
                        event = {this.state.event}
                        token = {this.context.token}
                        closeModal = {() => this.closeInvitationModal()}         
                    />

                    <SolicitationModal
                        visible = {this.state.solicitationVisible}
                        limits = {this.state.limits}
                        eventId = {this.state.event.id}
                        token = {this.context.token}
                        closeModal = {() => this.closeSolicitationModal()} 
                    />

                    <PostModal 
                        visible = {this.state.postModalVisible}
                        eventId = {this.state.event.id}
                        token = {this.context.token}
                        post = {this.state.postToEdit}
                        closeModal = {() => this.closePostModal()} 
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
}


export default EventPage;