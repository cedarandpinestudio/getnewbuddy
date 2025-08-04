import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Navbar from "./Navbar.jsx"
import BookingPage from './BookingPage.jsx'
import ItinerariesPage from './ItinerariesPage.jsx'
import CancelPage from './CancelPage.jsx'
import ScrollToTop from "./ScrollToTop";

import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/itineraries" element={<ItinerariesPage />} />
        <Route path="/cancel" element={<CancelPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
