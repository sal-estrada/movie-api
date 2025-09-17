const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  morgan = require('morgan');

const app = express();


app.use(bodyParser.json());
app.use(morgan('common'));

let users = [
  { 
    id: 1,
    name: "Kia",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Joe",
    favoriteMovies: ["The Fountain"]
  }
]

let movies = [
  {
    'Title': 'Dune Part 1',
    "Description":"...",
    "Genre": {
      "Name": "Sci Fi",
    }
  },
  {
    'Title': 'Dune Part 2',
  },
  {
    'Title': 'Interstellar',
  },
  {
    'Title': 'Ghostbusters',
  },
  {
    'Title': 'Specter',
  },
  {
    'Title': 'Skyfall',
  },
  {
    'Title': 'Revenge of the Sith',
  },
  {
    'Title': 'A Quiet Place',
  },
  {
    'Title': 'Shrek',
  },
  {
    'Title': 'Mario',
  }
];

app.use(express.static('documentation'));

// READ MOVIES
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title );
  
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("No such movie. ")
  }
})

app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const movie = movies.find( movie => movie.Genre.Name === genreName ).Genre;
  
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("No such genre. ")
  }
})
  
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorNameName } = req.params;
  const movie = movies.find( movie => movie.Director.Name === directorName ).Director;
  
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("No such director. ")
  }
})

// CREATE 
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('Users need names.')
  }
})

app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).json(`${movieTitle} has been added to user ${id}'s array.`);
  } else {
    res.status(400).send('No such user.')
  }
})

// UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('No such user.')
  }
})

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle)
    res.status(200).json(`${movieTitle} has been removed from users ${id}'s array.`);
  } else {
    res.status(400).send('No such user.')
  }
})

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`User ${id} has been removed from the database.`);
  } else {
    res.status(400).send('No such user.')
  }
})

app.get('/', (req, res) => {
    res.send('Welcome to my movies!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

