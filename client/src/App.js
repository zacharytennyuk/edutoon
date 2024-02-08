import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoadingPage from './components/LoadingPage';
import DisplayPage from './components/DisplayPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/display" element={<DisplayPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
