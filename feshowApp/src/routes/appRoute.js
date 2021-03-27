import React, { useState, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import styles from '../styles'
import AuthContext from '../contexts/auth';


import NewEventPage from '../pages/event/NewEventPage';
import InvitationsPage from '../pages/event/InvitationsPage';

import EventPage from '../pages/event/EventPageX';
import ProfilePage from '../pages/access/ProfilePage';
import ProfileEditPage from '../pages/access/ProfileEditPage';



//só para teste
import InitialPage from '../pages/access/InitialPage';
//

import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, TextInput, Text } from 'react-native';
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
import SearchPage from '../pages/social/SearchPage'

import EquipmentPick from '../pages/access/signup/EquipmentPick';
import GenrePick from '../pages/access/signup/GenrePick';
import InstrumentPick from '../pages/access/signup/InstrumentPick';
import Address from '../pages/access/signup/Address';
import OpeningHoursPick from '../pages/access/signup/OpeningHoursPick';


import EmailInsert from '../pages/access/passwordRecovery/EmailInsert';
import CodeInsert from '../pages/access/passwordRecovery/CodeInsert';
import PasswordRedefinition from '../pages/access/passwordRecovery/PasswordRedefinition';


import { ProfileUpdateProvider } from '../contexts/profileUpdate';


const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const ProfileUpdate = () => {
    return(
        <ProfileUpdateProvider>

            <Stack.Navigator
                screenOptions = {{
                    headerShown: false
                }}
                initialRouteName = 'profileEditPage'
            >

                <Stack.Screen 
                    name = 'profileEditPage'
                    component = {ProfileEditPage}
                />

                <Stack.Screen
                    name = 'genrePick'
                    component = {GenrePick} 
                />

                <Stack.Screen
                    component = {EquipmentPick}
                    name = 'equipmentPick'
                />

                <Stack.Screen
                    component = {InstrumentPick}
                    name = 'instrumentPick'
                />

                <Stack.Screen
                    component = {Address}
                    name = 'address'
                />

                <Stack.Screen
                    component = {OpeningHoursPick}
                    name = 'openingHoursPick'
                />

                <Stack.Screen
                    component = {PasswordRedefinition}
                    name = 'passwordRedefinition'
                />

            </Stack.Navigator>

        </ProfileUpdateProvider>
    )
}

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
    const navigation = useNavigation();
   
    return (
        <TouchableOpacity
            onPress = {() => {
                props.handleClick(!props.isSearchOpen);
                navigation.navigate('searchPage');
            }}
            style = {{marginRight: 20}}
        >
                <FontAwesome 
                    name = {'search'} 
                    size = {20} 
                    color = {'#000'}
                />
        </TouchableOpacity>
    );
}

const CustomDrawerContent  = (props) => {
    const authContext = useContext(AuthContext);
    return (
      <DrawerContentScrollView {...props}>
        <View
            style = {{
                height: 75,
                borderBottomWidth: 1,
                borderBottomColor: '#EEE',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Text style = {{letterSpacing: .5}}>
                @{authContext.user.username}
            </Text>
        </View>
        <DrawerItemList {...props} />

        <TouchableOpacity
            style = {{
                height: 75,
                borderTopWidth: 1,
                borderTopColor: '#EEE',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row'
            }}
            onPress = {() => authContext.signOut()}
        >
            <Ionicon
                name = {'exit-outline'} 
                color = {'#3F2058'} 
                size = {25}
            />

            <Text style = {{
                letterSpacing: .5,
                marginLeft: 5
            }}>      
                Sair
            </Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    );
  }

const NavDrawer = () => {
    const context = useContext(AuthContext);
    return(
        <Drawer.Navigator
            initialRouteName = 'drawerTest'
            drawerPosition = 'right'
            drawerContent = {(props) => <CustomDrawerContent {...props}/>}
            drawerContentOptions = {{
                activeTintColor: '#3F2058'
            }}
        >
            <Drawer.Screen
                name = 'ownProfile'
                component = {NavStack}
                options = {{title: 'Perfil'}}
            />

            <Drawer.Screen
                name = 'futureEvents'
                component = {NavStack}
                options = {{title: 'Meus eventos futuros'}}
            />

            {context.user.type === 1 &&
                <Drawer.Screen
                    name = 'requestList'
                    component = {NavStack}
                    options = {{title: 'Requisições de show'}} 
                />
            }
            
        </Drawer.Navigator>
    )
}

const NavStack = (props) => {

    const [isSearchOpen, setSearchOpen] = useState(false);
    const navigation = useNavigation();
    const authContext = useContext(AuthContext);

    var name = props.route.name;
    var headerIcons;
    if (name === 'feed'){
        headerIcons = (
            <View style = {styles.row}>
                
                <SearchOpener
                    isSearchOpen = {isSearchOpen}
                    handleClick = {setSearchOpen} 
                />

                <TouchableOpacity
                    onPress = {() => navigation.navigate('notificationsPage')}
                    style = {{
                        position: 'relative',
                        padding: 5
                    }}
                >
                    {authContext.user.notifications > 0 &&
                        <View
                            style = {{
                                position: 'absolute',
                                backgroundColor: 'red',
                                color: '#FFF',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10,
                                width: '80%',
                                height: '90%',
                                right: 0,
                                zIndex: 2
                            }}
                        >
                            <Text style = {{color: '#FFF'}}> 
                                {authContext.user.notifications}
                            </Text>
                        </View>
                    }
                    
                    <FontAwesome 
                        name = {'bell-o'} 
                        size = {20} 
                        color = {'#000'}
                    />
                    
                </TouchableOpacity>

            </View>
        )
    }else if (!!props.navigation.toggleDrawer){
        headerIcons = (
            <View style = {styles.row}>

                <TouchableOpacity
                    onPress = {() => navigation.navigate('notificationsPage')}
                >
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

   /* if(isSearchOpen){
        headerOptions.title = null;
        headerOptions.headerRight = null;
        headerOptions.headerLeft = () => headerIcons;
    }*/


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
                name = 'profileUpdate'
                component = {ProfileUpdate}
            />

            <Stack.Screen 
                name = 'profileEditPage'
                component = {ProfileEditPage}
            />

            <Stack.Screen
                name = 'genrePick'
                component = {GenrePick} 
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
                name = 'futureEventsPage'
                component = {FutureEventsPage}
            />

            <Stack.Screen 
                name = 'profilePageInvitation' 
                component = {ProfilePageInvitation} //provisório
            />

            <Stack.Screen 
                name = 'searchPage' 
                component = {SearchPage} //provisório
            />

            
            
        </Stack.Navigator>
    )
}

const AppRoute = () => {
    const authContext = useContext(AuthContext);
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
                        return <FontAwesome
                            name = {'lightbulb-o'} 
                            color = {color} 
                            size = {size}
                        />
                    },
                    tabBarLabel: 'Sugestões'
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

            {authContext.user.type === 1 &&
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
            }

            <Tabs.Screen 
                name = 'calendar' 
                component = {NavStack}
                options = {{
                    tabBarIcon: ({color, size}) => {
                        return <FontAwesome 
                            name = {'calendar'} 
                            color = {color} 
                            size = {size}
                        />
                    },
                    tabBarLabel: 'Agenda'
                }}
            />

            <Tabs.Screen 
                name = 'ownProfile' 
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