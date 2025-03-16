import { Routes, Route } from 'react-router-dom'
import BroadcastPage from './components/BroadcastPage'
import HomePage from './components/HomePage'

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:txData" element={<BroadcastPage />} />
      </Routes>
      <footer className="footer">
        <p>Airgapped Transaction Broadcaster - Secure Offline Signing</p>
      </footer>
    </div>
  )
}

export default App 