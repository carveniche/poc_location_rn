import React, { useEffect,useState } from 'react';
import { Text, View, Platform, PermissionsAndroid, Pressable,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { BASE_URL } from '../config/Config';


const HomeScreen = ({ navigation, route  }) => {
    const [firebaseToken,setFirebaseToken] = useState('')
    const [cLatitude,setCLatitude] = useState('')
    const [cLongitude,setCLongitude] = useState('')

    async function requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Example App',
                    'message': 'Example App access to your location '
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location")
                getCurrentLocation()
            } else {
                console.log("location permission denied")
                alert("Location permission denied");
            }
        } catch (err) {
            console.warn(err)
        }
    }



    updateDeviceInfo = () => {
        var params = {
            parent_id: route.params.parent_id,
            regId: firebaseToken,
            time_zone: 'Asia/Kolkata',
            device: Platform.OS,
            latitude: cLatitude,
            longitude: cLongitude
        }
                   console.log(params) 
        fetch(BASE_URL+'/app_mathbox/device_info', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then((response) => response.json())
        .then((json) => {
          console.log("Response ",json)
        })
        .catch((error) => {
          console.error(error);
        });
        
        


    }





    getCurrentLocation = () => {
        Geolocation.getCurrentPosition(info => setCurrentCoordinated(info.coords));
        return

        if(Platform.OS == 'ios')
        Geolocation.getCurrentPosition(info => setCurrentCoordinated(info.coords));
        else
        Geolocation.getCurrentPosition(
            position => {
              const initialPosition = JSON.stringify(position);
              console.log(initialPosition);
            },
            error => Alert.alert('Error', JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
          );
      
        
    }

    setCurrentCoordinated = (coords) => {
        setCLatitude(coords.latitude)
        setCLongitude(coords.longitude)
        console.log("Current Location Info : ",coords)
    }

    requestUserPermission = async () => {
        console.log("request permission")
        // let appId = '';
        // if (Platform.OS == 'ios')
        //     appId = '1:696357077714:ios:298cd6efbf7de2c555e30b'
        // else
        //     appId = '1:696357077714:android:187b3cd0b629e80255e30b'

        // const credentials = {
        //     appId: appId,
        //     apiKey: 'AIzaSyCzRZCP5lj-uUAIOnZMru1nXXOP6UG2jfo',
        //     databaseURL: '',
        //     messagingSenderId: '696357077714',
        //     projectId: 'poc-begalileo',
        //     storageBucket: ''
        // };
        // const firebaseInit = await firebase.initializeApp(credentials);
        // console.log(firebaseInit)
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED
            || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
            getMessagingToken()
        }
    }

    useEffect(()=>{
        if(firebaseToken != "" && cLatitude!="" && cLongitude!="")
        {
            //alert("Update device info")
            console.log("[ZZZZZZZZ]:Firbase token updated",firebaseToken)
            console.log("[XXXXXXXX]:Lat updated",cLatitude)
            console.log("[SSSSSSSS]::Lon  updated",cLongitude)
            updateDeviceInfo()
        }
        checkForNotification()
    
    },[firebaseToken,cLatitude,cLongitude])

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            let uLat = remoteMessage.data.latitude;
            let uLon = remoteMessage.data.longitude;
            let title = remoteMessage.notification.title;
            let body = JSON.stringify(remoteMessage.notification.body)
            Alert.alert(title,body,[
                {
                    text : "Cancel",
                    onPress: ()=>console.log("Cancelled"),
                    style:'cancel'
                },
                {
                    text : "Show",
                    
                    onPress: ()=>navigateToShowLocationScreen(uLat,uLon),
                    style:'default'  
                }
            ])
            // Alert.alert(
            //     remoteMessage.notification.title,
            //     JSON.stringify(remoteMessage.notification.body,
            //     [
            //       {
            //         text: "Cancel",
            //         onPress: () => console.log("Cancel Pressed"),
            //         style: "cancel"
            //       },
            //       { 
            //         text: "OK", onPress: () => console.log("OK Pressed")
            //      }
            //     ]
            //   ));
        //  Alert.alert(remoteMessage.notification.title, JSON.stringify(remoteMessage.notification.body));
        });
    
        return unsubscribe;
      }, []);

    getMessagingToken = () => {
        console.log("Getting message token")
        messaging()
            .getToken()
            .then((token) => {
                console.log(`@@@@@@@@@ Device Token ${token}`);
                setFirebaseToken(token)
                // this.tokenToServer(parentUserId, token, parentTimeZone);
            }).catch((err) => {
                console.log("TOken Error", err)
            });
    }


    navigateToScanScreen = () => {
        navigation.navigate('ScanScreen',{ 
            parent_id : route.params.parent_id,
            lat : cLatitude,
            lon : cLongitude
         })
    }

    checkForNotification = ()=> {
        messaging()
          .getInitialNotification()
          .then((remoteMessage) => {
            if (remoteMessage) {
              console.log(
                'Notification caused app to open from quit state:',
                remoteMessage.notification
              );
    
              console.log('Notification data :', remoteMessage.data);
              if (remoteMessage.data) {
                
                // if (remoteMessage.data.type == 'join') {
                //   this.peakTheLiveClass(remoteMessage.data.live_class_id);
                // }
              }
            }
          });
      }

    navigateToShowLocationScreen = (uLat,uLon) => {

        //For testing
         uLat = '11.342423'
         uLon = '77.728165'

        navigation.navigate('ShowLocationScreen',{ 
            parent_id : route.params.parent_id,
            lat : uLat,
            lon : uLon
         })
    }



    logOutuser = async () => {
        await AsyncStorage.removeItem('LOCAL_PARENT_ID')
        navigation.navigate('LoginScreen')
    }


    useEffect(() => {
        console.log("Parent ID",route.params.parent_id)
        if (Platform.OS == 'android')
            requestLocationPermission()
        else
            getCurrentLocation()


        requestUserPermission()
    },[])
    return (
        <View style={{ flex: 1, justifyContent : 'center',backgroundColor : '#ffffff' }}>
           {
            Platform.OS == 'android' && 
            <Pressable style={{ alignItems : 'center',marginTop: 40,borderWidth : 2,padding : 10 }} onPress={() => {
                requestLocationPermission()
            }}>
                <Text>Get Location Permission Android</Text>
            </Pressable>
           }
            
            {/* <Pressable style={{ alignItems : 'center',marginTop: 40,borderWidth : 2,padding : 10 }} onPress={() => {
                getMessagingToken()
            }}>
                <Text>Get Message Token</Text>
            </Pressable> */}

            <Pressable style={{ alignItems : 'center',marginTop: 40,borderWidth : 2,padding : 10 }} onPress={() => {
                console.log("Naivgate")
                  navigateToScanScreen()
            }}>
                <Text style={{ color : '#000000' }}>Scan Buddies</Text>
            </Pressable>
            <Pressable style={{ alignItems : 'center',marginTop: 40,borderWidth : 2,padding : 10 }} onPress={() => {
                console.log("Naivgate")
                  navigateToShowLocationScreen()
            }}>
                <Text style={{ color : '#000000' }}>Show Location</Text>
            </Pressable>

            <Pressable style={{ alignItems : 'center',marginTop: 40,borderWidth : 2,padding : 10 }} onPress={() => {
                console.log("Naivgate")
                  logOutuser()
            }}>
                <Text style={{ color : '#000000' }}>Log Out</Text>
            </Pressable>
        </View>

    );
}

export default HomeScreen;