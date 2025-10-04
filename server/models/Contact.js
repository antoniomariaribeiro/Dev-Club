const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 3,
      max: 120
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  interest_type: {
    type: DataTypes.ENUM('classes', 'events', 'workshops', 'performances', 'general'),
    defaultValue: 'classes',
    allowNull: false
  },
  experience_level: {
    type: DataTypes.ENUM('none', 'beginner', 'intermediate', 'advanced'),
    defaultValue: 'none',
    allowNull: false
  },
  preferred_schedule: {
    type: DataTypes.ENUM('morning', 'afternoon', 'evening', 'weekend', 'flexible'),
    defaultValue: 'flexible',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'enrolled', 'not_interested'),
    defaultValue: 'new',
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contacted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  contacted_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  source: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'website'
  }
});

module.exports = Contact;