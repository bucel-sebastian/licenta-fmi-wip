import { Kafka, logLevel } from "kafkajs";

class KafkaConfig {
  constructor() {
    this.kafka = new Kafka({
      clientId: "kafka-broker",
      brokers: ["kafka-service.kafka.svc.cluster.local:9092"],
      // logLevel: logLevel.DEBUG,
    });

    const { Partitioners } = require("kafkajs");

    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    this.admin = this.kafka.admin();
    this.topics = this.getTopics();
    console.log(this.topics);
  }

  async getTopics() {
    try {
      await this.admin.connect();

      const topics = await this.admin.listTopics();
      return await topics;
    } catch (error) {
      console.error(error);
    } finally {
      await this.admin.disconnect();
    }
  }

  async produce(topic, messages) {
    try {
      await this.producer.connect();

      await this.producer.send({
        topic: topic,
        messages: messages,
      });
    } catch (error) {
      console.error(error);
    } finally {
      await this.producer.disconnect();
    }
  }
}

export default KafkaConfig;
