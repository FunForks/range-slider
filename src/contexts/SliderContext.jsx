/**
 * SliderContext.jsx
 *
 * This context allows you to share the value of a specific slider
 * with other components.
 */

import { createContext, useState } from 'react'


export const SliderContext = createContext()


export const SliderProvider = ({ children }) => {
  const getValue = ends => `${ends[0]} - ${ends[1]}`

  // setMaxValue is not shared in this demo, because there is
  // no need to change maxValue.
  const [ maxValue, setMaxValue ] = useState(100)
  const [ ends, setEnds ] = useState([0, 50])
  const [ value, setValue ] = useState(() => getValue(ends))




  const setEnd = (value, end) => {
    const next = end
               ? [ ends[0], value ]
               : [ value, ends[1]]
    setEnds(next)
    setValue(getValue(next))
  }


  return (
    <SliderContext.Provider
      value = {{
        maxValue,
        value,
        ends,
        setEnd
      }}
    >
      {children}
    </SliderContext.Provider>
  )
}