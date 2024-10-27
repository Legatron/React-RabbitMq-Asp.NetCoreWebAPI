import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import axios from 'axios'
import RabbitMQConsumer from './RabbitMQConsumer'
import WeatherForecast from './WeatherForecast';
import api from './api';

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState<any[]>([])
  const hasRun = useRef(false)
  const [showRabbitMQConsumer, setShowRabbitMQConsumer] = useState(false)
 
  const [apiInProgress, setApiInProgress] = useState(false);
  const [apiRabbitMQData, setApiRabbitMQData] = useState<any[]>([]);
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
    //clear consumed RabbitMq data
    setApiRabbitMQData([]);
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
         api.get('/weatherforecast/ConsumeMessage')
        .then(response=> {
          const newMQData = [...(apiRabbitMQData ?? []), ...(response.data ?? [])];
          setApiRabbitMQData(newMQData);
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
          <h1>Vite + React</h1>   
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <div>
        <WeatherForecast data={data} />
      </div>

      <div className="card">
        <button className="btnCountShowRabbitMQConsumedMessage" 
            onClick={handleButtonClick}
            disabled={showRabbitMQConsumer}>
              show previous {count}
        </button>

        <div className="RabbitMQConsumedMessage" style={{ display: showMessageDiv }}> 
        {
          true && <RabbitMQConsumer data={apiRabbitMQData} showRabbitMQConsumer={showRabbitMQConsumer} onHide={onHide}/>
        }
        </div>
      </div>
      
    </>
  )
}

export default App
