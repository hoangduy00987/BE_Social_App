import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function sendTestEvent() {
  await producer.connect();
  
  const event = {
    eventId: 'test-' + Date.now(),
    eventType: 'post.comment-created.v1',
    occurredAt: new Date().toISOString(),
    actor: { userId: 'u123', username: 'alice' },
    target: { 
      postId: 'p789', 
      commentId: 'c456', 
      ownerUserId: 'PAL69Ba5BBWi9dggeGaxlGvgAgt1' // Người sẽ nhận notification
    },
    context: { snippet: 'Test socket IO' },
    traceId: 'trace-abc'
  };

  await producer.send({
    topic: 'post.comment-created.v1',
    messages: [{
      key: 'test-key',
      value: JSON.stringify(event)
    }]
  });

  console.log('Event sent:', event);
  await producer.disconnect();
}

sendTestEvent().catch(console.error);