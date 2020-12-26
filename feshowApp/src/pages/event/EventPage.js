import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList, ScrollView, Modal, Image, Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import styles from '../../styles';
import api from '../../services/api';
import AuthContext from '../../contexts/auth';
import PageBody from '../event/EventPageBody';
import ImageChangeModal from '../utils/ImageChange';


const invitationModal = () => {
    loadSuggestions = () => {}
    search = () => {}
    sendInvitation = () => {}
    finish = () => {}

}

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
    {id: 0, label:'Line-up', value: 'lineup'},
    {id: 1, label:'Descrição', value: 'description'},
    {id: 2, label:'Postagens', value: 'posts'},
    {id: 3, label:'Avisos', value: 'warnings'}, 
]

class EventPage extends Component{
    constructor(props){
        super(props) 
        this.state = {
            selectedTab: TABS[1],
            currentAvatar: null,
            newAvatar: null
        }
    }

    static contextType = AuthContext;

    componentDidMount(){
        this.loadEventData(TABS[1]);
    }

    loadEventData = async (selectedTab) => {
        try{
            var result = await api.get('/event/show/2', {
                headers: {
                    Authorization: `Bearer ${this.context.token}`
                }
            });
            
            let splitted = result.data.start_date.split('-'); 
            result.data.start_date = `${splitted[2]}/${splitted[1]}/${splitted[0]}`;

            splitted = result.data.end_date.split('-');
            result.data.end_date = `${splitted[2]}/${splitted[1]}/${splitted[0]}`;

           
            let newState = { 
                event: result.data,
                description: result.data.description,
                selectedTab: selectedTab,
                imageChangeVisible: false,
                currentAvatar: null
            }
            
            var imageBlob = await api.get(`/imageEvent/${result.data.id}`,
            {
                headers: {
                    Authorization: `Bearer ${this.context.token}`,
                },
                responseType: 'blob'
            })
            
            if((imageBlob.data._data.size != 35)){
                console.log('entrou aqui p')
                var currentAvatar = await blobTo64data(imageBlob.data);
                newState.currentAvatar = currentAvatar;
            }
            
            this.setState(newState)

        }catch(e){
            throw e
        }

    }

    loadLineUp = async (selectedTab) => {
        try{
            console.log(this.context.token)
            var result = await api.get('event/showLineup/2', {headers: {
                Authorization: `Bearer ${this.context.token}`
            }});

            this.setState({
                lineup: result.data,
                selectedTab: selectedTab
            })
        }catch(e){
            console.log(e) 
        }

        
    }

    loadPosts = async (selectedTab) => {
        try{
            var result = await api.get('event/showPosts/2', {headers: {
                Authorization: `Bearer ${this.context.token}`
            }});
        }catch(e){
            console.log(e)
        }

        this.setState({
            posts: result.data,
            selectedTab: selectedTab 
        })

    }

    loadWarnings = async (selectedTab) => {
        try{
            var result = await api.get('event/showEquipments/2', {headers: {
                Authorization: `Bearer ${this.context.token}`
            }}); 


            this.setState({
                warnings: result.data,
                selectedTab: selectedTab
            })
        }catch(e){
            console.log(e)
        }

       
    }

    changeTab = async (selectedTab) => {
       
        if(!(selectedTab.value in this.state)){
            console.log(selectedTab.id)
            if(selectedTab.id == 0){
                console.log('entrou')
                await this.loadLineUp(selectedTab);
            }else if(selectedTab.id == 1){
                await this.loadEventData(selectedTab);
            }else if(selectedTab.id == 2){
                await this.loadPosts(selectedTab)
            }else{
                this.loadWarnings(selectedTab);
            }
        }else{
            this.setState({
                selectedTab: selectedTab
            })
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

            this.loadEventData(TABS[1]);

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

            this.loadEventData(TABS[1]);

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
        this.props.navigation.navigate('newEventPage', {event: event})
    }

    sendSolicitation = () => {}

    cancelParticipation = () => {}

    openPostModal = () => {}

    deletePost = () => {}

    confirmPostDelete = () => {}

    changeStatus = () => {}
    
    openInvitationModal = () => {}

    render(){
        return(
            <View style = {styles.container}>
                {('event' in this.state && 
                <ScrollView contentContainerStyle = {
                    {...styles.center, 
                    justifyContent: 'flex-start'}
                }>
                    <View style = {styles.row}>
                        {(this.state.currentAvatar == null &&
                        <TouchableOpacity
                            style = {{
                                width: '37%',
                                height: 175,
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

                        <View>

                            <Text style = {{
                                ...styles.title,
                                textAlign: 'left',
                                marginBottom: 0 }}>
                                    {'event' in this.state && this.state.event.name}
                            </Text>

                            <TouchableOpacity
                                onPress = {() => {
                                    this.openEventEditPage();
                                }}
                            >
                                <Text>Editar</Text>
                            </TouchableOpacity>

                            <Text 
                                style = {{
                                    fontSize: 16, 
                                    marginBottom: 10
                                }}
                            >
                                @ {this.state.event.venue.name}
                            </Text>
                            {('end_date' in this.state.event &&
                            <View>
                                <Text>de {this.state.event.start_date} às {this.state.event.start_time}</Text>
                                <Text>até {this.state.event.end_date} às {this.state.event.end_time}</Text>
                            </View>
                            ) ||
                            <View>
                                <Text>{this.state.event.start_date}</Text>
                                <Text>das {this.state.event.start_time} às {this.state.event.end_time}</Text>
                            </View>
                            }

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

                    <PageBody
                        loaded = {this.state[this.state.selectedTab.value]} 
                        selectedTab = {this.state.selectedTab.id}
                    />
                    {console.log('currentAvatar' in this.state)}
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

                </ScrollView>
                )}
            </View>
        )
    }
}

export default EventPage;