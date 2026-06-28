const bcrypt = require('bcryptjs');

const users = [
    {
        fullName: 'Admin User',
        username: 'admin',
        password: 'password123', // Admin username: admin, password: password123
        role: 'admin',
        company: 'TaskFlow Corp'
    },
    {
        fullName: 'John Doe',
        username: 'employee',
        password: 'password123',
        role: 'employee',
        company: 'TaskFlow Corp'
    },
    {
        fullName: 'Jane Smith',
        username: 'jane',
        password: 'password123',
        role: 'employee',
        company: 'TaskFlow Corp'
    },
];

module.exports = users;
