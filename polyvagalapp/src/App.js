import './App.css';
import Navbar from './components/Navbar';
import NavigateButton from './components/NavigateButton';

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <div className="calibrate">
        <NavigateButton></NavigateButton>
      </div>
    </div>
  );
}



export default App;
