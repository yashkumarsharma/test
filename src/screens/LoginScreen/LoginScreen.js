import React, { useContext, useEffect, useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import { AppContext } from '../../components/ContextProvider/ContextProvider'
import { login } from '../../utilities/api'

const LoginScreen = props => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const context = useContext(AppContext)
  const { updateContext } = context

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        updateContext({ user })
      }
    } catch (err) {
      console.warn('Error while fetching user from Asycnstorage')
    }
  }

  const submit = async () => {
    const data = await login(username, password)
    const user = {
      username,
      ...data,
    }
    await AsyncStorage.setItem('user', JSON.stringify(user))
    updateContext({ user })
  }

  return (
    <View
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
      }}>
      <Text style={{ color: 'black' }}>Login Screen</Text>
      <TextInput
        style={{ height: 40 }}
        placeholder="Enter username/emailid"
        onChangeText={text => setUsername(text)}
        defaultValue={username}
      />
      <TextInput
        style={{ height: 40 }}
        placeholder="Enter Password"
        onChangeText={text => setPassword(text)}
        defaultValue={password}
      />
      <Button title="Login" onPress={submit} />
    </View>
  )
}

export default LoginScreen
