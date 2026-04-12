import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results'; // Import the new page!

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* This route captures whatever keyword is typed or clicked */}
        <Route path="/search/:keyword" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;