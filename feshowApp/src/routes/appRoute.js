import React, { useState, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer'
import styles from '../styles'
import AuthContext from '../contexts/auth';


import NewEventPage from '../pages/event/NewEventPage';
import InvitationsPage from '../pages/event/InvitationsPage';

import EventPage from '../pages/event/EventPage';
import ProfilePage from '../pages/access/ProfilePage';


//só para teste
import InitialPage from '../pages/access/InitialPage';
//

import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import LineUpEditPage from '../pages/event/LineUpEditPage';
import FutureEventsPage from '../pages/social/FutureEventsPage';
import ProfilePageInvitation from '../pages/event/ProfilePageInvitation';
import HistoricPage from '../pages/social/HistoricPage';
import RequestPage from '../pages/event/RequestPage';
import RequestListPage from '../pages/event/RequestListPage';
import CalendarPage from '../pages/social/CalendarPage';
import NotificationsPage from '../pages/social/NotificationsPage';
import FeedPage from '../pages/social/FeedPage';


const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const DrawerOpener = () => { 
    var navigation = useNavigation();
    return (
        <TouchableOpacity
            style = {{marginLeft: 20}}
            onPress = {() => navigation.dispatch(DrawerActions.toggleDrawer)}
        >
            <FontAwesome 
                name = {'bars'} 
                size = {20} 
                color = {'#000'}
            />
        </TouchableOpacity>
    )
} 

const SearchOpener = (props) => {
    var icon = props.isSearchOpen ?
    <View style = {{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput 
            style = {{...styles.textInput, 
                marginTop: 0,
                height: '90%',
                width: '140%',
                marginLeft: 15
            }}
        />
        <TouchableOpacity
            onPress = {() => props.handleClick(!props.isSearchOpen)}
            style = {{padding: 4}}
        >
            <Ionicon
                style = {{marginLeft: 15}} 
                name = {'close'} 
                size = {30} 
                color = {'#000'}
            />
        </TouchableOpacity>
    </View>
    :
    <TouchableOpacity
        onPress = {() => props.handleClick(!props.isSearchOpen)}
        style = {{marginRight: 20}}
    >
        <FontAwesome 
            name = {'search'} 
            size = {20} 
            color = {'#000'}
        />
    </TouchableOpacity>
   
    return icon;
}

const NavDrawer = () => {
    const context = useContext(AuthContext);
    return(
        <Drawer.Navigator
            initialRouteName = 'drawerTest'
            drawerPosition = 'right'
            
        >
            <Drawer.Screen
                name = 'ownProfile'
                component = {NavStack}
                options = {{title: 'Primeiro'}}
            />

            <Drawer.Screen
                name = 'notifications'
                component = {NavStack}
                options = {{title: 'Notificações'}}
            />

            {context.user.type === 1 &&
                <Drawer.Screen
                    name = 'requestList'
                    component = {NavStack}
                    options = {{title: 'Requisições de show'}} 
                />
            }

            <Drawer.Screen
                name = 'initial'
                component = {InitialPage}
                options = {{title: 'Provisório'}}
            />
            
        </Drawer.Navigator>
    )
}

const NavStack = (props) => {

    const [isSearchOpen, setSearchOpen] = useState(false);
    var name = props.route.name;
    var headerIcons;

    if (name === 'feed'){
        headerIcons = (
            <View style = {styles.row}>
    
                <SearchOpener
                    isSearchOpen = {isSearchOpen}
                    handleClick = {setSearchOpen} 
                />

                {!isSearchOpen &&
                    <TouchableOpacity>
                        <FontAwesome 
                            name = {'bell-o'} 
                            size = {20} 
                            color = {'#000'}
                        />
                    </TouchableOpacity>
                }

            </View>
        )
    }else if (name === 'profile'){
        headerIcons = (
            <View style = {styles.row}>

                <TouchableOpacity>
                    <FontAwesome 
                        name = {'bell-o'} 
                        size = {20} 
                        color = {'#000'}
                    />
                </TouchableOpacity>

                <DrawerOpener />
                
            </View>
        )


    }

    const headerOptions = {
        title: 'Feshow',
        headerStyle: {backgroundColor: '#F2F2F2', elevation: 0},
        headerRightContainerStyle: {marginRight: 20, marginTop: 10},
        headerRight: () => headerIcons
    }

    if(isSearchOpen){
        headerOptions.title = null;
        headerOptions.headerRight = null;
        headerOptions.headerLeft = () => headerIcons;
    }


    return(
        <Stack.Navigator
            initialRouteName = {`${name}Page`}
            screenOptions = {headerOptions}
        >
            <Stack.Screen 
                name = 'feedPage' 
                component = {FeedPage} //provisório
            />

            <Stack.Screen 
                name = 'invitationsPage' 
                component = {InvitationsPage} //provisório
            />

            <Stack.Screen 
                name = 'newEventPage'
                component = {NewEventPage} 
            />

            <Stack.Screen 
                name = 'eventPage' 
                component = {EventPage} //provisório
            />

            <Stack.Screen 
                name = 'lineUpEditPage' 
                component = {LineUpEditPage} //provisório
            />

            <Stack.Screen 
                name = 'ownProfilePage'
                component = {ProfilePage} //provisório
            />

            <Stack.Screen 
                name = 'profilePage'
                component = {ProfilePage} //provisório
            />

            <Stack.Screen 
                name = 'historicPage'
                component = {HistoricPage} //provisório
            />

            <Stack.Screen 
                name = 'requestPage'
                component = {RequestPage} //provisório
            />

            <Stack.Screen 
                name = 'requestListPage'
                component = {RequestListPage} //provisório
            />

            <Stack.Screen 
                name = 'calendarPage'
                component = {CalendarPage} //provisório
            />

            <Stack.Screen 
                name = 'notificationsPage'
                component = {NotificationsPage} //provisório
            />

            <Stack.Screen 
                name = 'profilePageInvitation' 
                component = {ProfilePageInvitation} //provisório
            />
            
        </Stack.Navigator>
    )
}

const AppRoute = () => {
    return(
        <Tabs.Navigator
            tabBarOptions = {{
                activeTintColor: 'black',
                style: {elevation: 0, backgroundColor: '#F2F2F2'}
            }}
        >
            
            <Tabs.Screen 
                name = 'feed' 
                component = {NavStack}
                options = {{
                    tabBarIcon: ({color, size}) => {
                        return <Ionicon 
                            name = {'home-outline'} 
                            color = {color} 
                            size = {size}
                        />
                    },
                    tabBarLabel: 'Home'
                }}
            />

            <Tabs.Screen 
                name = 'invitations'
                component = {NavStack}
            
                options = {{
                    tabBarIcon: ({color, size}) => {
                        return <FontAwesome 
                            name = {'envelope-o'} 
                            color = {color} 
                            size = {size}
                        />
                    },
                    tabBarLabel: 'Convites'
                }}
            />

            <Tabs.Screen 
                name = 'newEvent' 
                component = {NavStack}
                options = {{
                    tabBarIcon: ({color, size}) => {
                        return <FontAwesome 
                            name = {'plus-square-o'} 
                            color = {color} 
                            size = {size}
                        />
                    },
                    tabBarLabel: 'Novo Evento'
                }}
            />

            <Tabs.Screen 
                name = 'chat' 
                component = {NavStack}
                options = {{
                    tabBarIcon: ({color, size}) => {
                        return <Ionicon 
                            name = {'chatbox-outline'} 
                            color = {color} 
                            size = {size}
                        />
                    }
                }}
            />
            <Tabs.Screen 
                name = 'profile' 
                component = {NavDrawer}
                options = {{
                    tabBarIcon: ({color, size}) => {
                        return <Ionicon 
                            name = {'person-outline'} 
                            color = {color} 
                            size = {size}
                        />
                    },
                    tabBarLabel: 'Perfil'
                }}
            />
        </Tabs.Navigator>

        
    )
}

export default AppRoute;