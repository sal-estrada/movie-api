const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies = [
  {
    title: 'Dune Part 1',
  },
  {
    title: 'Dune Part 2',
  },
  {
    title: 'Interstellar',
  },
  {
    title: 'Ghostbusters',
  },
  {
    title: 'Specter',
  },
  {
    title: 'Skyfall',
  },
  {
    title: 'Revenge of the Sith',
  },
  {
    title: 'A Quiet Place',
  },
  {
    title: 'Shrek',
  },
  {
    title: 'Mario',
  }
];

app.use(express.static('documentation'));

app.get('/movies', (req, res) => {
    res.json(topMovies);
});
  
app.get('/', (req, res) => {
    res.send('Welcome to my top 10 movies!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });