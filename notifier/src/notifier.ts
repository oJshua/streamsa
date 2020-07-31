
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';

export const app = express();

const token = 'B~kw>mhmFT=hSLb!Kr(8lmXknS?~NTa??ABM3OxC+NQU/"6f/#O5;2*y:h8#8rN';

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('hello');
});

app.get('/webhook', (req, res) => {
  res.send(req.query['hub.challenge']);
});

app.post('/webhook', (req, res) => {
  console.log('Saving mention metric from:');
  console.log(JSON.stringify(req.body));
  res.send(req.body);
});
