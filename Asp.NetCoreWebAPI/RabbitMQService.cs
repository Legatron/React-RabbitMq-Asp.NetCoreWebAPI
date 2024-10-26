
using RabbitMQ.Client;
using System;
using System.Data.Common;
using System.Text;
using System.Threading.Channels;

namespace Asp.NetCoreWebAPI
{
    public class RabbitMQService
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        public RabbitMQService()
        {
            var factory = new ConnectionFactory
            {
                HostName = "localhost",
                Port = 5672,
                VirtualHost = "/",
                UserName = "guest",
                Password = "guest"
            };

            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();
        }

        public void SendMessage(string message)
        {
            _channel.QueueDeclare(queue: "my_queue", durable: false, exclusive: false, autoDelete: false, arguments: null);
            var body = System.Text.Encoding.UTF8.GetBytes(message);
            _channel.BasicPublish(exchange: "", routingKey: "my_queue", basicProperties: null, body: body);
        }
        public string ConsumeMessage()
        {
            _channel.QueueDeclare(queue: "my_queue", durable: false, exclusive: false, autoDelete: false, arguments: null);

            var result = _channel.BasicGet(queue: "my_queue", autoAck: true);
            if (result != null)
            {
                var body = result.Body.ToArray();
                var message = System.Text.Encoding.UTF8.GetString(body);
                return message;
            }
            else
            {
                return null;
            }
        }
    }
}
