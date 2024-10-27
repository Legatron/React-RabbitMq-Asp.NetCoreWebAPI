import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import RabbitMQConsumer from './RabbitMQConsumer'
import WeatherForecast from './WeatherForecast';
import api from './api';

interface AppProps {

}

interface AppState {
  count: number;
  data: any[];
  showRabbitMQConsumer: boolean;
  apiInProgress: boolean;
  apiRabbitMQData: any[];
  showMessageDiv: boolean;
}

function App({}: AppProps) {
  const [state, setState] = useState<AppState>({
    count: 0,
    data: [],
    showRabbitMQConsumer: false,
    apiInProgress: false,
    apiRabbitMQData: [],
    showMessageDiv: false,
  });
  
  const hasRun = useRef(false)
  const fetchWeatherData = async () => {
    try {
      const response = await api.get('/weatherforecast/', { withCredentials: false });
      setState(prevState => ({ ...prevState, data: response.data }));
    } catch (error) {
      console.error(error);
    }
  };

  const consumeRabbitMQMessages = async () => {
    try {
      const response = await api.get('/weatherforecast/ConsumeMessage');
      setState(prevState => ({ ...prevState, apiRabbitMQData: [...prevState.apiRabbitMQData, ...response.data] }));
    } catch (error) {
      console.error(error);
    } finally {
      setState(prevState => ({ ...prevState, apiInProgress: false }));
    }
  };

  useEffect(() => {
    if (!hasRun.current) {
    fetchWeatherData();
    hasRun.current = true;
  }
  }, []);

  useEffect(() => {
    if (state.showRabbitMQConsumer) {
      setState(prevState => ({ ...prevState, apiInProgress: true }));
      consumeRabbitMQMessages();
    }
  }, [state.showRabbitMQConsumer]);

  const handleButtonClick = () => {
    setState(prevState => ({ ...prevState, count: prevState.count + 1, showRabbitMQConsumer: true, showMessageDiv: true }));
  };

  const onHide = () => {
    setState(prevState => ({ ...prevState, showRabbitMQConsumer: false, apiRabbitMQData: [] }));
  };

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
        <WeatherForecast data={state.data} />
      </div>

  <div className={`card ${state.showMessageDiv ? 'show-message' : ''}`}>
    <button className="btnCountShowRabbitMQConsumedMessage" onClick={handleButtonClick} disabled={state.showRabbitMQConsumer}>
      show previous {state.count}
    </button>

    <div className="RabbitMQConsumedMessage">
      {state.showRabbitMQConsumer && (
        <RabbitMQConsumer data={state.apiRabbitMQData} showRabbitMQConsumer={state.showRabbitMQConsumer} onHide={onHide} />
      )}
    </div>
  </div>
      
    </>
  )
}

export default App
