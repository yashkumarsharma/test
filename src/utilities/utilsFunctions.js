import { Platform } from 'react-native'

export const latoFont = (weight) => {
  return Platform.OS === 'android'
    ? `Lato${weight || 'Regular'}`
    : `Lato-${weight || 'Regular'}`
}

export const toRnSource = (source) =>
  typeof source === 'string' ? { uri: source } : source

export const intersection = (array1, array2) =>
  array1.filter((n) => {
    return array2.indexOf(n) !== -1
  })

export const showMathTab = (data) => {
  const MathTabCourses = ['b227c462-332c-40e0-8735-ea3af6f11661',
    'ea88ffd3-5c59-49d5-89b4-b9f009dde9ac',
    'ckdampe3b00003g5m6l85b1s5']

  const subscribedCourses = data?.map(course => course?.id)

  return intersection(subscribedCourses, MathTabCourses)
}

const UNITS = ['B', 'KB', 'MB', 'GB']

export const getPrettySize = number => {
  if (number === 0) return '0.00'

  const exponent = Math.min(Math.floor(Math.log(number) / Math.log(1024)), UNITS.length - 1)
  const size = (number / Math.pow(1024, exponent)).toPrecision(3)
  return `${size} ${UNITS[exponent]}`
}
