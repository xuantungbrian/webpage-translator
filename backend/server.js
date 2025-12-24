import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import translatorRoute from './src/api/translatorRoute.js'; 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/translator', translatorRoute);

app.listen(PORT, () => {
    console.log(`Server launched on http://localhost:${PORT}`);
});