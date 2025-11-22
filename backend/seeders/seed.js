require('dotenv').config();
const { sequelize } = require('../models');
const seedDatabase = require('./seed-data');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database reset');

    await seedDatabase();

    console.log('\nDefault credentials:');
    console.log('  Admin:');
    console.log('    Email: admin@clinicops.test');
    console.log('    Password: admintest123!!');
    console.log('  Staff:');
    console.log('    Email: sarah.johnson@clinicops.test');
    console.log('    Password: usertest123!!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
