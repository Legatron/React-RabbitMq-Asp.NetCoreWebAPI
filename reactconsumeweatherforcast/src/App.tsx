import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import axios from 'axios'
import RabbitMQConsumer from './RabbitMQConsumer'
import api from './api';
import React from 'react'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState([])
  const hasRun = useRef(false)
  const [showRabbitMQConsumer, setShowRabbitMQConsumer] = useState(false)
  const MemoizedRabbitMQConsumer = React.memo(RabbitMQConsumer);
  let debounceTimeout = null;
  const [apiInProgress, setApiInProgress] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [showMessageDiv, setMessageDiv] = useState("none");

  useEffect(() => {
    if (!hasRun.current) {
      api.get('/weatherforecast/', { withCredentials: false })
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
      hasRun.current = true;
    }
  }, []);
  const onHide = () => {
    setShowRabbitMQConsumer(false);
  };
  const handleButtonClick = () => {
    setCount((count) => count + 1);
    if (!apiInProgress) {
      setApiInProgress(true);
      setShowRabbitMQConsumer(true);
      setMessageDiv ("block");
    }
  };
  useEffect(() => {
    if (showRabbitMQConsumer) {
      // Make the API call here
        api.get('/weatherforecast/ConsumeMessage')
        .then(response=> {
          setApiData(response.data);
          setApiInProgress(false);
        })
        .catch(error => {
          console.error(error);
          setApiInProgress(false);
        })
        .finally(() => {
          setApiInProgress(false);
        });
        return () => {
          setApiInProgress(false);
        };
    }
  }, [showRabbitMQConsumer]);

  return (
    <>
     <div>
      <h1>Weather Forecast</h1>
      {data.length==0 ?(<div> Loading...</div>):"" } 
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.summary}</li>
        ))}
      </ul>
    </div>
    
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleButtonClick}>
          count is {count}
          
        </button>
        <div style={{ display: showMessageDiv }}> 
        {
          true && <RabbitMQConsumer data={apiData} showRabbitMQConsumer={showRabbitMQConsumer} onHide={onHide}/>
        }
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
