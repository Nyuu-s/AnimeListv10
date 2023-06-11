
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Animes from './Pages/Animes'
function App() {
  return (
    <> 
      <Routes> 
        <Route path='/' element={<Home />}/>
        <Route path='/list' element={<Animes />}/>
      </Routes>
    </>
  )
}

export default App