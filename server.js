const express = require('express')
//const axios = require('axios')
const redis = require('redis')

const app = express();
const REDIS_PORT = 'redis://redis'

const client = redis.createClient();

client.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.log(err.message);
})

client.on('connect', () => { console.log(`Redis is connected on port ${REDIS_PORT}`);});

client.on('error', (error) => { console.log('Redis error' , error)});

function getRedisData() {
  client.get('counter', async (err, cache_data) => {
    if(cache_data) {
      return res.status(200).send({count: JSON.parse(cache_data)});
    } else {
      return res.status(200).send({error: 'Key doesnt exists'});
    }
  });
}

app.get('/api/v1/redis', (req, res) => {
  try {
    getRedisData();
  }
  catch(error) {
    console.log(error);
  }
});

app.listen(8080);
console.log('Running a API server at http://localhost:8080/api/v1/redis');
