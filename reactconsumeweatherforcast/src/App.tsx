import { useCallback, useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import RabbitMQConsumer from './RabbitMQConsumer'
import WeatherForecast from './WeatherForecast';
import api from './api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AppProps {

}

interface AppState {
  count: number;
  data: any[];
  showRabbitMQConsumer: boolean;
  apiInProgress: boolean;
  apiRabbitMQData: any[];
  showMessageDiv: boolean;
  token: string;
}

function App({}: AppProps) {
  const [state, setState] = useState<AppState>({
    count: 0,
    data: [],
    showRabbitMQConsumer: false,
    apiInProgress: false,
    apiRabbitMQData: [],
    showMessageDiv: false,
    token: ''
  });
  
  const hasRun = useRef(false)

  /*const fetchToken = async () => {
    try {
      const response = await api.post('/gettoken/', {
        username: 'your_username',
        password: 'your_password',
      });
      const token = response.data;
      localStorage.setItem('token', token);
      setState(prevState => ({ ...prevState, token: response.data }));
      toast.success('Token fetched successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error fetching token');
    }
  };
*/
  const fetchWeatherData = async () => {
    try {
      const response = await api.get('/weatherforecast');
      setState(prevState => ({ ...prevState, data: response.data }));
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while fetching weather data');
    }
  };

  const consumeRabbitMQMessages = async () => {
    try {
      const response = await api.get('/weatherforecast/ConsumeMessage');
      setState(prevState => ({ ...prevState, apiRabbitMQData: [...prevState.apiRabbitMQData, ...response.data] }));
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while fetching consume RabbitMQ messages');
    } finally {
      setState(prevState => ({ ...prevState, apiInProgress: false }));
    }
  };

  const init = useCallback(async () => {
    //await fetchToken();
    await fetchWeatherData();
  }, []);
  
  useEffect(() => {
    if (!hasRun.current) {
      init();
      hasRun.current = true;
    }
  }, [init]);

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
    <div>
      <ToastContainer />
    </div>
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
      Show previous forecast - clicked {state.count}  {state.count === 1 ? 'time' : 'times'}
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
