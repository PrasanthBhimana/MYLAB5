import React, { useRef, useEffect, useState } from 'react';
import { Animated, Text, View, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';
import { auth, firestore } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import { doc, getDoc } from 'firebase/firestore';

// FadeInView component for fade-in animation
const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity set to 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade to fully visible
      duration: 10000, // Animation duration (10 seconds)
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};

// HomeScreen component with fade-in text and draggable box
const HomeScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  // PanResponder setup for draggable box
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false } // UseNativeDriver set to false for gestures
      ),
      onPanResponderRelease: () => {
        pan.extractOffset(); // This ensures the box stays where it was dragged
      },
    })
  ).current;

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || '');
          setEmail(userData.email || '');

          await AsyncStorage.setItem('userName', userData.name || '');
          await AsyncStorage.setItem('userEmail', userData.email || '');
        }
      } else {
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
      {/* Centered fade-in text */}
      <FadeInView style={{ width: 250, height: 70, backgroundColor: 'powderblue', justifyContent: 'center', alignItems: 'center', marginBottom: 20,transform: [{ translateY: -30 }]}}>
        <Text style={{ fontSize: 28, textAlign: 'center', margin: 0, paddingTop: 10,marginTop: -10 }}>
          Logged in
        </Text>
      </FadeInView>

      {/* Display User Info */}
      <Text style={styles.userInfoText}>Email: {email}</Text>
      <Text style={styles.userInfoText}>Name: {name}</Text>

      {/* Draggable Box */}
      <View style={styles.dragContainer}>
        <Text style={styles.titleText}>Drag this box!</Text>
        <Animated.View
          style={{
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          }}
          {...panResponder.panHandlers} // Attach the panHandlers for gesture
        >
          <View style={styles.box} />
        </Animated.View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
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
    padding: 20,
  },
  dragContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  userInfoText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
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
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  box: {
    height: 150,
    width: 150,
    backgroundColor: 'pink',
    borderRadius: 5,
  },
});

export default HomeScreen;
