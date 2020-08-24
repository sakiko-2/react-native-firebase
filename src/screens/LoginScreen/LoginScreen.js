import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../../firebase/config';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onFooterPress = () => {
    navigation.navigate('Registration')
  };

  const onLoginPress = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const userRef = firebase.firestore().collection('users');
        userRef
          .doc(uid)
          .get()
          .then(firestoreDocument => {
            if (!firestoreDocument.exists) {
              alert("User does not exist.");
              return;
            }
          })
          .catch((error) => alert(error));
      })
      .catch((error) => alert(error));
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
      >
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.logo}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaa"
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onLoginPress()}
        >
          <Text style={styles.buttonTitle}>Log in</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Text onPress={onFooterPress} style={styles.footerLink}>Sign up</Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: 'lightgrey'
  },
  title: {

  },
  logo: {
    height: 120,
    width: 120,
    marginBottom: 30,
    marginTop: 10,
    alignSelf: 'center',
  },
  input: {
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1cb0f6',
    borderRadius: 10,
    marginVertical: 10,
    height: 48
  },
  buttonTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  footerView: {
    alignItems: 'center',
    marginTop: 20
  },
  footerText: {
    fontSize: 16,
  },
  footerLink: {
    color: '#1cb0f6',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10
  }
});
