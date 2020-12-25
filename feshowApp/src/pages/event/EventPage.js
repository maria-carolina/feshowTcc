import React, { Component } from 'react';
import {View, Text, TouchableOpacity, FlatList, ScrollView, Modal, Image, Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import styles from '../../styles';
import api from '../../services/api';
import path from 'path';
import AuthContext from '../../contexts/auth';


const invitationModal = () => {
    loadSuggestions = () => {}
    search = () => {}
    sendInvitation = () => {}
    finish = () => {}

}

const ImageChangeModal = (props) => {
    return(
        <Modal
            visible = {props.visible}
            transparent = {true}
            animationType = 'fade'
            onRequestClose = {props.closeModal}
        >
            <View style = {styles.container}>
                    <Text style = {{...styles.title, marginBottom: 10}}>Novo Flyer</Text>

                    <Image 
                        source = {props.source}
                        style = {{
                            width: '80%',
                            height: '70%',
                        }}
                    />

                    <TouchableOpacity 
                        style = {{
                            ...styles.button, 
                            marginTop: 10, 
                            marginBottom: 5
                        }}
                        onPress = {props.saveImage}
                    >
                        <Text style = {styles.buttonLabel}>Salvar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style = {{
                            ...styles.button, 
                            marginTop: 5
                        }}
                        onPress = {props.closeModal}
                    >
                        <Text style = {styles.buttonLabel}>Cancelar</Text>
                    </TouchableOpacity>
            </View>

        </Modal>
    )
}

const PageBody = (props) => {
    if(props.selectedTab == 1){
        return (
            <View style = {{width: '90%'}}>
                <Text style = {{...styles.title, textAlign: 'left'}}>Sobre o evento...</Text>
                <Text>{props.loaded}</Text>
            </View>
        )
    }

    var list = props.loaded.map((item) => {
        if(props.selectedTab == 0){ 
            return (
                <View 
                    style = {{...styles.row, 
                        borderBottomWidth: .5,
                        padding: 20,
                        position: 'relative'
                    }}
                    key = {props.loaded.indexOf(item)}
                >
                    <Text style = {{color: '#000'}}>{item.artists.name}</Text>
                    <Text style = {{
                        right: 50,
                        position: 'absolute'
                    }}>
                        {item.start_time} 
                    </Text>
                </View>
            )
        }else if(props.selectedTab == 2){
            return(
                <View 
                    style = {{ 
                        borderBottomWidth: .5,
                        padding: 10,
                        position: 'relative'
                    }}
                    key = {props.loaded.indexOf(item)}
                >
                    <Text 
                        style = {{
                            fontWeight: 'bold', 
                            color: '#3F2058'
                        }}>
                        {item.name}
                    </Text>
                    <Text>
                        {item.post}
                    </Text>
                </View>
            )
        }else{
            var equipment = item.quantity > 1 ? 
            (item.equipment.charAt(item.equipment.length - 1) === 'r' ? 
            `${item.equipment}es`: `${item.equipment}s`)
            : item.equipment;

            return(
                
                <View
                    style = {{
                        borderBottomWidth: .5,
                        padding: 20,
                    }}
                    key = {props.loaded.indexOf(item)}
                >
                    <Text>{`É necessário arrumar ${item.quantity} ${equipment} para ${item.name}`}</Text>
                </View>
            )
        }
    })

    return (
        <View style = {{width: '90%'}}>
            {props.selectedTab == 2 && 
                <TouchableOpacity
                    style = {{...styles.textInput,
                        padding: 10,
                        width: '100%',
                        marginTop: 5
                    }}
                >
                    <Text
                        style = {{color: '#8E8E8E'}} 
                    >Insira um comentário...</Text>
                </TouchableOpacity>
            }

            {list}
        </View>
    );
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
            var result = await api.get('/event/show/2', {headers: {
                Authorization: `Bearer ${this.context.token}`
            }});

            let splitted = result.data.start_date.split('-'); 
            result.data.start_date = `${splitted[2]}/${splitted[1]}/${splitted[0]}`;
            splitted = result.data.end_date.split('-');
            result.data.end_date = `${splitted[2]}/${splitted[1]}/${splitted[0]}`;

            

            this.setState({
                event: result.data,
                description: result.data.description,
                selectedTab: selectedTab,
            })
        }catch(e){
            console.log(e)
        }

        
    }

    loadLineUp = async (selectedTab) => {
        try{
            var result = await api.get('event/showLineup/2', {headers: {
                Authorization: `Bearer ${this.context.token}`
            }});
        }catch(e){
            console.log(e)
        }

        this.setState({
            lineup: result.data,
            selectedTab: selectedTab
        })
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
        }catch(e){
            console.log(e)
        }

        this.setState({
            warnings: result.data,
            selectedTab: selectedTab
        })
    }

    changeTab = async (selectedTab) => {
       
        if(!(selectedTab.value in this.state)){
            if(selectedTab.id == 0){
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
        }catch(e){
            throw (e);
        }
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
                            onPress = {() => ImagePicker.showImagePicker({
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
                                } 
                            )}
                        >
                            <Text>Adicionar flyer</Text>
                        </TouchableOpacity>
                        ) || 
                        <Image
                            source = {{uri: `http://192.168.1.33:3001/uploads/events/${this.state.event.image}`}}
                            style = {{
                                width: '37%',
                                height: 175,
                            }}
                        />
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