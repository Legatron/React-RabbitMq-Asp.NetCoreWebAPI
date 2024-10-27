import React from 'react';
import moment from 'moment';

interface WeatherForecastProps {
  data: any[];
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ data }) => {
  return (
    <div>
      <h2>Weather Forecast (dummy)</h2>
      {data.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {moment(item.date).format('DD.MM.YYYY')}: {item.summary}, Temperature:{item.temperatureC}°C
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeatherForecast;