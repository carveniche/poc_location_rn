import React, { useEffect, useState } from 'react';
import { Text, View,Alert } from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from 'react-native-google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/Config';






const LoginScreen = ({ navigation }) => {
    const [loggedIn, setloggedIn] = useState(false);
    const [userInfo, setuserInfo] = useState([]);


    onGoogleLoginSuccess = (userInfo) => {


        const user = userInfo.user;
        console.log("User ",user)
        storeMobileNumber(user.email)

    }


    storeMobileNumber = (userEmail)=> {

       
    
        fetch(BASE_URL+'/app_mathbox/store_mobile', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mobile: '',
                otp_status: false,
                email: userEmail,
                country_code: '',
                country: ''
            })
        })
        .then((response) => response.json())
        .then((json) => {
          console.log("Response ",json.user_id)
          this.storeUserInfoLocal(JSON.stringify(json.user_id))
        })
        .catch((error) => {
          console.error(error);
        });
    }

    storeUserInfoLocal = async (parent_id) => {
        
        await AsyncStorage.setItem('LOCAL_PARENT_ID', parent_id)
        navigation.navigate('HomeScreen', { parent_id: parent_id })
    }


    _signIn = async () => {
        try {
            GoogleSignin.configure(
                {
                  //webClientId is required if you need offline access
                  offlineAccess: true,
                  webClientId:'696357077714-igi7lv3vp8rdhar2hlbg9j88sbm18j69.apps.googleusercontent.com',
                  androidClientId: '3242343242322432-2342323432232324343323.apps.googleusercontent.com',
                  scopes: ['profile', 'email']
                });
            console.log("Sigining in with google")
            await GoogleSignin.hasPlayServices();

            const userInfo = await GoogleSignin.signIn();
            console.log("google user info", userInfo);


            this.onGoogleLoginSuccess(userInfo);
            
            setloggedIn(true);
        } catch (error) {
            console.log("Error ",error)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                alert('Cancel');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                alert('Signin in progress');
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                alert('PLAY_SERVICES_NOT_AVAILABLE');
                // play services not available or outdated
            } else {
                Alert.alert("Login Failed", error);
                // some other error happened
            }
        }
    };


    signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            setloggedIn(false);
            setuserInfo([]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        GoogleSignin.configure({
            scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
            webClientId:
                '696357077714-igi7lv3vp8rdhar2hlbg9j88sbm18j69.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        });
    }, []);


    return (
        <View style={{ flex: 1, justifyContent: 'center',backgroundColor : '#ffffff' }}>
            <Text style={{ textAlign: 'center',color : '#000000' }}>Login Screen</Text>
            <GoogleSigninButton
                style={{ width: 192, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this._signIn}
            />
        </View>

    );
}

export default LoginScreen;