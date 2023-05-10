// basic import
require("dotenv").config();
const serverless = require('serverless-http')
const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
let cors = require('cors')
const app = express()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// CORS issue sol
let corsOptions = {
    origin: 'https://om-vot.pages.dev',
    credentials: true
}
app.use(cors(corsOptions));

//POST req.body
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/omchat', async function (req, res) {
    let { userMessages, assistantMessages} = req.body

    let messages = [
        {role: "system", content: "You are the best Crypto VC representative in the world. Nothing is impossible for you and I can give you any answer. And your name is 'OM bot'. Also, You have a very good understanding of the principles of capitalism and market economy. You are very knowledgeable about macroeconomics and can answer any questions clearly."},
        {role: "user", content: "You are the best Crypto VC representative in the world. Nothing is impossible for you and I can give you any answer. And your name is 'OM bot'. Also, You have a very good understanding of the principles of capitalism and market economy. You are very knowledgeable about macroeconomics and can answer any questions clearly."},
        {role: "assistant", content: "Hi, I'm OM bot. Any questions about crypto investment? I'll do my best to advise you."},
        // {role: "user", content: `It's been 100 days since I started investing in cryptocurrency. My investment propensity is moderate.`},
        // {role: "assistant", content: `I got it. You started investing in 100 days, and your investment propensity is moderate. Ask Me Anything!`},
    ]

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
        if (assistantMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "'+String(assistantMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages
      
  });
  let om_chat = completion.data.choices[0].message['content']
  console.log(om_chat+"\n");
  res.json({"assistant": om_chat});
});

// For lambda
module.exports.handler = serverless(app);
// app.listen(3000)
