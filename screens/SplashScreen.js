import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from '@react-native-firebase/app';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        initFirebase()
        checkUserLoggedIn()
        //
        //
    },[])

    checkUserLoggedIn = async () => {
        //await AsyncStorage.removeItem('LOCAL_PARENT_ID')
        const value = await AsyncStorage.getItem('LOCAL_PARENT_ID')
        if (value == null)
            navigateToLoginScreen()
        else
            navigateToHomeScreen(value)
        console.log("Local Parent ID", value)
    }

    navigateToHomeScreen = (value) => {
        navigation.navigate('HomeScreen', { parent_id: value })
    }
    navigateToLoginScreen = () => {
        navigation.navigate('LoginScreen', { name: 'Jane' })
    }


    initFirebase = async () => {

        if (!firebase.apps.length) {

            let appId = '';
            if (Platform.OS == 'ios')
                appId = '1:696357077714:ios:298cd6efbf7de2c555e30b'
            else
                appId = '1:696357077714:android:187b3cd0b629e80255e30b'
            const credentials = {
                appId: appId,
                apiKey: 'AIzaSyCzRZCP5lj-uUAIOnZMru1nXXOP6UG2jfo',
                databaseURL: '',
                messagingSenderId: '696357077714',
                projectId: 'poc-begalileo',
                storageBucket: ''
            };
            const firebaseInit = await firebase.initializeApp(credentials);
            console.log(firebaseInit)
        }

    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center' }}>Splash Screen</Text>
        </View>

    );
}

export default SplashScreen;