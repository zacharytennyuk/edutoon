import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import './styles.css';
import HomePage from './components/HomePage';
import DisplayPage from './components/DisplayPage';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/display" element={<DisplayPage />} />
        </Routes>
      </div>
    </Router>
  ); 
}
