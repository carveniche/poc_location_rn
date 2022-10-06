import React,{ useEffect } from 'react';
import { Text,View,Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import SplashScreen from './SplashScreen';
import ScanScreen from './ScanScreen';
import messaging from '@react-native-firebase/messaging';
import ShowLocationScreen from './ShowLocationScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log(remoteMessage);
  //     Alert.alert(remoteMessage.notification.title, JSON.stringify(remoteMessage.notification.body));
  //   });

  //   return unsubscribe;
  // }, []);


  
  return (
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerBackVisible:false }} 
      />
    <Stack.Screen name="HomeScreen" component={HomeScreen}  options={{ headerBackVisible:false }}  />
     
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerBackVisible:false }}  />
      <Stack.Screen name="ScanScreen" component={ScanScreen}   />
      <Stack.Screen name="ShowLocationScreen" component={ShowLocationScreen}   />
    </Stack.Navigator>
  </NavigationContainer>

  );
}

export default App;