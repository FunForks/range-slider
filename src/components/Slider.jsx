/**
 * Slider.jsx
 *
 * Demo of dragging an element using a React component.
 *
 * NOTE: It is important to have pay close attention to the
 * closures created by different renderings of the Slider
 * component.
 *
 * When React renders a component, it calls the component function.
 * The function creates a closure; each rendering of the component
 * creates a different closure. Updating a state variable (using
 * set<State>) causes React to call the function and render the
 * component again. This happens both when the set<State> call is
 * made inside the component itself or within a context that it
 * inherits from.
 *
 * When a mousedown event is triggered in one closure, listeners
 * for mousemove and mouseup are created within that closure.
 *
 * React stores variable created with useRef inside an object. The
 * `.current` value of that object is available across all closures.
 * Its value can be updated in one closure and read in the next.
 *
 * When the component is mounted, `ref`, a useRef() variable is
 * passed to the thumb element, which will assign a pointer to
 * that DOM element to `ref.current`.
 *
 * In the useEffect function, this information is used to calculate
 * maxX: the maximum value of `left`. Then `ref.current` is set to
 * this integer value. On subsequent renders, React will not alter
 * the value of `ref.current`, so it will retain its maxX value.
 *
 * Saving data in a useRef does not trigger a new render. We need
 * to re-render the Slider component with a maxX value, which can
 * be used to set the value of `left` for the thumb. To do this,
 * a single call is made to a setInitialized useState function.
 * Updating a useState variable _will_ trigger a re-render.
 *
 * Inside the startDrag function, two variables are set:
 * - offset
 * - closureValue
 *
 * These remain available inside the closure created by that
 * particular render. The value of `offset` will remain constant
 * as the mouse moves. The `closureValue` will start indentical to
 * the `value` stored in SliderContext, and then be manually
 * updated each time setValue() is called. This allows the closure
 * that is tracking the mouse to check if the value of the slider
 * has changed since the last `mousemove` event, so setValue()
 * will only be called when `value` changes.
 *
 * The left position of the thumb is calculated from the `value`
 * shared by the SliderContext.
 */


import { useState, useRef, useContext, useEffect } from 'react'
import { SliderContext } from "../contexts/SliderContext"


export const Slider = () => {
  const {
    maxValue,
    value,
    setValue
  } = useContext(SliderContext)

  // Used only once, in the initial useEffect
  const [ initialized, setInitialized ] = useState(false)

  const ref  = useRef() // DOM element then maxX integer
  const maxX = ref.current
  const left = maxX
             ? maxX * value / maxValue
             : 0


  // Styles for the slider and its thumb
  const sliderStyle = {
    "--size": "2rem",
    position: "relative",
    width: "320px",
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
    top: 0,
    // Interactive: uses left state variable
    left: `${left || 0}px`,
    // Hide if maxX is not yet set (before useEffect)
    opacity: `${initialized * 1}`,
  }


  const pStyle = {
    position: "relative",
    width: "calc(100% + 2.6667rem)",
    fontSize: "1.5rem",
    textAlign: "right",
    margin: 0,
    WebkitUserSelect: "none", /* Safari */
    userSelect: "none"
  }


  const startDrag = ({ pageX }) => {
    const offset = left - pageX // will remain constant in closure
    let closureValue = value    // can be updated in closure

    /**
     * drag() is triggered by mousemove events
     */
    const drag = ({ pageX }) => {
      let next = Math.max(0, Math.min(pageX + offset, maxX))

      // Calculate the current value
      const nextValue = Math.round((next / maxX) * maxValue)

      if (closureValue !== nextValue) {
        setValue(nextValue)
        // Update within the startDrag closure
        closureValue = nextValue
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
    const thumb = ref.current
    const slider = thumb.parentNode
    const sliderWidth = slider.clientWidth // without border

    // Re-use ref to hold the maxX value of the slider thumb
    const { width } = thumb.getBoundingClientRect()
    ref.current = sliderWidth - width

    // Force a re-render so that the thumb will appear
    setInitialized(true)
  }


  useEffect(initialize, [])


  return (
    <div
      className="slider"
      style={sliderStyle}
    >
      <p
        style={pStyle}
      >
        {value}
      </p>
      <div className="thumb"
        style={thumbStyle}
        ref={ref}
        onMouseDown={startDrag}
      />
    </div>
  )
}