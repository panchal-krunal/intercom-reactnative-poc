import React, {useEffect} from 'react';
import {Text, View, AppState} from 'react-native';
import Intercom from '@intercom/intercom-react-native';
import messaging from '@react-native-firebase/messaging';
import firebaseapp from '@react-native-firebase/app';

const App = () => {
  const credentials = {
    clientId: '',
    appId: '1:849084935816:android:af387b49daad872c14393d',
    apiKey: '',
    databaseURL: '',
    storageBucket: '',
    messagingSenderId: '849084935816',
    projectId: 'intercom-testing-a628e',
  };
  firebaseapp.initializeApp();
  const setIntercomEvents = () => {
    console.log('intercom events');
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      let token = await messaging().getToken();
      console.log('firebase token', token);
      console.log('Authorization status:', authStatus);
      await Intercom.registerIdentifiedUser({
        email:'krunal@hotmail.com',
        userId:'KRUN_HOTMAIL'
      })
      await Intercom.sendTokenToIntercom(token);
      await Intercom.logEvent('POC_EVENT', {
        device: 'Android',
        version: '1.0',
        user: 'krunal_panchal',
      });
    }
  }

  useEffect(() => {
    // initializeFirebaseApp()
    requestUserPermission();
    setIntercomEvents();
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => nextAppState === 'active' && Intercom.handlePushMessage(),
    );
    return () => appStateListener.remove(); // <- for RN >= 0.65
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Intercom Notification Test</Text>
    </View>
  );
};
export default App;
