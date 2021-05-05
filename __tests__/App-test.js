import React from 'react'
import { render } from '@testing-library/react-native'
import App from '../App'

test('Home should render OK', async () => {
  const { container, toJSON } = render(
    <App />,
  )

  expect(toJSON(container)).toMatchSnapshot()
})
