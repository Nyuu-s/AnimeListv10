
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Animes from './Pages/Animes'
import Custom404 from './Pages/404'
function App() {
  return (
    <> 
      <Routes> 
        <Route path='/' element={<Home />}/>
        <Route path='/list' element={<Animes />}/>
        <Route path="*" element={<Custom404 />} />
      </Routes>
    </>
  )
}

export default App