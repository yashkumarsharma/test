import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const AppContext = createContext()

const ContextProvider = ({ children }) => {
  const [context, setContext] = useState({})

  return (
    <AppContext.Provider
      value={{
        ...context,
        updateContext: setContext,
      }}>
      {children}
    </AppContext.Provider>
  )
}

ContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default ContextProvider
