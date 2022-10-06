import React, {useEffect, useState} from 'react';
import {
  Pressable,
  Text,
  View,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { BASE_URL } from '../config/Config';

const ScanScreen = ({navigation, route}) => {
  const [userList, setUserList] = useState([]);
  const [chatRequestModal, setChatRequestModal] = useState(false);
  const [customMessage, setCustomMesssage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  function scanNearbyBuddies() {
    setLoading(true);
    fetch(BASE_URL+'/app_mathbox/find_near_by_users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: route.params.parent_id,
        latitude: route.params.lat,
        longitude: route.params.lon,
      }),
    })
      .then(response => response.json())
      .then(json => {
        setLoading(false);
        console.log('Response ', json);
        setUserList(json.near_by_users);
      })
      .catch(error => {
        setLoading(false);
        Alert.alert('Data Fetch failed', 'Error : ' + error);
        console.error(error);
      });
  }

  useEffect(() => {
    console.log('Route Parent ID', route.params.parent_id);
    scanNearbyBuddies();
  }, []);

  onClickUserItem = id => {
    console.log('Pressed item', id);
    setChatRequestModal(true);
    setSelectedUser(id);
  };

  onPressSubmitChat = () => {
    console.log('Seleectd user', selectedUser);
    console.log('Custom message', customMessage);

    var submitUrl =
      BASE_URL+'/app_mathbox/near_by_user_message?user_id=' +
      selectedUser +
      '&message=' +
      customMessage+
      '&sender_id='+route.params.parent_id;

    console.log(submitUrl)  

    fetch(submitUrl)
      .then(response => response.json())
      .then(json => {
        console.log('Response ', json);
        resetChatRequestModal();
      })
      .catch(error => {
        console.error(error);
      });
  };

  function resetChatRequestModal() {
    setChatRequestModal(false);
    setCustomMesssage('');
  }

  function renderUserlist() {
    return (
      <View style={{backgroundColor: '#ffffff'}}>
        {loading && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}>
            <ActivityIndicator size="large" />
          </View>
        )}

        {userList &&
          userList.map(data => {
            return (
              <View
                key={data.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}>
                <View>
                  <Text style={{marginStart: 10, color: '#000000'}}>
                    {data.id}
                  </Text>
                  <Text style={{marginStart: 10, color: '#000000'}}>
                    {data.email}
                  </Text>
                </View>

                <Pressable
                  onPress={() => this.onClickUserItem(data.id)}
                  style={{borderWidth: 2}}>
                  <Text style={{padding: 10, color: '#000000'}}>
                    Chat Request
                  </Text>
                </Pressable>
              </View>
            );
          })}
      </View>
    );
    return userList.map(() => {
      <View>
        <Text>DATA</Text>
      </View>;
    });
  }
  return (
    <View
      style={{flex: 1, justifyContent: 'center', backgroundColor: '#ffffff'}}>
      <Text style={{textAlign: 'center'}}>Scan Screen</Text>
      {renderUserlist()}
      <Modal transparent={false} visible={chatRequestModal}>
        <View
          style={{
            height: 400,
            backgroundColor: '#ffffff',
            justifyContent: 'center',
          }}>
          <Text style={[{textAlign: 'center'}]}>Send Chat message</Text>
          <TextInput
            placeholderTextColor="#000000"
            placeholder="Enter Custom message"
            style={{margin: 10, borderWidth: 1, padding: 20}}
            autoCapitalize="none"
            onChangeText={text => setCustomMesssage(text)}
            value={customMessage}
            blurOnSubmit={false}
          />
          <View style={{ flexDirection : 'row',justifyContent : 'center' }}>
          <CheckBox
            disabled={false}
            value={toggleCheckBox}
            onValueChange={newValue => setToggleCheckBox(newValue)}
          />
          <Text style={{ textAlignVertical : 'center' }}>Share my Location</Text>
          </View>
          
          <Pressable onPress={onPressSubmitChat}>
            <Text
              style={{
                margin: 20,
                backgroundColor: '#000000',
                padding: 10,
                textAlign: 'center',
                color: '#ffffff',
              }}>
              Submit
            </Text>
          </Pressable>
          <Pressable onPress={() => setChatRequestModal(false)}>
            <Text
              style={{
                margin: 20,
                padding: 10,
                textAlign: 'center',
                color: '#000000',
              }}>
              Close
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default ScanScreen;
