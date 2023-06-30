const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');
var express = require('express');
var router = express.Router();
module.exports = router;

router.get('/', (req, res, next) => {
  Contact.find()
    .exec()
    .then((contacts) => {
      res.status(200).json(contacts);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

router.post('/', (req, res, next) => {
  const maxContactId = sequenceGenerator.nextId("contacts");

  const contact = new Contact({
    id: maxContactId,
    name: req.body.name,
    description: req.body.description,
    url: req.body.url
  });

  contact.save()
    .then(createdContact => {
      res.status(201).json({
        message: 'Contact added successfully',
        contact: createdContact
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

router.put('/:id', (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found.',
          error: { contact: 'Contact not found' }
        });
      }

      contact.name = req.body.name;
      contact.description = req.body.description;
      contact.url = req.body.url;

      contact.save()
        .then(updatedContact => {
          res.status(204).json({
            message: 'Contact updated successfully'
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found.',
          error: { contact: 'Contact not found' }
        });
      }

      Contact.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Contact deleted successfully"
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

module.exports = router;
