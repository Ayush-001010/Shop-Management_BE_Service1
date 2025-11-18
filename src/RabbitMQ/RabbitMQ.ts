import amqplib from "amqplib";

const storeNotificationOnRabbitMQ = async (obj: { Message: string, By: string, Reciver: string, Type: "Chat" }) => {
    try {
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchangeName = "Notification_Exchange";
        const routingKey = "Notification_Queue_Key";
        const queueName = "Notification_Queue";

        await channel.assertExchange(exchangeName, "direct", {
            durable: false
        }); // creating Exchange
        await channel.assertQueue(queueName, {
            durable: false
        }); // creating Queue

        // bind exchange & queue
        await channel.bindQueue(queueName, exchangeName, routingKey);

        // store data on queue
        await channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(obj)));

        console.log("Okey All Done !!");
    } catch (error) {
        console.log("Error  ", error);
    }
};

export default storeNotificationOnRabbitMQ;