import { useState, useEffect } from 'react';
//import axios from 'axios';
import api from './api';

/*function RabbitMQConsumer() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api.get('/weatherforecast/ConsumeMessage')
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>RabbitMQ Message</h2>
      {message !== null ? (
        <p>{message}</p>
      ) : (
        <p>No message available</p>
      )}
    </div>
  );
}*/
interface RabbitMQConsumerProps {
  data: string | null;
  showRabbitMQConsumer: boolean;
  onHide :  () => void;
}

const RabbitMQConsumer: React.FC<RabbitMQConsumerProps> = ({ data, showRabbitMQConsumer, onHide  }) => {
  const [hide, setHide] = useState(showRabbitMQConsumer);

  return (
    <div style={{ display: showRabbitMQConsumer  ? 'block' : 'none' }}>
      <h2>RabbitMQ Message</h2>
      {data !== null ? (
        <p>{data}</p>
      ) : (
        <p>No message available</p>
      )}
      <button onClick={onHide}>Close</button>
    </div>
  );
};

export default RabbitMQConsumer;