import React, {useEffect, useState} from 'react';

import {Alert, Dimensions, Linking, Platform, Pressable, Text, View} from 'react-native';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

import Pin from '../screens/assets/placeholder.png';

const ShowLocationScreen = ({navigation, route}) => {
  openGps = () => {
    var lat = route.params.lat;
    var lng = route.params.lon;
    // console.log(lat, lng);
    // var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    // var url = scheme + `${lat},${lng}`;
    // console.log(url);

    if(Platform.OS == 'ios')
    {
      chooseMaps()
    }
    else{
      const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
      const latLng = `${lat},${lng}`;
      const label = 'beGalileo User';
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });
  
      Linking.openURL(url);
    }

   
    // Linking.openURL(url);
  };


  openWithGoogleMap = () => {
    let lat = route.params.lat;
    let lng = route.params.lon;
    let mapUrl = `https://www.google.com/maps/dir/?api=1&origin=` +
    lat +
    `,` +
    lng;

    Linking.openURL(mapUrl);
    

    // const scheme = Platform.select({ios: 'geo:0,0?q=', android: 'geo:0,0?q='});
    //   const latLng = `${lat},${lng}`;
    //   const label = 'beGalileo User';
    //   const url = Platform.select({
    //     ios: `${scheme}${label}@${latLng}`,
    //     android: `${scheme}${latLng}(${label})`,
    //   });
  
    //   Linking.openURL(url);

  }

  openWithAppleMap = () => {
    let lat = route.params.lat;
    let lng = route.params.lon;
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
      const latLng = `${lat},${lng}`;
      const label = 'beGalileo User';
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });
  
      Linking.openURL(url);

  }


  chooseMaps = () => {
    Alert.alert("Select Map","Choose the map to open",[
      {
          text : "Gmaps",
          onPress: ()=>openWithGoogleMap(),
          style:'cancel'
      },
      {
          text : "Maps",
          
          onPress: ()=>openWithAppleMap(),
          style:'default'  
      },
      {
        text : "Cancel",
        onPress: ()=>console.log("Cancelled"),
        style:'cancel'
    },
  ])
  }

  return (
    <View>
      <MapView
        style={{width: screenWidth, height: screenHeight - 200}}
        initialRegion={{
          latitude: route.params.lat,
          longitude: route.params.lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={{
            latitude: route.params.lat,
            longitude: route.params.lon,
          }}></Marker>
        <Marker
          coordinate={{
            latitude: route.params.lat,
            longitude: route.params.lon,
          }}>
          <View
            style={{
              width: 200,
              height: 80,
              marginBottom: 100,
              borderRadius: 20,
            }}>
            {/* <Text style={{ color : 'white',textAlign : 'center',textAlignVertical : 'center'}}>user</Text> */}
            <Pressable onPress={openGps}>
              <Text
                style={{
                  textAlign: 'center',
                  backgroundColor: 'green',
                  margin: 10,
                  borderRadius: 20,
                  padding: 10,
                  color: 'white',
                }}>
                Open in map
              </Text>
            </Pressable>
          </View>
        </Marker>
      </MapView>
    </View>
  );
};

export default ShowLocationScreen;
