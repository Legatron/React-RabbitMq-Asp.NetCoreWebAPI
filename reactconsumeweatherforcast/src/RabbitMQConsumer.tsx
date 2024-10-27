//import axios from 'axios';
import moment from 'moment';

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
  //data: string | null;
  data: any[];
  showRabbitMQConsumer: boolean;
  onHide :  () => void;
}

const RabbitMQConsumer: React.FC<RabbitMQConsumerProps> = ({ data, showRabbitMQConsumer, onHide  }) => {

  return (
    <div style={{ display: showRabbitMQConsumer  ? 'block' : 'none' }}>
      <h3>RabbitMQ Message</h3>
      {data.length>0 ? (
        //<p>{data}</p>
        <ul>
        {data.map((item, index) => (
          
             <li key={index}> {moment(item.date).format('DD.MM.YYYY')}: {item.Summary},  Temperature: {item.TemperatureC}°C</li>
          
        ))}
        </ul>
      ) : (
        <p>No message available</p>
      )}
      <button onClick={onHide}>Close</button>
    </div>
  );
};

export default RabbitMQConsumer;