import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Directory from './pages/Directory.jsx'
import Admin from './pages/Admin.jsx'
import Login from './pages/Login.jsx'
import SubmitEvent from './pages/SubmitEvent.jsx'
import Submissions from './pages/Submissions.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Directory />} />
        <Route path="/submit" element={<SubmitEvent />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/submissions" element={<Submissions />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
