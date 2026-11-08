import React, { useContext } from 'react'
import { Routes , Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import { userDataContext } from './components/UserContext'
import Customize from './pages/Customize'
import Loading from './components/Loading'

function App() {

  const {user , loading} = useContext(userDataContext)

  if (loading) {
  return <Loading />
}
  return (
    <Routes>
    <Route
      path="/"
      element={user ? <Home /> : <Navigate to="/signup" replace />}
    />

    <Route
      path="/signup"
      element={!user ? <Signup /> : <Navigate to="/" replace />}
    />

    <Route
      path="/signin"
      element={!user ? <SignIn /> : <Navigate to="/" replace />}
    />

    <Route
      path="/customized"
      element={user ? <Customize /> : <Navigate to="/signin" replace />}
    />
  </Routes>
  )
}

export default App