const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MLAB_URI);