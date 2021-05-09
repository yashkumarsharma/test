import { Platform } from 'react-native'

export const latoFont = weight => {
  return Platform.OS === 'android'
    ? `Lato${weight || 'regular'}`
    : `Lato-${weight || 'regular'}`
}

export const toRnSource = source =>
  typeof source === 'string' ? { uri: source } : source
