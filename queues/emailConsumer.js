const { Worker } = require("bullmq");


async function mockSendEmail(payload) {
    const { from, to, subject, body } = payload;
    return new Promise((resolve, reject) => {
      console.log(`Sending Email to ${to}.... with ${subject}`);
      setTimeout(() => resolve(1), 2 * 1000);
    });
  }

 const emailWorker = new Worker('email_queue', async (job) => {
    const data = job.data;
    console.log(data)
    await mockSendEmail({
        from: data.from,
        to: data.to,
        subject: data.subject,
        body: data.body
    })
},
    {
        connection: {
            host: process.env.HOST,
            port: 14879,
            username: process.env.USERNAME,
            password: process.env.PASSWORD,
        },
    
    limiter: {
        max: 50,
        duration: 10 * 1000
    }
},
)

module.exports = emailWorker