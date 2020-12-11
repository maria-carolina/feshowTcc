import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfilePage from '../pages/access/ProfilePage';

const Stack = createStackNavigator();

const AppRoute = () => {
    return(
        <Stack.Navigator
            initialRouteName = 'profilePage'
            headerMode = 'none'
        >
            <Stack.Screen 
                component = {ProfilePage}
                name = 'profilePage'
            />
        </Stack.Navigator>
    )
}

export default AppRoute;