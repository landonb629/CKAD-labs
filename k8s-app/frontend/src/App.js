import {useState} from 'react'
import './App.css';

function App() {

  const [data, setData] = useState('')
  const getData = async () => { 
    console.log('getting')
    const data = await fetch('http://localhost:3032/api/v1/get')
    const response = await data.json();
    const {msg} = response
    setData(msg)
  }
  return (
    <div className="App">
      <button onClick={getData}>get data</button> 
      <p>{data}</p>
    </div>
  );
}

export default App;
