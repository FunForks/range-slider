/**
 * App.jsx
 */

import { SliderProvider } from './contexts/SliderContext'
import { Header } from './components/Header'
import { Slider } from './components/Slider'

function App() {

  return (
    <SliderProvider>
      <Header />
      <Slider />
      <hr />
      <a
        href="https://github.com/FunForks/react-slider"
      >
        GitHub Repository
      </a>
    </SliderProvider>
  );
}

export default App;
