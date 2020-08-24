import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
 } from 'react-native';
 import { firebase } from '../../firebase/config';

export default function HomeScreen(props) {
  const [entityText, setEntityText] = useState('');
  const [entities, setEntities] = useState([]);

  const entityRef = firebase.firestore().collection('entities');
  const userID = props.extraData.id;

  useEffect(() => {
    entityRef
      .where('authorID', '==', userID)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          const newEntities = [];
          querySnapshot.forEach((doc) => {
            const entity = doc.data();
            entity.id = doc.id;
            newEntities.push(entity);
          });
          setEntities(newEntities);
        },
        error => {
          console.error(error);
        }
      ) 
  }, []);

  const onAddPress = () => {
    if (entityText && entityText.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        text: entityText,
        authorID: userID,
        createdAt: timestamp,
      };
      entityRef
        .add(data)
        .then((_doc) => {
          setEntityText('');
          Keyboard.dismiss();
        })
        .catch((error) => {
          alert(error)
        });
    }
  };

  const renderEntity = ({item, index}) => (
    <View style={styles.entityContainer}>
      <Text style={styles.entityText}>
        {index + 1}. {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new entity"
          placeholderTextColor="#aaa"
          onChangeText={(text) => setEntityText(text)}
          value={entityText}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={onAddPress}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      { entities && (
        <View style={styles.listContainer}>
          <FlatList
            data={entities}
            renderItem={renderEntity}
            keyExtractor={(item) => item.id}
            removeClippedSubviews={true}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
    padding: 30
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },

})
