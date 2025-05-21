const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const Request = require('../models/Request');
const User = require('../models/User');

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Create request
router.post('/', auth, upload.single('file'), async (req, res) => {
  const { name, position, department, description } = req.body;
  try {
    const user = await User.findById(req.user.id);
    
    const newRequest = new Request({
      user: req.user.id,
      name: user.name,
      position,
      department,
      description,
      file: req.file ? req.file.path : null
    });

    await newRequest.save();
    res.json(newRequest);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all requests (admin)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get user's requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update request status (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    request.status = 'done';
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete request
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    if (request.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await request.remove();
    res.json({ msg: 'Request removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;