import kafka, { TOPIC, GROUP_ID } from '../src/config/kafka.config.js';

describe('Kafka Configuration', () => {
  it('should export TOPIC constant', () => {
    expect(TOPIC).toBeDefined();
    expect(typeof TOPIC).toBe('string');
  });

  it('should export GROUP_ID constant', () => {
    expect(GROUP_ID).toBeDefined();
    expect(typeof GROUP_ID).toBe('string');
  });

  it('should export kafka instance', () => {
    expect(kafka).toBeDefined();
    expect(kafka.clientId).toBeDefined();
    expect(kafka.brokers).toBeDefined();
  });

  it('should have valid TOPIC default', () => {
    expect(TOPIC).toBe('chat-message');
  });

  it('should have valid GROUP_ID default', () => {
    expect(GROUP_ID).toBe('chat-group');
  });

  it('producer should use correct topic', async () => {
    const { connectProducer, sendToKafka, disconnectProducer } = await import('../src/kafka/producer.js');

    const mockProducer = {
      connect: jest.fn(),
      send: jest.fn(),
      disconnect: jest.fn(),
    };

    const mockKafka = {
      producer: jest.fn(() => mockProducer),
    };

    jest.doMock('../src/config/kafka.config.js', () => ({
      __esModule: true,
      default: mockKafka,
      TOPIC: 'chat-message',
    }));

    await connectProducer();
    await sendToKafka({ msg: 'test', to: 'user123', senderId: 'user456' });
    expect(mockProducer.send).toHaveBeenCalledWith({
      topic: 'chat-message',
      messages: [{ key: 'chat', value: JSON.stringify({ msg: 'test', to: 'user123', senderId: 'user456' }) }],
    });
    await disconnectProducer();
  });

  it('consumer should subscribe to correct topic', async () => {
    const mockConsumer = {
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
    };

    const mockKafka = {
      consumer: jest.fn(() => mockConsumer),
    };

    jest.doMock('../src/config/kafka.config.js', () => ({
      __esModule: true,
      default: mockKafka,
      TOPIC: 'chat-message',
      GROUP_ID: 'chat-group',
    }));

    const { kafkaConsumer } = await import('../src/kafka/consumer.js');
    await kafkaConsumer({ on: jest.fn() });
    expect(mockConsumer.subscribe).toHaveBeenCalledWith({
      topic: 'chat-message',
      fromBeginning: false,
    });
  });
});
