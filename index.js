const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  Models = require('./models'),
  { check, validationResult} = require('express-validator');

const app = express(),
  Movies = Models.Movie,
  Users = Models.User;

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: true}));

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com']

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// mongoose.connect('mongodb://localhost:27017/mfDB', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('documentation'));

// DEFAULT
app.get('/', (req, res) => {
    res.send('Welcome to my movies!');
});


// READ ALL MOVIES
app.get('/movies', passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// READ MOVIE BY TITLE
app.get('/movies/:title', passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      if(!movie) {
        return res.status(404).send("No such movie.");
      }
      res.status(200).json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// READ MOVIES BASED ON GENRE
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Movies.find( { "Genre.Name": req.params.genreName})
    .then((movies) => {
      res.status(200).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(404).send('Error: ' + err);
  });
});

// RETURN DATA ABOUT DIRECTOR
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Movies.find( { "Director.Name": req.params.directorName}, { "Director": 1})
    .then((movies) => {
      res.status(200).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(404).send('Error: ' + err);
  });
});

// READ USERS 
app.get('/users', passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//READ INDIVUAL USER
app.get('/users/:username',  passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => { 
      console.error(err);
      res.status(500).send('Error: ' + err);
 });
});

// CREATE USERS
app.post('/users', [check('username', 'Username is required.').isLength({min:5}), 
  check('username','Only alphanumeric values are allowed.').isAlphanumeric(),
  check('password', 'Password is required.').not().isEmpty(),
  check('email', 'Email is not valid.').isEmail()], async (req, res) => {

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    let hashPassword = Users.hashPassword(req.body.password);
 
    await Users.findOne({ username: req.body.username})
    .then((user) => {
      if (user) {
        return res.status(400).json({error: `${req.body.username} + already exists`});
      } else {
        Users
          .create({
            username: req.body.username,
            password: hashPassword,
            email: req.body.email,
            birthday: req.body.birthday,
            firstName: req.body.firstName,
            lastName: req.body.lastName
          })
          .then((user) => {res.status(201).json(user) })
        .catch((error) => {
          console.error(err);
          res.status(500).send('Error: ' + error);
        })
      }
    })
.catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + err);
  });
});

//UPDATE USERS
app.put('/users/:username', [check('username', 'Username is required.').isLength({min:5}), 
  check('username','Only alphanumeric values are allowed.').isAlphanumeric(),
  check('password', 'Password is required.').not().isEmpty(),
  check('email', 'Email is not valid.').isEmail()], passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.username !== req.params.username) {
      return res.status(400).send('Permission denied.');
  }

  await Users.findOneAndUpdate({ username: req.params.username}, { $set:
    {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      birthday: req.body.birthday,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }
  },
{ new: true}) // <-- to make sure updated data is returned and not the old one
.then((updatedUser) => {
  res.json(updatedUser);
})
.catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + error);
  })
});

// ADD FAVORITE MOVIE TO USER LIST 
app.post('/users/:username/movies/:moviesID', passport.authenticate('jwt', { session: false}),  async (req, res) => {
  await Users.findOneAndUpdate({ username: req.params.username }, {
    $push: { favoriteMovieIds: new mongoose.Types.ObjectId(req.params.moviesID) }
  },
  { new: true })
  .then((updatedUser) => {
    if (!updatedUser) {
      return res.status(404).send("User not found.");
    }
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(404).send('Error: ' + err);
  });
});

// REMOVE FAVORITE MOVIE FROM USER LIST 
app.delete('/users/:username/movies/:moviesID', passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Users.findOneAndUpdate({ username: req.params.username }, {
    $pull: { favoriteMovieIds: new mongoose.Types.ObjectId(req.params.moviesID) }
  },
  { new: true })
  .then((updatedUser) => {
    if (!updatedUser) {
      return res.status(404).send("User not found.");
    }
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(404).send('Error: ' + err);
  });
});

// DELETE BY USERNAME
app.delete('/users/:username', passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Users.findOneAndDelete({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found.');
      } else {
        res.status(200).send(req.params.username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Your app is listening on port' + port);
});