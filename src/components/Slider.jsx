/**
 * Slider.jsx
 */


import { useState, useRef, useContext, useEffect } from 'react'
import { SliderContext } from "../contexts/SliderContext"



// Styles for the slider and its thumb
const sliderStyle = {
  "--size": "2rem",
  position: "relative",
  width: "420px",
  height: "var(--size)",
  border: "1px solid #fff"
}


const thumbStyle = {
  position: "absolute",
  height: "var(--size)",
  width: "var(--size)",
  backgroundColor: "#fff",
  border: "2px solid #000",
  boxSizing: "border-box",
  top: 0
}


const pStyle = {
  position: "relative",
  top: "var(--size)",
  fontSize: "1.5rem",
  textAlign: "center",
  margin: 0,
  WebkitUserSelect: "none", /* Safari */
  userSelect: "none"
}



export const Thumb = ({
  className,
  style,
  startDrag
}) => {


  return (
    <div
      className={`${className} thumb`}
      style={{ ...thumbStyle, ...style }}
      onMouseDown={startDrag}
    />
  )
}


export const Slider = () => {
  const {
    maxValue,
    value,
    ends,
    setEnd
  } = useContext(SliderContext)

  // Used only once, in the initial useEffect
  const [ initialized, setInitialized ] = useState(false)

  const ref  = useRef()    // DOM element then maxX integer
  const { size, maxX } = (ref.current || {})
  const pxs  = maxX
             ? ends.map( end => end * maxX / maxValue )
             : [0, 0]
  const styles = pxs.map( end => (
    { left: end+"px", opacity: initialized * 1 }
  ))


  const startDrag = ({ pageX, target }) => {
    const index = target.classList.contains("right") + 0
    const offset = pxs[index] - pageX // constant in closure
    let closureValue = ends[index]    // can be updated in closure

    const limits = index
    ? { min: pxs[0] + size, max: maxX }
    : { min: 0, max: pxs[1] - size }

    /**
     * drag() is triggered by mousemove events
     */
    const drag = ({ pageX }) => {
      const left = Math.max(
        limits.min,
        Math.min(
          pageX + offset,
          limits.max
      ))

      // Calculate the current value
      const next = Math.round((left * maxValue / maxX))

      if (closureValue !== next) {
        setEnd(next, index)
        // Update within the startDrag closure
        closureValue = next
      }
    }

    /**
       * drop() is triggered by a mouseup event
       */
    const drop = () => {
      document.body.removeEventListener("mousemove", drag, false)
    }

    // Start receiving mouse events until the mouse is released
    document.body.addEventListener("mousemove", drag, false)
    document.body.addEventListener("mouseup", drop, {once: true})
  }



  /**
   * initialize is only called once, immediately after the
   * component is mounted.
   */
  const initialize = () => {
    const slider = ref.current
    // The following assumes that the thumbs will be square
    const width = slider.clientWidth // without border
    const height = slider.clientHeight // without border

    // Re-use ref to hold the maxX value of the slider thumb
    const maxX = width - height
    ref.current = {
      size: height,
      maxX
    }

    // Force a re-render so that thumbs will be placed
    setInitialized(true)
  }


  useEffect(initialize, [])


  return (
    <div
      className="slider"
      style={sliderStyle}
      ref={ref}
    >
      <p
        style={pStyle}
      >
        {value}
      </p>
      <Thumb
        className="left"
        style={styles[0]}
        startDrag={startDrag}
      />
      <Thumb
        className="right"
        style={styles[1]}
        startDrag={startDrag}
      />
    </div>
  )
}