// Daniel Benitez Section 85 PD 7/8 Even
/**
 * 1) With this program I have created a useful communication between the FrontEnd (Web API and Such) and the Backend (The Arrays and Route Code). Such that, from the frontend 
 * it is possible to edit basically anything about the Song List in this project. 
 * 
 * To summarize the purpose of this program: This code allows us to store and alter data about musical pieces
 *    The GET request and route allows the displaying of a specific song based on a specified ID or all the songs. 
 *    The PUT request allows the altering of existing song data within the music list.
 *    The POST request allows the adding new data to the said existing data. 
 *    The DELETE request allows the deletion of
 *    an existing song from the data.
 * 2) Really what this project taught me is what an API TRULY is. I always knew the term API but always saw it as some random tech
 * jargon that I would never really learn about until a random computer science class in knowledge. Now I know how a Frontend and communicate
 * with a backend although I do see how simplified this probably is compared to real world modern applicaitons.
 * 3) I think it can be further extended with an active database that a bunch of users can access. Perhaps have a song list
 * for each user and allow them to edit their own but only to GET the lists of others. Basically a multiuser functionality.
 */


const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true }));

let music = [ {
        name: "Lamento Boliviano",
        genre: "Rock",
        month: "September",
        year: "1994",
    },
    {
        name: "Safe And Sound",
        genre: "Pop",
        month: "November",
        year: "2011"

    },
    {
        name: "One Mic",
        genre: "Rap",
        month: "October",
        year: "2001"
    },
    {
         
        name: "Day 'N' Nite",
        genre: "Hip Hop",
        month: "January",
        year: "2009"
    },
    {
         
        name: "Seven Million Faces",
        genre: "Electronic",
        month: "August",
        year: "2022"
    },
    {
        
        name: "Six Moments Musicaux",
        genre: "Classical",
        month: "December",
        year: "1896"
    },
    {
        
        name: "I'm Lost",
        genre: "Jazz",
        month: "January",
        year: "1962"
    },
    {
        
        name: "Mid",
        genre: "Blues",
        month: "January",
        year: "2027"
    }
]


// Assign Indexes to Elements in Music Array
function initInd() {
    music = music.map((obj, index) => {
      return Object.assign({id: index + 1}, obj);
    });
}
  
initInd();




//- - - - - GET - - - - - 


// Port 80 Route 

app.get('/', (req, res) => {

    res.sendFile("index.html");

});


// GET based on JSON parameters

app.get('/api/music', (req, res) => {
    let musicList = music;
    
    // Default case prints the entire array
    if (req.body.month || req.body.year) {
      musicList = music.filter(s => {
        if (req.body.month && req.body.year) {
          return s.month === req.body.month && s.year === req.body.year;
        }
        else if (req.body.month) {
          return s.month === req.body.month;
        }
        else {
          return s.year === req.body.year;
        }
      });
    }
    
    // If nothing is found


    if (musicList.length === 0) {
      res.status(404).send("Nothing Found - Search may be mistyped or desired song does not exist");
      return;
    }
    
    res.send(musicList);
});

// ID Search via URL Functionality
app.get('/api/music/:id', (req, res) => {


    const musicId = parseInt(req.params.id);
    const musicList = music.find(s => s.id === musicId);
    
    if (!musicList) {
      res.status(404).send("Please Input a valid ID!");
      return;
    }
    
    res.send(musicList);
  });




// - - - - - - - POST - - - - - - - - 
app.post('/api/music', (req, res) => {


    if (!req.body.name || !req.body.genre) {
        res.status(404).send("Please Input a Song Name and/or Genre!");
        return;
    }


    if (req.body.name.length < 3 || req.body.name.length >= 40) {
        res.status(404).send("Song names must be between 3 and 40 characters in length!");
        return;
    }


    if (req.body.genre.length < 3 || req.body.genre.length >= 40) {
        res.status(404).send("Genre names must be between 3 and 40 characters in length!");
        return;
    }

    music.push(
        {
            id: music.length + 1,
            name: req.body.name,
            genre: req.body.genre,
            month: req.body.month ? req.body.month : "-",
            year: req.body.year ? req.body.year : "-",
        }
    );

    res.status(200).send(music);

});



// - - - - - - PUT - - - - - - 

app.put('/api/music/:id', (req, res) => {
    // Small Note on the workings of this project
    // Me and Raymond discussed on what was the optimal way of ordering these IF statements, we decided that this
    // was the optimal way of ordering them. The most likely if statement to hit should be the first for efficiency reasons!


    if (!req.body.name || !req.body.genre) {
        res.status(404).send("Please Input a Song Name and/or Genre!");
        return;
    }


    if (req.params.id < 0 || req.params.id > music.length) {
        res.status(400).send("Please Input a valid ID!");
        return;
    }


    if (req.body.name.length < 3 || req.body.name.length >= 40) {
        res.status(404).send("Song names must be between 3 and 40 characters in length!");
        return;
    }


    if (req.body.genre.length < 3 || req.body.genre.length >= 40) {
        res.status(404).send("Genre names must be between 3 and 40 characters in length!");
        return;
    }

    // I was stuck on what to send for the PUT request. Consulted Raymond for this one.
    // Essentially sends an array much like the POST but adds an ID chosen by the user, this ID is subtracted from 1
    // For the Actual ID
    music[req.params.id - 1] = {
        id: parseInt(req.params.id),
        name: req.body.name,
        genre: req.body.genre,
        month: req.body.month ? req.body.month : "-",
        year: req.body.year ? req.body.year : "-",
    }
    res.status(200).send(music[req.params.id - 1]);
});







// - - - - - - DELETE - - - - - 

// Delete given specifiec ID in URL
app.delete('/api/music/:id', (req, res) => {
    const songIndex = music.findIndex(s => s.id === parseInt(req.params.id));
    if (songIndex === -1) {
      res.status(404).send("Please input a valid ID!");
      return;
    }
  
    music.splice(songIndex, 1);
  
    music.forEach((song, index) => {
      song.id = index + 1;
    });
  
    res.status(200).send("Specified song has been successfully deleted!");
  });
  



app.listen(3000, () => { 
    console.log('LISTENING Port 3000 \nConnect via http://localhost:3000'); 
});