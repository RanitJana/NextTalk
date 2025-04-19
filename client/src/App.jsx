import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SignUp from './pages/signup';

function App() {
  const authUser = 1;
  return (
    <>
           <Routes>
        <Route path="/" element={authUser ? <SignUp /> : <Navigate to="login" />} />
        
      </Routes>

    </>
  )
}

export default App
