import { jest } from '@jest/globals';

describe('Kafka Configuration', () => {
  it('should export TOPIC constant', async () => {
    const { TOPIC } = await import('../src/config/kafka.config.js');
    expect(TOPIC).toBeDefined();
    expect(typeof TOPIC).toBe('string');
    expect(TOPIC).toBe('chat-message');
  });

  it('should export GROUP_ID constant', async () => {
    const { GROUP_ID } = await import('../src/config/kafka.config.js');
    expect(GROUP_ID).toBeDefined();
    expect(typeof GROUP_ID).toBe('string');
    expect(GROUP_ID).toBe('chat-group');
  });

  it('should export kafka instance', async () => {
    const { default: kafka } = await import('../src/config/kafka.config.js');
    expect(kafka).toBeDefined();
    expect(typeof kafka.producer).toBe('function');
    expect(typeof kafka.consumer).toBe('function');
  });

  it('producer should use correct topic', async () => {
    jest.resetModules();

    const mockProducer = {
      connect: jest.fn(),
      send: jest.fn(),
      disconnect: jest.fn(),
    };

    await jest.unstable_mockModule('../src/config/kafka.config.js', () => ({
      __esModule: true,
      default: {
        producer: jest.fn(() => mockProducer),
      },
      TOPIC: 'chat-message',
      GROUP_ID: 'chat-group',
    }));

    const { connectProducer, sendToKafka, disconnectProducer } = await import('../src/kafka/producer.js');

    await connectProducer();
    await sendToKafka({ msg: 'test', to: 'user123', senderId: 'user456' });
    expect(mockProducer.send).toHaveBeenCalledWith({
      topic: 'chat-message',
      messages: [{ key: 'chat', value: JSON.stringify({ msg: 'test', to: 'user123', senderId: 'user456' }) }],
    });
    await disconnectProducer();
  });

  it('consumer should subscribe to correct topic', async () => {
    jest.resetModules();

    const mockConsumer = {
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
    };

    await jest.unstable_mockModule('../src/config/kafka.config.js', () => ({
      __esModule: true,
      default: {
        consumer: jest.fn(() => mockConsumer),
      },
      TOPIC: 'chat-message',
      GROUP_ID: 'chat-group',
    }));

    await jest.unstable_mockModule('ioredis', () => ({
      __esModule: true,
      default: class MockRedis {
        constructor() {
          this.set = async () => 'OK';
          this.get = async () => null;
          this.del = async () => 1;
        }
      },
    }));

    const { kafkaConsumer } = await import('../src/kafka/consumer.js');
    await kafkaConsumer({ on: jest.fn() });
    expect(mockConsumer.subscribe).toHaveBeenCalledWith({
      topic: 'chat-message',
      fromBeginning: false,
    });
  });
});
