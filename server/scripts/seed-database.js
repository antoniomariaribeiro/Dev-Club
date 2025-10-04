const { User, Event, Product, Gallery, Contact, EventRegistration } = require('../models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  console.log('🌱 Iniciando seed do banco de dados...');
  
  try {
    // Limpar dados existentes (exceto admin)
    await EventRegistration.destroy({ where: {}, truncate: true });
    await Event.destroy({ where: {}, truncate: true });
    await Product.destroy({ where: {}, truncate: true });
    await Gallery.destroy({ where: {}, truncate: true });
    await Contact.destroy({ where: {}, truncate: true });
    const { Op } = require('sequelize');
    await User.destroy({ 
      where: { 
        email: { [Op.ne]: 'admin@admin.com' }
      } 
    });

    // Criar usuários de teste
    const users = [];
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    for (let i = 1; i <= 20; i++) {
      const user = await User.create({
        name: `Estudante ${i}`,
        email: `estudante${i}@capoeira.com`,
        password: hashedPassword,
        phone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
        birth_date: new Date(1990 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        belt: ['Crua', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Marrom'][Math.floor(Math.random() * 6)],
        role: 'student',
        status: ['active', 'inactive'][Math.floor(Math.random() * 2)]
      });
      users.push(user);
    }
    
    // Criar instrutores
    for (let i = 1; i <= 5; i++) {
      const instructor = await User.create({
        name: `Instrutor ${i}`,
        email: `instrutor${i}@capoeira.com`,
        password: hashedPassword,
        phone: `(11) 8${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
        birth_date: new Date(1980 + Math.floor(Math.random() * 15), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        belt: ['Marrom', 'Preta'][Math.floor(Math.random() * 2)],
        role: 'instructor',
        status: 'active'
      });
      users.push(instructor);
    }
    
    console.log(`✅ Criados ${users.length} usuários`);

    // Criar eventos de teste
    const events = [];
    const eventTitles = [
      'Roda de Capoeira - Iniciantes',
      'Workshop de Berimbau',
      'Batizado e Troca de Cordas 2024',
      'Aula Especial - Mestre Convidado',
      'Treino Intensivo - Avançados',
      'Festival de Capoeira Regional',
      'Aula de Música e Canto',
      'Encontro de Capoeira Angola',
      'Apresentação Cultural',
      'Oficina de Instrumentos'
    ];

    for (let i = 0; i < eventTitles.length; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 90));
      
      const event = await Event.create({
        title: eventTitles[i],
        description: `Descrição detalhada do evento ${eventTitles[i]}. Este é um evento especial que vai reunir capoeiristas de todos os níveis para uma experiência única de aprendizado e confraternização.`,
        event_date: futureDate,
        location: [`Quadra Principal`, `Espaço Cultural`, `Parque da Cidade`, `Academia Central`][Math.floor(Math.random() * 4)],
        max_participants: [20, 30, 50, 100][Math.floor(Math.random() * 4)],
        price: [0, 25, 50, 80][Math.floor(Math.random() * 4)],
        image_url: `/uploads/events/event${i + 1}.jpg`,
        category: ['workshop', 'roda', 'batizado', 'apresentacao'][Math.floor(Math.random() * 4)],
        status: 'active'
      });
      events.push(event);
    }
    
    console.log(`✅ Criados ${events.length} eventos`);

    // Criar inscrições em eventos
    let registrations = 0;
    for (const event of events) {
      const numRegistrations = Math.floor(Math.random() * 15) + 5;
      const selectedUsers = users.slice(0, numRegistrations);
      
      for (const user of selectedUsers) {
        await EventRegistration.create({
          user_id: user.id,
          event_id: event.id,
          status: ['confirmed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)],
          payment_status: ['paid', 'pending', 'cancelled'][Math.floor(Math.random() * 3)],
          amount_paid: event.price,
          registration_date: new Date(),
          notes: `Inscrição do usuário ${user.name} no evento ${event.title}`
        });
        registrations++;
      }
    }
    
    console.log(`✅ Criadas ${registrations} inscrições em eventos`);

    // Criar produtos de teste
    const productNames = [
      'Berimbau Artesanal',
      'Atabaque Tradicional',
      'Pandeiro Profissional',
      'Camiseta Capoeira Brasil',
      'Calça de Capoeira Branca',
      'Cordão Graduado',
      'Reco-Reco de Bambu',
      'Caxixi Tradicional',
      'Agogô Duplo',
      'CD Músicas de Capoeira'
    ];

    for (let i = 0; i < productNames.length; i++) {
      await Product.create({
        name: productNames[i],
        description: `${productNames[i]} de alta qualidade, confeccionado especialmente para capoeiristas. Produto tradicional e autêntico.`,
        short_description: `${productNames[i]} - Qualidade Premium`,
        price: (Math.random() * 200 + 50).toFixed(2),
        old_price: Math.random() > 0.5 ? (Math.random() * 250 + 80).toFixed(2) : null,
        category: ['instrumentos', 'roupas', 'acessorios', 'musica'][Math.floor(Math.random() * 4)],
        brand: ['Capoeira Brasil', 'Arte Brasileira', 'Tradição', 'Mestre Artesão'][Math.floor(Math.random() * 4)],
        sku: `CAP${1000 + i}`,
        stock_quantity: Math.floor(Math.random() * 50) + 10,
        weight: (Math.random() * 5 + 0.5).toFixed(2),
        images: [`/uploads/products/product${i + 1}.jpg`],
        status: 'active',
        is_featured: Math.random() > 0.7,
        tags: ['capoeira', 'tradicional', 'artesanal']
      });
    }
    
    console.log(`✅ Criados ${productNames.length} produtos`);

    // Criar galeria de fotos
    const galleryTitles = [
      'Roda de Capoeira - Centro da Cidade',
      'Batizado 2023 - Momentos Especiais',
      'Workshop com Mestre Visitante',
      'Apresentação no Festival de Arte',
      'Treino Matinal na Praia',
      'Encontro de Capoeiristas',
      'Aula de Música Tradicional',
      'Confraternização de Fim de Ano',
      'Demonstração em Escola',
      'Roda Aberta no Parque'
    ];

    for (let i = 0; i < galleryTitles.length; i++) {
      await Gallery.create({
        title: galleryTitles[i],
        description: `Registro fotográfico do evento ${galleryTitles[i]}. Momentos únicos da capoeira capturados em imagens.`,
        image_url: `/uploads/gallery/gallery${i + 1}.jpg`,
        thumbnail_url: `/uploads/gallery/thumb_gallery${i + 1}.jpg`,
        category: ['eventos', 'treinos', 'apresentacoes'][Math.floor(Math.random() * 3)],
        photographer: [`Fotógrafo ${i + 1}`, 'Equipe Capoeira', 'Voluntário'][Math.floor(Math.random() * 3)],
        event_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        location: [`Local ${i + 1}`, 'Centro Cultural', 'Praia de Copacabana'][Math.floor(Math.random() * 3)],
        is_featured: Math.random() > 0.8,
        status: 'active',
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 100),
        tags: ['capoeira', 'cultura', 'arte']
      });
    }
    
    console.log(`✅ Criadas ${galleryTitles.length} fotos na galeria`);

    // Criar contatos/leads
    const contactNames = [
      'Maria Silva', 'João Santos', 'Ana Costa', 'Pedro Oliveira', 'Carla Souza',
      'Rafael Lima', 'Juliana Alves', 'Marcos Ferreira', 'Lucia Rodrigues', 'Fernando Castro',
      'Patricia Mendes', 'Ricardo Barbosa', 'Camila Dias', 'Bruno Cardoso', 'Renata Gomes'
    ];

    for (let i = 0; i < contactNames.length; i++) {
      await Contact.create({
        name: contactNames[i],
        email: `${contactNames[i].toLowerCase().replace(' ', '.')}@email.com`,
        phone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
        age: Math.floor(Math.random() * 40) + 15,
        message: `Olá! Tenho interesse em conhecer mais sobre a capoeira. Gostaria de informações sobre aulas para ${['iniciantes', 'intermediários', 'crianças'][Math.floor(Math.random() * 3)]}.`,
        interest_type: ['classes', 'events', 'products'][Math.floor(Math.random() * 3)],
        experience_level: ['none', 'beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 4)],
        preferred_schedule: ['morning', 'afternoon', 'evening', 'weekend', 'flexible'][Math.floor(Math.random() * 5)],
        status: ['new', 'contacted', 'converted', 'closed'][Math.floor(Math.random() * 4)],
        source: ['website', 'facebook', 'instagram', 'referral'][Math.floor(Math.random() * 4)],
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }
    
    console.log(`✅ Criados ${contactNames.length} contatos`);

    console.log('🎉 Seed do banco de dados concluído com sucesso!');
    console.log('\n📊 Resumo dos dados criados:');
    console.log(`👥 Usuários: ${users.length}`);
    console.log(`📅 Eventos: ${events.length}`);
    console.log(`📝 Inscrições: ${registrations}`);
    console.log(`🛍️ Produtos: ${productNames.length}`);
    console.log(`📸 Fotos da Galeria: ${galleryTitles.length}`);
    console.log(`📞 Contatos: ${contactNames.length}`);
    console.log('\n🔐 Credenciais de teste:');
    console.log('Admin: admin@admin.com / admin123');
    console.log('Estudante: estudante1@capoeira.com / 123456');
    console.log('Instrutor: instrutor1@capoeira.com / 123456');

  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
    throw error;
  }
}

// Executar seed se rodado diretamente
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seed executado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro ao executar seed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };