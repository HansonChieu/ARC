require('dotenv').config();
const { OpenAI } = require('openai');
const express = require('express'); // "require" the Express module
const path = require('path');
const app = express(); // obtain the "app" object
const cors =require('cors');

app.use(cors()); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('public', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY,  dangerouslyAllowBrowser: true });


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html')); // Serve home.html directly
});

app.get('/workouts', (req, res) => {
  res.render('workouts');
});

app.post('/api/chat', async (req, res) => {
  const { sex, age, experience, goal } = req.body;

  // Construct the prompt for OpenAI
  const prompt = `I am in the process of wanting to start my fitness journey. I am ${sex}, 
  ${age} years old, and my experience level with working out is ${experience}. 
  My fitness goal is to ${goal}.  

  Create a personalized workout routine for me that includes:  
  - Workout name
  - Brief description and what to expect for the workout  
  For each exercise list out:
  - Exercise name    
  - Number of sets and reps  
  - Brief instructions
  At the end, display the total time it should take to complete and a 
  fitness motivation quote.

  
  `;

  try {
    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use a valid model name
      messages: [
        { role: 'system', content: 'You are a personal trainer' },
        { role: 'user', content: prompt },
      ],
    });

    // Extract the generated workout
    const answer = completion.choices[0].message.content;
    res.json({ answer }); // Send the response back to the frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

const HTTP_PORT = process.env.PORT || 8080; // assign a port
// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
