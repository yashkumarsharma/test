import React, { useContext, useEffect, useState } from 'react'
import {
  Image,
  Keyboard,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/Feather'
import Toast from 'react-native-simple-toast'

import { AppContext } from '../../components/ContextProvider/ContextProvider'
import { login } from '../../utilities/api'
import { latoFont, toRnSource } from '../../utilities/utilsFunctions'

import logo from '../../assets/images/logo.png'

const LoginScreen = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)

  const context = useContext(AppContext)
  const { setUser } = context

  const submit = async () => {
    Toast.show('Signing in')
    Keyboard.dismiss()
    const data = await login(username, password)
    if (data.id_token) {
      const user = {
        username,
        ...data,
      }
      await AsyncStorage.setItem('user', JSON.stringify(user))
      setUser({ user })
    } else {
      Toast.show('Wrong email or password.', Toast.LONG)
    }
  }

  const renderEye = () => {
    const iconName = passwordVisible ? 'eye-off' : 'eye'
    return (
      <Icon
        onPress={() => setPasswordVisible(!passwordVisible)}
        style={styles.eyeIcon}
        name={iconName}
        size={20}
        color='white'
      />
    )
  }

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => Linking.openURL('https://www.outlier.org/')}>
        <Image
          onPress={() => Linking.openURL('https://www.outlier.org/')}
          style={styles.logo}
          source={toRnSource(logo)}
          resizeMode='contain'
        />
      </Pressable>
      <Text style={styles.description}> Companion App </Text>
      <Text style={styles.helperText}> Log in to continue to Outlier. </Text>
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder='Email'
          onChangeText={setUsername}
          placeholderTextColor='white'
          keyboardType='email-address'
          defaultValue={username}
        />
      </View>
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder='Password'
          onChangeText={setPassword}
          placeholderTextColor='white'
          secureTextEntry={
            Platform.OS === 'android'
              ? password.length > 0 && !passwordVisible
              : !passwordVisible
          }
          defaultValue={password}
        />
        {renderEye()}
      </View>
      <Text
        style={styles.link}
        onPress={() =>
          Linking.openURL('https://dashboard.outlier.org/#/forgotPassword')
        }>
        Forgot Password?
      </Text>
      <Pressable style={styles.submitButton} onPress={submit}>
        <Text style={styles.submitButtonText}>CONTINUE</Text>
      </Pressable>
      <View style={styles.signupText}>
        <Text style={styles.helperText}> Don’t have an account? </Text>
        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL('https://dashboard.outlier.org/signup')
          }>
          Sign up
        </Text>
      </View>
      <View style={styles.footerSection}>
        <Text
          style={styles.footerLink}
          onPress={() =>
            Linking.openURL('https://dashboard.outlier.org/#terms-of-use')
          }>
          Terms of use
        </Text>
        <Text
          style={styles.footerLink}
          onPress={() =>
            Linking.openURL('https://dashboard.outlier.org/#/privacy-policy')
          }>
          Privacy Policy
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#292929',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 40,
    marginBottom: 16,
  },
  description: {
    color: 'white',
    fontFamily: latoFont('Bold'),
    fontSize: 18,
    lineHeight: 22,
    marginBottom: 27,
    fontWeight: '700',
  },
  helperText: {
    color: 'white',
    fontFamily: latoFont(),
    fontSize: 16,
    lineHeight: 19,
    marginBottom: 37,
    fontWeight: '400',
  },
  inputSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 9,
  },
  eyeIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    color: 'white',
    fontSize: 16,
    lineHeight: 19,
    fontFamily: latoFont(),
    fontWeight: '400',
  },
  link: {
    color: '#5FC4B8',
    fontSize: 16,
    fontFamily: latoFont(),
    lineHeight: 19,
    marginBottom: 24,
  },
  submitButton: {
    width: 300,
    borderRadius: 3,
    marginBottom: 30,
    backgroundColor: '#5FC4B8',
    height: 40,
    // textAlign: 'center',
    justifyContent: 'center',
    // alignSelf: 'center',
  },
  submitButtonText: {
    textAlign: 'center',
    fontFamily: latoFont('Bold'),
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 1,
  },
  signupText: {
    flexDirection: 'row',
  },
  footerSection: {
    position: 'absolute',
    backgroundColor: 'black',
    bottom: 0,
    width: '100%',
    height: 65,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerLink: {
    color: '#5FC4B8',
    fontSize: 14,
    fontFamily: latoFont(),
    lineHeight: 17,
    marginTop: 12,
    marginRight: 12,
  },
})

export default LoginScreen
