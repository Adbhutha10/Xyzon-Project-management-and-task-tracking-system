const bcrypt = require('bcryptjs');
const { User } = require('../models');

const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ where: { role: 'admin' } });
        if (existingAdmin) {
            console.log('✅ Admin already exists. Skipping seed.');
            return;
        }

        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        await User.create({
            name: 'Admin',
            email: 'admin@pm.com',
            password: hashedPassword,
            role: 'admin',
        });

        console.log('🌱 Default admin seeded: admin@pm.com / Admin@123');
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
    }
};

module.exports = seedAdmin;
