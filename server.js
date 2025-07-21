require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const MONGO_URI = procces.env.MONGO_URI
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    minLength: 10
  },
  answers: {
    type: [String],
    required: true,
    validate: [
      (val) => val.length >= 2 && val.length <= 5,
      'A question must have between 2 and 5 answers.'
    ]
  },
  correctAnswer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  }
});

let questions = [];
let currentQuestion = 0;
let score = 0;

async function loadQuestions() {
  try {
    const res = await fetch('http://localhost:3000/api/questions');
    questions = await res.json();
    showQuestion();
  } catch (err) {
    console.error('Failed to load questions:', err);
  }
}


const Question = mongoose.model('Question', questionSchema);

async function seedDatabase() {
  try {
    const count = await Question.countDocuments();
    if (count > 0) {
      console.log('Database already seeded.');
      return;
    }
    console.log('No questions found. Seeding database...');
    const questionsToSeed = [
      {
        question: "Which planet is known as the Red Planet?",
        answers: ["Earth", "Mars", "Jupiter", "Venus"],
        correctAnswer: "Mars",
        difficulty: "Easy"
      },
      {
        question: "What is the largest ocean on Earth?",
        answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correctAnswer: "Pacific",
        difficulty: "Easy"
      },
      {
        question: "Who is the richest person as of 2025",
        answers: ["Elon Musk", "Mark Zuckerberg", "Mirania", "King of Uzbekistan"],
        correctAnswer: "King of Uzbekistan",
        difficulty: "Medium"
      },

      {
        question: "What is the capital city of Japan?",
        answers: ["Osaka", "Kyoto", "Tokyo", "Nagoya"],
        correctAnswer: "Tokyo",
        difficulty: "Easy"
      },
      {
        question: "Which planet is closest to the sun?",
        answers: ["Earth", "Venus", "Mercury", "Mars"],
        correctAnswer: "Mercury",
        difficulty: "Medium"
      },
      {
        question: "Who wrote 'Pride and Prejudice'?",
        answers: ["Emily Bronte", "Charlotte Bronte", "Jane Austen", "Mary Shelley"],
        correctAnswer: "Jane Austen",
        difficulty: "Medium"
      },
      {
        question: "Which element has the chemical symbol 'O'?",
        answers: ["Gold", "Oxygen", "Omnium", "Osmium"],
        correctAnswer: "Oxygen",
        difficulty: "Easy"
      },
      {
        question: "What is the largest mammal in the world?",
        answers: ["Elephant", "Blue Whale", "Hippopotamus", "Giraffe"],
        correctAnswer: "Blue Whale",
        difficulty: "Easy"
      },
      {
        question: "Who painted the Mona Lisa?",
        answers: ["Vincent Van Gogh", "Leonardo da Vinci", "Michelangelo", "Pablo Picasso"],
        correctAnswer: "Leonardo da Vinci",
        difficulty: "Medium"
      },
      {
        question: "What is the currency of France?",
        answers: ["Euro", "Franc", "Pound", "Dollar"],
        correctAnswer: "Euro",
        difficulty: "Easy"
      },
      {
        question: "Which gas do plants absorb for photosynthesis?",
        answers: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Methane"],
        correctAnswer: "Carbon Dioxide",
        difficulty: "Medium"
      },
      {
        question: "In which year did the Titanic sink?",
        answers: ["1912", "1911", "1920", "1915"],
        correctAnswer: "1912",
        difficulty: "Hard"
      },
      {
        question: "What is the main ingredient in sushi?",
        answers: ["Rice", "Bread", "Corn", "Wheat"],
        correctAnswer: "Rice",
        difficulty: "Easy"
      },
      {
        question: "Who discovered gravity?",
        answers: ["Albert Einstein", "Galileo Galilei", "Isaac Newton", "Charles Darwin"],
        correctAnswer: "Isaac Newton",
        difficulty: "Medium"
      },
      {
        question: "What is the longest river in the world?",
        answers: ["Amazon", "Nile", "Yangtze", "Mississippi"],
        correctAnswer: "Nile",
        difficulty: "Medium"
      },
      {
        question: "Which country hosted the 2020 Olympics?",
        answers: ["China", "Japan", "USA", "UK"],
        correctAnswer: "Japan",
        difficulty: "Medium"
      },
      {
        question: "What is the boiling point of water at sea level?",
        answers: ["100°C", "200°C", "150°C", "50°C"],
        correctAnswer: "100°C",
        difficulty: "Easy"
      },
      {
        question: "Who was the first president of the United States?",
        answers: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"],
        correctAnswer: "George Washington",
        difficulty: "Medium"
      },
      {
        question: "Which planet is known as the 'Red Planet'?",
        answers: ["Mars", "Jupiter", "Saturn", "Venus"],
        correctAnswer: "Mars",
        difficulty: "Easy"
      },
      {
        question: "What is the smallest prime number?",
        answers: ["1", "2", "3", "5"],
        correctAnswer: "2",
        difficulty: "Easy"
      },
      {
        question: "Who invented the telephone?",
        answers: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Marie Curie"],
        correctAnswer: "Alexander Graham Bell",
        difficulty: "Medium"
      },
      {
        question: "Which metal is liquid at room temperature?",
        answers: ["Mercury", "Silver", "Gold", "Iron"],
        correctAnswer: "Mercury",
        difficulty: "Medium"
      },
      {
        question: "Which continent is the largest in size?",
        answers: ["Africa", "Asia", "Europe", "North America"],
        correctAnswer: "Asia",
        difficulty: "Medium"
      }



    ];
    await Question.insertMany(questionsToSeed);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    seedDatabase();
  })
  .catch(err => console.error('Connection error', err));

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
});

app.post('/api/submit', (req, res) => {
  console.log('Received a Submission!');
  console.log(req.body);
  res.status(200).json({ message: "Submission received successfully" });
});

const PORT = 3000;
app.get('/', (req, res) => {
  res.send("Hello World! Our server is working");
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// function showQuestion() {
//   const q = questions[currentQuestion];
//   document.getElementById('question').textContent = q.question;

//   const answersDiv = document.getElementById('answers');
//   answersDiv.innerHTML = '';

//   q.answers.forEach((answer, index) => {
//     const button = document.createElement('button');
//     button.textContent = answer;
//     button.onclick = () => selectAnswer(index);

//   });
// }

// function selectAnswer(selectedIndex) {
//   const q = questions[currentQuestion];
//   if (selectedIndex === q.correct) {
//     score++;
//   }

//   currentQuestion++;

//   if (currentQuestion < questions.length) {
//     showQuestion();
//   } else {
//     finishQuiz();
//   }
// }


// function finishQuiz() {
//   clearInterval(timerInterval);
//   const timeTaken = Math.floor((Date.now() - startTime) / 1000);

//   document.getElementById('quiz').style.display = 'none';
//   document.getElementById('result').style.display = 'block';
//   document.getElementById('result').innerHTML = `
//         <h2>Quiz Complete!</h2>
//         <p>Score: ${score} out of ${questions.length}</p>
//         <p>Time: ${timeTaken} seconds</p>
//       `;
// }