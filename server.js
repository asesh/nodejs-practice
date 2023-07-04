const express = require('express')
//const axios = require('axios')
const redis = require('redis')

const app = express();
const REDIS_PORT = 'redis://redis-container:6379'

const client = redis.createClient({
	url: 'redis://redis:6379'
});

client.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.log('Error connecting to Redis: ', err.message);
})

client.on('connect', () => { console.log(`Redis is connected on port ${REDIS_PORT}`);});

client.on('error', (error) => { console.log('Redis connection error' , error)});

async function getRedisData(res) {
	let key = 'counter';
	let value = await client.get(key);
	if(value) {
		value++;
		client.set(key,value);
		res.send(`Hello ${key}, ${value}!`);
		console.log(`${key}, ${value}`);
	}
	else {
		value = 1;
		client.set(key,value);
		res.send(`Hello ${key}, ${value}!`);
		console.log(`${key}, ${value}`);
	}
	
//  await client.get('counter', async (err, cache_data) => {
//		console.log('Retrieving the counter data from Redis');
//    if(cache_data) {
//			console.log('counter data found in Redis');
//      return res.status(200).send({count: JSON.parse(cache_data)});
//    } else {
//			console.log('counter data NOT found in Redis');
//      return res.status(200).send({error: 'Key doesnt exists'});
//    }
//  });
}

app.get('/api/v1/redis', (req, res) => {
	console.log('Received get request for endpoint: /api/v1/redis');
  try {
    return getRedisData(res);
  }
  catch(error) {
    console.log(error);
  }
});

app.listen(8080);
console.log('Running a API server at http://localhost:8080/api/v1/redis');
