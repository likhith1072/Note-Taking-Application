import { BrowserRouter ,Routes,Route} from 'react-router-dom'

import Home from './pages/Home.tsx'
import SignIn from './pages/SignIn.tsx'
import SignUp from './pages/SignUp.tsx'
import { ToastContainer} from 'react-toastify';
import { AuthRedirect } from "./AuthRedirect.tsx";
import CreateNote from './pages/CreateNote.tsx';
import NotePage from './pages/NotePage.tsx';
import { Authenticate } from './Authenticate.tsx';



export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />    
      <Routes>
        <Route path="/" element={<Home />} />
         <Route element={<AuthRedirect />}>
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
  </Route>
   <Route element={<Authenticate />}>
   <Route path="/createNote" element={<CreateNote />} />
    <Route path="/note/:id" element={<NotePage />} />
    </Route>
      </Routes>
    </BrowserRouter>
  )
}
