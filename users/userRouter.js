const express = require('express');
const userdb = require('./userDb');
const postdb = require('../posts/postDb');

const router = express.Router();

// runs every time a request is made 
router.use((req, res, next) => {
  console.log('userRouter console log');
  next();
})

router.get('/', (req, res, next) => {
  userdb.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId(), (req, res) => {
  res.status(200).json(req.user);
});

router.post('/', validateUser, (req, res) => {
  userdb.insert(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      console.log('Error:', err);
      res.status(500).json({
        message: "Server error, user creation unsuccessful"
      })
    })
});

router.post('/:id/posts', validatePost(), (req, res) => {
  const postInfo = {...req.body, user_id: req.params.id}

  postdb.insert(postInfo)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      console.log('Error: ', err)
      res.status(500).json({
        message: "Failed to create post"
      })
    })
});

router.get('/:id/posts', validateUserId(), (req, res) => {
  // do your magic!
  userdb.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log('Error: ', err)
    })
});


router.put('/:id', validateUserId(), validateUser, (req, res) => {
  userdb.update(req.params.id, req.body)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      console.log('Error:', err);
      res.status(500).json({
        message: "There was a problem updating the user"
      })
    })
});

router.delete('/:id', validateUserId(), (req, res) => {
  userdb.remove(req.params.id)
    .then(() => {
      res.status(200).json({
        message: "user deleted"
      })
    })
    .catch(err => {
      res.status(500).json({
        message: "failed to delete user"
      })
    })
});

//custom middleware

function validateUserId() {
  return (req, res, next) => {
    userdb.getById(req.params.id)
      .then(user => {
        if (user) {
          // attach user to req obj, to access later
          req.user = user;
          next();
        } else {
          res.status(404).json({
            message: "user not found"
          })
        }
      })
      .catch(err => {
        console.log('Error:', err);
        res.status(500).json({
          message: "invalid user id"
        })
      })
  }
} 

function validateUser(req, res, next) {
    if (req.body) {
      if (req.body.name) {
        next();
      } else {
        res.status(400).json({
          message: "missing user data"
        })
      }
    } else {
      res.status(400).json({
        message: "missing required name field"
      })
    }
}

function validatePost() {
  return (req, res, next) => {
    if (!req.body) {
      res.status(400).json({
        message: "missing post data"
      })
    } else if (!req.body.text) {
      res.status(400).json({
        message: "missing required text field"
      })
    }
    next();
  }
}

module.exports = router;