import { BrowserRouter ,Routes,Route} from 'react-router-dom'

import Home from './pages/Home.tsx'
import SignIn from './pages/SignIn.tsx'
import SignUp from './pages/SignUp.tsx'
import { ToastContainer} from 'react-toastify';



export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}
