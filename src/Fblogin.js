import React from 'react';
import {
  Button,
  View,
  Image,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import * as Facebook from 'expo-facebook';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 40
    // backgroundColor: '#ecf0f1',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    borderRadius: 8,
  },
  iconTextContainer: {
    // paddingVertical: 15,
    // paddingHorizontal: 10,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    borderRadius: 8
  },
});

function SignIn() {

  async function signIn() {
    try {
      await Facebook.initializeAsync('603864420369892');
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });
      console.log(type, "type")
      if (type === 'success') {
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,picture,email&access_token=${token}`);
        console.log(await response.json())
        const name = await (response.json()).name;
        alert(`You are logged in ${name}`);
      } else {
        alert("You must sign in...")
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={signIn}>
        <View style={styles.iconTextContainer}>
          <Text
            style={{ color: 'black' }}
          >
            Sign in with facebook
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default SignIn;
