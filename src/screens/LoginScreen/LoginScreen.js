import React, { useContext, useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native'

import { AppContext } from '../../components/ContextProvider/ContextProvider'
import { login } from '../../utilities/api'

const LoginScreen = props => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const context = useContext(AppContext)
  const { updateContext } = context

  const submit = async () => {
    const data = await login(username, password)
    const user = {
      username,
      ...data,
    }
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
