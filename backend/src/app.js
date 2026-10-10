const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const publicRoutes = require('./routes/public.routes');
const enquiryRoutes = require('./routes/enquiry.routes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);          // no auth
app.use('/api/public', publicRoutes);      // no auth
app.use('/api/enquiries', enquiryRoutes);  // JWT protected

app.use(notFound);
app.use(errorHandler);

module.exports = app;