import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import userRoutes from './routes/users.js'
import questionRoutes from './routes/Questions.js'
import answerRoutes from './routes/Answers.js'
import { Configuration, OpenAIApi } from 'openai';
import bodyparser from 'body-parser';


const configuration = new Configuration({
    organization: "org-eMpRfwAD3OY5WnJHSdREeNgI",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const app = express();
dotenv.config();
app.use(express.json({limit: "30mb",extended:true}))
app.use(express.urlencoded({limit:"30mb", extended : true}))
app.use(cors());
app.use(bodyparser.json())
app.get('/', (req, res) => {
  res.send("This is a stack overflow clone API");
});
  app.post('/', async (req,res)=>{
    const { message }= req.body;
    console.log(message, "message")




    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `$(message)`,
        max_tokens: 100,
        temperature: 0.5,
      });
      res.json({
        message: response.data.choices[0].text,
      })

    });
   app.get('/models', async (req, res) => {
    const response = await openai.listModels();
    res.json({
      message: response.data,
    });
  });
  

app.use('/user',userRoutes)
app.use('/questions',questionRoutes)
app.use('/answer',answerRoutes)

const PORT=process.env.PORT || 5000

  mongoose.connect(process.env.CONNECTION_URL,{ useNewUrlParser: true, useUnifiedTopology : true})

    .then(()=>app.listen(PORT, ()=>{console.log(`server running on port ${PORT}`)}))
    .catch((err)=>console.log(err.message))



