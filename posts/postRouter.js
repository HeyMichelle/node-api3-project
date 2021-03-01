const express = require('express');
const postdb = require ('./postDb');

const router = express.Router();

router.use((req, res, next) => {
  console.log('you are using postRouter');
  next();
})

router.get('/', (req, res) => {
  postdb.get()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log('Error: ', err)
      res.status(500).json({
        message: "Failed to retrieve posts"
      })
    })
});

router.get('/:id', (req, res) => {
  postdb.getById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(400).json({
          message: "Post not found"
        })
      }
    })
    .catch(err => {
      console.log('Error: ', err)
      res.status(500).json({
        message: "Post could not be retrieved"
      })
    })
});

router.delete('/:id', (req, res) => {
  postdb.remove(req.params.id)
    .then(() => {
      res.status(200).json({
        message: "Post removed"
      })
    })
    .catch(err => {
      console.log('Error: ', err);
      res.status(500).json({
        message: "Could not remove post"
      })
    })
});

router.put('/:id', (req, res) => {
  postdb.update(req.params.id, req.body)
    .then(updatedPost => {
      if (updatedPost) {
        res.status(200).json(updatedPost)
      } else {
        res.status(400).json({
          message: "Could not find post to update"
        })
      }
    })
    .catch(err => {
      console.log('Error: ', err);
      res.status(500).json({
        message: "Post could not be updated"
      })
    })
});

// custom middleware

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