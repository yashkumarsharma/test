import { useState } from 'react'

export const useSelect = (initialArray) => {
  const [selectedOptions, setSelectedOptions] = useState(initialArray)

  const add = (option) => {
    if (typeof option !== 'object' && selectedOptions.includes(option)) return
    if (typeof option === 'object') {
      setSelectedOptions(option)
    } else {
      const selected = [...selectedOptions, option]
      setSelectedOptions(selected)
    }
  }

  const remove = (option) => {
    const selected = selectedOptions.filter((element) => element !== option)
    setSelectedOptions(selected)
  }

  const isSelected = (option) => {
    if (!selectedOptions.length) return false
    return selectedOptions.includes(option)
  }

  const reset = () => {
    setSelectedOptions([])
  }

  return {
    selectedOptions,
    add,
    remove,
    isSelected,
    reset,
  }
}
