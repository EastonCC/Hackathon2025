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
    console.log('  Regular User:');
    console.log('    Email: user@clinicops.test');
    console.log('    Password: usertest123!!');
    console.log('  Nurse:');
    console.log('    Email: michael.chen@valdostamedicine.com');
    console.log('    Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
