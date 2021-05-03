import { Platform } from 'react-native'

export const latoFont = (weight) => {
  return Platform.OS === 'android' ? `Lato${weight || 'regular'}` : `Lato-${weight || 'regular'}`
}
