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
            imageChangeVisible: false,
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
            
            var imageBlob = await api.get(`/imageEvent/${result.data.id}`,
            {
                headers: {
                    Authorization: `Bearer ${this.context.token}`,
                },
                responseType: 'blob'
            })
            
            var currentAvatar = await blobTo64data(imageBlob.data);

            this.setState({ 
                event: result.data,
                description: result.data.description,
                selectedTab: selectedTab,
                currentAvatar: currentAvatar
            })

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
                    newAvatar: avatar
                })
            })
    }


    openEventEditPage = () => {}

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
                        {(this.state.event.image == null &&
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
                                    this.openImagePicker();
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

                            <TouchableOpacity
                                style = {{
                                    marginTop: 3,
                                    marginBottom: 5,
                                    alignSelf: 'center'
                                }}
                                onPress = {() => {
                                    this.removeImage();
                                }}
                            >
                                <Text>Remover flyer</Text>
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

                            <Text style = {{fontSize: 16, marginBottom: 10}}>@ Bar do zé</Text>
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

                    <ImageChangeModal
                        visible = {this.state.imageChangeVisible} 
                        source = {this.state.newAvatar}
                        saveImage = {() => this.saveImage()}
                        closeModal = {() => {
                            this.setState({
                                avatar: null,
                                imageChangeVisible: false
                            })
                        }}
                    />

                </ScrollView>
                )}
            </View>
        )
    }
}

export default EventPage;