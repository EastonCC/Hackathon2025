require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const groupRoutes = require('./routes/groups');
const taskRoutes = require('./routes/tasks');
const taskStatusRoutes = require('./routes/taskStatuses');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/task-statuses', taskStatusRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Valdosta Medicine Employee Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      employees: '/api/employees',
      groups: '/api/groups',
      tasks: '/api/tasks',
      taskStatuses: '/api/task-statuses'
    }
  });
});

const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synchronized');

    // Auto-seed if database is empty (first run)
    const { Employee } = require('./models');
    const employeeCount = await Employee.count();

    if (employeeCount === 0) {
      console.log('Database is empty. Running initial seed...');
      const seed = require('./seeders/seed-data');
      await seed();
      console.log('Initial seed complete');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
