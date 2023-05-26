/**
 * SliderContext.jsx
 *
 * This context allows you to share the value of a specific slider
 * with other components.
 */

import { createContext, useState } from 'react'


export const SliderContext = createContext()


export const SliderProvider = ({ children }) => {
  // setMaxValue is not shared in this demo, because there is
  // no need to change maxValue.
  const [ maxValue, setMaxValue ] = useState(100)
  const [ value, setValue ] = useState(50)


  return (
    <SliderContext.Provider
      value = {{
        maxValue,
        value,
        setValue
      }}
    >
      {children}
    </SliderContext.Provider>
  )
}