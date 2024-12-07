const express = require('express');
const app = express();
const dashboardRoutes = require('./routes/dashboard');

// ... other middleware and setup ...

app.use('/api/dashboard', dashboardRoutes);

// ... other routes ... 