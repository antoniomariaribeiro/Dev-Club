// Importar todos os modelos
const User = require('./User');
const Event = require('./Event');
const Product = require('./Product');
const Gallery = require('./Gallery');
const Contact = require('./Contact');
const EventRegistration = require('./EventRegistration');

// Definir associações
const setupAssociations = () => {
  // User e EventRegistration
  User.hasMany(EventRegistration, {
    foreignKey: 'user_id',
    as: 'eventRegistrations'
  });
  EventRegistration.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // Event e EventRegistration
  Event.hasMany(EventRegistration, {
    foreignKey: 'event_id',
    as: 'registrations'
  });
  EventRegistration.belongsTo(Event, {
    foreignKey: 'event_id',
    as: 'event'
  });

  // User e Contact (para quem fez contato)
  Contact.belongsTo(User, {
    foreignKey: 'contacted_by',
    as: 'contactedByUser',
    allowNull: true
  });
  User.hasMany(Contact, {
    foreignKey: 'contacted_by',
    as: 'contactsHandled'
  });

  console.log('✅ Associações dos modelos configuradas');
};

// Exportar modelos e função de setup
module.exports = {
  User,
  Event,
  Product,
  Gallery,
  Contact,
  EventRegistration,
  setupAssociations
};