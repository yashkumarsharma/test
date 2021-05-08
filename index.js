/**
 * @format
 */
import React from 'react'
import { AppRegistry } from 'react-native'

import ContextProvider from './src/components/ContextProvider/ContextProvider'

import App from './App'
import { name as appName } from './app.json'

const MobileApp = () => {
  return (
    <ContextProvider>
      <App />
    </ContextProvider>
  )
}

AppRegistry.registerComponent(appName, () => MobileApp)
