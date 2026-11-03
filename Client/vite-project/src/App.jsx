import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import NotesPage from './pages/NotesPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/note" element={<NotesPage view="notes" />} />
        <Route path="/notes" element={<NotesPage view="notes" />} />
        <Route path="/archive" element={<NotesPage view="archive" />} />
        <Route path="/bin" element={<NotesPage view="bin" />} />
        <Route path="/reminders" element={<NotesPage view="reminders" />} />
        <Route path="/labels" element={<NotesPage view="labels" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
