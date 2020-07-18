
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from 'path';

export const app = express();

const ROOT = '../../controlpanel/build';


app.use(express.static(path.join(__dirname, ROOT)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, ROOT, 'index.html'));
});

