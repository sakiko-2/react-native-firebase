import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../../firebase/config';

export default function RegistrationScreen({navigation}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onFooterPress = () => {
    navigation.navigate('Login');
  };

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Password don't match.");
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const data = {
          id: uid,
          email,
          fullName,
        };

        const userRef = firebase.firestore().collection('users');
        userRef
          .doc(uid)
          .set(data)
          .then(() => {
            navigation.navigate('Home', {user: data})
          })
          .catch((error) => alert(error));
      })
      .catch((error) => alert(error));
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <Image
          style={styles.logo}
          source={require('../../../assets/icon.png')}
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#aaa"
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          placeholderTextColor="#aaa"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}
        >
          <Text style={styles.buttonTitle}>Create account</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.footerText}>Already have an account?
            <Text onPress={onFooterPress} style={styles.footerLink}> Log in</Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30
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
