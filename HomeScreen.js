import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, firestore } from './firebase'; // Import Firestore
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods

const HomeScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  // Load user data from Firestore and AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser; // Get currently authenticated user

      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid); // Reference to the Firestore document
        const userDoc = await getDoc(userDocRef); // Fetch the document

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || ''); // Set the name from Firestore
          setEmail(userData.email || ''); // Set the email from Firestore

          // Save the data in AsyncStorage for persistence
          await AsyncStorage.setItem('userName', userData.name || '');
          await AsyncStorage.setItem('userEmail', userData.email || '');
        } else {
          console.log('No such document!');
        }
      } else {
        // If no user is logged in, load from AsyncStorage
        const storedName = await AsyncStorage.getItem('userName');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App</Text>
      <Text style={styles.subTitle}>{name ? `Hello, ${name}!` : 'User'}</Text>
      <Text style={styles.subTitle}>{email}</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    color: '#64B5F6',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
