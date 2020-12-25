import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer'
import NewEventPage from '../pages/event/NewEventPage';
import EventPage from '../pages/event/EventPage';
import ProfilePage from '../pages/access/ProfilePage';
import styles from '../styles'

//só para teste
import InitialPage from '../pages/access/InitialPage';
import ImageTest from '../pages/event/ImageTest';
//

import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';


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
    return(
        <Drawer.Navigator
            initialRouteName = 'drawerTest'
            drawerPosition = 'right'
            
        >
            <Drawer.Screen
                 name = 'drawerTest'
                 component = {NavStack}
                 options = {{title: 'Provisório'}}
            />

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
    }else if (name === 'drawerTest'){
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
                name = 'invitationsPage' 
                component = {EventPage} //provisório
            />
            <Stack.Screen 
                name = 'newEventPage'
                component = {NewEventPage} 
            />
             <Stack.Screen 
                name = 'drawerTestPage'
                component = {ImageTest} //provisório
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
                    tabBarLabel: 'Feed'
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
                    }
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
                name = 'Chat' 
                component = {ProfilePage}
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