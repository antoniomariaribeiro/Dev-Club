const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51234567890abcdef...'); // Chave secreta do Stripe (usar variáveis de ambiente em produção)
const { loadData, saveData } = require('./dataManager');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3002', 'http://127.0.0.1:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Dados padrão para usuários
const defaultUsers = [
  {
    id: 1,
    name: "Antonio Maria",
    email: "admin@admin.com", 
    role: "admin",
    is_active: true,
    phone: "(11) 99999-9999",
    created_at: "2024-01-15T10:30:00.000Z"
  },
  {
    id: 2,
    name: "João Silva",
    email: "joao@exemplo.com",
    role: "student", 
    is_active: true,
    phone: "(11) 88888-8888",
    created_at: "2024-02-10T14:20:00.000Z"
  },
  {
    id: 3,
    name: "Maria Santos",
    email: "maria@exemplo.com",
    role: "student",
    is_active: false,
    phone: "(11) 77777-7777", 
    created_at: "2024-01-25T09:15:00.000Z"
  },
  {
    id: 4,
    name: "Pedro Costa",
    email: "pedro@exemplo.com",
    role: "student",
    is_active: true,
    phone: "(11) 66666-6666",
    created_at: "2024-03-05T16:45:00.000Z"
  },
  {
    id: 5,
    name: "Ana Oliveira", 
    email: "ana@exemplo.com",
    role: "admin",
    is_active: true,
    phone: "(11) 55555-5555",
    created_at: "2024-02-20T11:30:00.000Z"
  }
];

// Carregar dados persistentes ou usar dados padrão
let mockUsers = loadData('users', defaultUsers);

// Dados padrão para eventos
const defaultEvents = [
  {
    id: 1,
    title: "Roda de Capoeira - Batizado 2024",
    description: "Grande evento de batizado com mestres convidados. Cerimônia tradicional de entrega de cordas para novos capoeiristas.",
    date: "2024-12-15",
    time: "14:00",
    location: "Quadra da Academia Central",
    max_participants: 100,
    price: 50.00,
    status: "active",
    image_url: "/uploads/events/batizado2024.jpg",
    registrations_count: 75,
    confirmed_count: 65,
    available_spots: 25,
    category: "batizado",
    created_at: "2024-10-01T10:00:00.000Z"
  },
  {
    id: 2,
    title: "Workshop de Maculelê",
    description: "Aprenda os fundamentos do maculelê com Mestre João. Aula especial sobre esta arte marcial brasileira.",
    date: "2024-11-20",
    time: "16:00", 
    location: "Sala de Dança - 2º Andar",
    max_participants: 30,
    price: 25.00,
    status: "active",
    image_url: "/uploads/events/maculele.jpg",
    registrations_count: 20,
    confirmed_count: 18,
    available_spots: 10,
    category: "workshop",
    created_at: "2024-09-15T14:30:00.000Z"
  },
  {
    id: 3,
    title: "Aula Aberta de Capoeira",
    description: "Aula gratuita para iniciantes. Venha conhecer a capoeira e nossa academia!",
    date: "2024-11-08",
    time: "19:00",
    location: "Academia Principal",
    max_participants: 50,
    price: 0.00,
    status: "active", 
    image_url: "/uploads/events/aula-aberta.jpg",
    registrations_count: 35,
    confirmed_count: 30,
    available_spots: 15,
    category: "aula-aberta",
    created_at: "2024-10-05T09:20:00.000Z"
  },
  {
    id: 4,
    title: "Encontro Regional - Salvador",
    description: "Participação no grande encontro regional de capoeira em Salvador. Viagem inclusa.",
    date: "2024-08-15",
    time: "08:00",
    location: "Salvador - BA", 
    max_participants: 20,
    price: 350.00,
    status: "completed",
    image_url: "/uploads/events/salvador.jpg",
    registrations_count: 20,
    confirmed_count: 20,
    available_spots: 0,
    category: "evento-regional",
    created_at: "2024-07-01T11:15:00.000Z"
  },
  {
    id: 5,
    title: "Festival de Inverno - Cancelado",
    description: "Festival de capoeira de inverno. Infelizmente cancelado devido às condições climáticas.",
    date: "2024-07-20",
    time: "10:00",
    location: "Parque da Cidade",
    max_participants: 80,
    price: 30.00,
    status: "cancelled",
    image_url: "/uploads/events/festival-inverno.jpg", 
    registrations_count: 45,
    confirmed_count: 0,
    available_spots: 80,
    category: "festival",
    created_at: "2024-06-10T16:45:00.000Z"
  }
];

// Carregar dados persistentes de eventos
let mockEvents = loadData('events', defaultEvents);

// Mock data para inscrições de eventos
let mockEventRegistrations = [
  {
    id: 1,
    event_id: 1,
    user_id: 2,
    user_name: "João Silva",
    user_email: "joao@exemplo.com",
    user_phone: "(11) 88888-8888",
    status: "pending", // pending, approved, rejected, cancelled
    registration_date: "2024-03-15T10:30:00.000Z",
    payment_status: "pending", // pending, paid, refunded
    notes: "",
    created_at: "2024-03-15T10:30:00.000Z"
  },
  {
    id: 2,
    event_id: 1,
    user_id: 3,
    user_name: "Maria Santos",
    user_email: "maria@exemplo.com",
    user_phone: "(11) 77777-7777",
    status: "approved",
    registration_date: "2024-03-16T14:20:00.000Z",
    payment_status: "paid",
    notes: "Aluna veterana",
    created_at: "2024-03-16T14:20:00.000Z"
  },
  {
    id: 3,
    event_id: 1,
    user_id: 4,
    user_name: "Pedro Costa",
    user_email: "pedro@exemplo.com",
    user_phone: "(11) 66666-6666",
    status: "approved",
    registration_date: "2024-03-17T09:15:00.000Z",
    payment_status: "paid",
    notes: "",
    created_at: "2024-03-17T09:15:00.000Z"
  },
  {
    id: 4,
    event_id: 2,
    user_id: 5,
    user_name: "Ana Oliveira",
    user_email: "ana@exemplo.com",
    user_phone: "(11) 55555-5555",
    status: "pending",
    registration_date: "2024-04-02T11:45:00.000Z",
    payment_status: "pending",
    notes: "Primeira participação",
    created_at: "2024-04-02T11:45:00.000Z"
  },
  {
    id: 5,
    event_id: 2,
    user_id: 6,
    user_name: "Carlos Mendes",
    user_email: "carlos@exemplo.com",
    user_phone: "(11) 44444-4444",
    status: "rejected",
    registration_date: "2024-04-03T16:30:00.000Z",
    payment_status: "refunded",
    notes: "Não atende aos requisitos",
    created_at: "2024-04-03T16:30:00.000Z"
  },
  {
    id: 6,
    event_id: 3,
    user_id: 7,
    user_name: "Luciana Ferreira",
    user_email: "luciana@exemplo.com",
    user_phone: "(11) 33333-3333",
    status: "approved",
    registration_date: "2024-05-12T13:20:00.000Z",
    payment_status: "paid",
    notes: "Graduada corda verde",
    created_at: "2024-05-12T13:20:00.000Z"
  }
];

// Mock data para pagamentos
let mockPayments = [
  {
    id: "pi_3N1abcDef123456789",
    stripe_payment_intent_id: "pi_3N1abcDef123456789",
    user_id: 2,
    user_name: "João Silva",
    user_email: "joao@exemplo.com",
    event_id: 1,
    event_title: "Batizado 2024",
    amount: 8500, // em centavos (R$ 85,00)
    currency: "brl",
    status: "succeeded", // requires_payment_method, requires_confirmation, requires_action, processing, requires_capture, canceled, succeeded
    payment_method: "card",
    payment_method_details: {
      card: {
        brand: "visa",
        last4: "4242",
        exp_month: 12,
        exp_year: 2025
      }
    },
    description: "Inscrição - Batizado 2024",
    receipt_email: "joao@exemplo.com",
    created_at: "2024-03-15T10:35:00.000Z",
    updated_at: "2024-03-15T10:36:00.000Z"
  },
  {
    id: "pi_3N2defGhi234567890",
    stripe_payment_intent_id: "pi_3N2defGhi234567890",
    user_id: 3,
    user_name: "Maria Santos",
    user_email: "maria@exemplo.com",
    event_id: 1,
    event_title: "Batizado 2024",
    amount: 8500,
    currency: "brl",
    status: "succeeded",
    payment_method: "card",
    payment_method_details: {
      card: {
        brand: "mastercard",
        last4: "1234",
        exp_month: 8,
        exp_year: 2026
      }
    },
    description: "Inscrição - Batizado 2024",
    receipt_email: "maria@exemplo.com",
    created_at: "2024-03-16T14:25:00.000Z",
    updated_at: "2024-03-16T14:26:00.000Z"
  },
  {
    id: "pi_3N3ghiJkl345678901",
    stripe_payment_intent_id: "pi_3N3ghiJkl345678901",
    user_id: 4,
    user_name: "Pedro Costa",
    user_email: "pedro@exemplo.com",
    event_id: 2,
    event_title: "Workshop de Mestre Bimba",
    amount: 4500,
    currency: "brl",
    status: "requires_payment_method",
    payment_method: "card",
    payment_method_details: null,
    description: "Inscrição - Workshop de Mestre Bimba",
    receipt_email: "pedro@exemplo.com",
    created_at: "2024-04-01T09:15:00.000Z",
    updated_at: "2024-04-01T09:15:00.000Z"
  },
  {
    id: "pi_3N4jklMno456789012",
    stripe_payment_intent_id: "pi_3N4jklMno456789012",
    user_id: 7,
    user_name: "Luciana Ferreira",
    user_email: "luciana@exemplo.com",
    event_id: 3,
    event_title: "Roda Beneficente",
    amount: 2000,
    currency: "brl",
    status: "succeeded",
    payment_method: "pix",
    payment_method_details: {
      pix: {
        qr_code: "00020101021...",
        transaction_id: "E12345678202103191200"
      }
    },
    description: "Inscrição - Roda Beneficente",
    receipt_email: "luciana@exemplo.com",
    created_at: "2024-05-12T13:25:00.000Z",
    updated_at: "2024-05-12T13:27:00.000Z"
  }
];

// Mock data para mensalidades/assinaturas
let mockSubscriptions = [
  {
    id: "sub_1N1abcDef123456789",
    stripe_subscription_id: "sub_1N1abcDef123456789",
    user_id: 2,
    user_name: "João Silva",
    user_email: "joao@exemplo.com",
    plan_name: "Plano Básico Mensal",
    amount: 15000, // R$ 150,00
    currency: "brl",
    interval: "month",
    status: "active", // incomplete, incomplete_expired, trialing, active, past_due, canceled, unpaid
    current_period_start: "2024-03-01T00:00:00.000Z",
    current_period_end: "2024-04-01T00:00:00.000Z",
    created_at: "2024-03-01T10:00:00.000Z",
    updated_at: "2024-03-15T10:00:00.000Z"
  },
  {
    id: "sub_2N2defGhi234567890",
    stripe_subscription_id: "sub_2N2defGhi234567890",
    user_id: 3,
    user_name: "Maria Santos",
    user_email: "maria@exemplo.com",
    plan_name: "Plano Premium Trimestral",
    amount: 40000, // R$ 400,00
    currency: "brl",
    interval: "quarter",
    status: "active",
    current_period_start: "2024-01-01T00:00:00.000Z",
    current_period_end: "2024-04-01T00:00:00.000Z",
    created_at: "2024-01-01T08:00:00.000Z",
    updated_at: "2024-03-16T14:30:00.000Z"
  }
];

// Mock data para estatísticas
const mockStats = {
  totalUsers: 47,
  totalEvents: 8,
  totalProducts: 15,
  totalContacts: 12
};

// Mock data para galeria de fotos
let mockGalleryPhotos = [
  {
    id: 1,
    title: "Workshop de Capoeira Regional",
    description: "Evento especial com Mestre João demonstrando movimentos da capoeira regional",
    image_url: "https://images.unsplash.com/photo-1544547850-6c1e0653d35c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1544547850-6c1e0653d35c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    category: "workshops",
    event_id: 1,
    photographer: "Carlos Silva",
    camera_settings: "Canon EOS R5, 85mm f/1.4",
    location: "Academia Principal",
    likes: 24,
    views: 156,
    tags: ["capoeira", "regional", "mestre", "workshop"],
    created_at: "2024-03-15T10:30:00.000Z",
    updated_at: "2024-03-15T10:30:00.000Z",
    is_featured: true,
    is_public: true
  },
  {
    id: 2,
    title: "Roda de Capoeira no Parque",
    description: "Roda tradicional realizada no Parque Ibirapuera com participação da comunidade",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    category: "eventos",
    event_id: 2,
    photographer: "Ana Santos",
    camera_settings: "Sony A7III, 24-70mm f/2.8",
    location: "Parque Ibirapuera",
    likes: 42,
    views: 289,
    tags: ["roda", "parque", "comunidade", "tradição"],
    created_at: "2024-03-10T16:45:00.000Z",
    updated_at: "2024-03-12T09:20:00.000Z",
    is_featured: true,
    is_public: true
  },
  {
    id: 3,
    title: "Batizado e Troca de Cordas 2024",
    description: "Cerimônia anual de batizado com participação de mestres convidados",
    image_url: "https://images.unsplash.com/photo-1594736797933-d0401ba34398?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1594736797933-d0401ba34398?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    category: "batizado",
    event_id: 3,
    photographer: "Roberto Lima",
    camera_settings: "Nikon D850, 50mm f/1.8",
    location: "Centro de Convenções",
    likes: 67,
    views: 445,
    tags: ["batizado", "cordas", "cerimônia", "mestres"],
    created_at: "2024-02-28T14:20:00.000Z",
    updated_at: "2024-03-01T11:30:00.000Z",
    is_featured: false,
    is_public: true
  },
  {
    id: 4,
    title: "Treino Matinal na Praia",
    description: "Sessão de treino especial nas areias de Copacabana",
    image_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    category: "treinos",
    event_id: null,
    photographer: "Marina Costa",
    camera_settings: "iPhone 14 Pro, Modo Retrato",
    location: "Praia de Copacabana",
    likes: 31,
    views: 198,
    tags: ["treino", "praia", "manhã", "natureza"],
    created_at: "2024-02-20T07:15:00.000Z",
    updated_at: "2024-02-20T07:15:00.000Z",
    is_featured: false,
    is_public: true
  },
  {
    id: 5,
    title: "Apresentação Cultural na Escola",
    description: "Demonstração de capoeira para alunos do ensino fundamental",
    image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    category: "apresentações",
    event_id: 4,
    photographer: "Paulo Mendes",
    camera_settings: "Canon 5D Mark IV, 24-105mm f/4",
    location: "Escola Estadual São Paulo",
    likes: 18,
    views: 134,
    tags: ["apresentação", "escola", "crianças", "cultural"],
    created_at: "2024-02-15T10:00:00.000Z",
    updated_at: "2024-02-15T10:00:00.000Z",
    is_featured: false,
    is_public: true
  },
  {
    id: 6,
    title: "Festival de Capoeira Internacional",
    description: "Evento internacional com grupos de diversos países",
    image_url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    category: "festival",
    event_id: 5,
    photographer: "International Team",
    camera_settings: "Múltiplas câmeras profissionais",
    location: "Arena Anhembi",
    likes: 93,
    views: 672,
    tags: ["festival", "internacional", "grupos", "diversidade"],
    created_at: "2024-01-30T12:00:00.000Z",
    updated_at: "2024-02-01T15:45:00.000Z",
    is_featured: true,
    is_public: true
  },
  {
    id: 7,
    title: "Aula Kids - Primeiros Passos",
    description: "Turma infantil aprendendo os fundamentos da capoeira",
    image_url: "https://images.unsplash.com/photo-1566479179817-0a48a57f484e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1566479179817-0a48a57f484e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    category: "aulas",
    event_id: null,
    photographer: "Fernanda Oliveira",
    camera_settings: "Canon EOS M50, 22mm f/2",
    location: "Academia Principal - Sala Kids",
    likes: 52,
    views: 312,
    tags: ["kids", "infantil", "aula", "fundamentos"],
    created_at: "2024-01-25T16:30:00.000Z",
    updated_at: "2024-01-25T16:30:00.000Z",
    is_featured: false,
    is_public: true
  },
  {
    id: 8,
    title: "Instrumentos Tradicionais",
    description: "Atabaque, pandeiro e berimbau em foco durante a roda",
    image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    category: "instrumentos",
    event_id: null,
    photographer: "José Fernandez",
    camera_settings: "Sony A6400, 35mm f/1.8",
    location: "Academia Principal",
    likes: 28,
    views: 187,
    tags: ["instrumentos", "berimbau", "atabaque", "tradição"],
    created_at: "2024-01-20T13:45:00.000Z",
    updated_at: "2024-01-22T09:30:00.000Z",
    is_featured: false,
    is_public: true
  }
];

// Rota de login
app.post('/api/auth/login', (req, res) => {
    console.log('🔐 Tentativa de login:', req.body);
    
    const { email, password } = req.body;
    
    if (email === 'admin@admin.com' && password === 'admin123') {
        const user = {
            id: 1,
            name: 'Antonio Maria', 
            email: 'admin@admin.com',
            role: 'admin'
        };
        
        const token = 'mock-jwt-token-' + Date.now();
        
        console.log('✅ Login bem-sucedido:', user);
        res.json({ 
            token, 
            user,
            message: 'Login realizado com sucesso'
        });
    } else {
        console.log('❌ Credenciais inválidas');
        res.status(401).json({ 
            message: 'Credenciais inválidas' 
        });
    }
});

// Rota de verificação de token
app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const user = {
            id: 1,
            name: 'Antonio Maria',
            email: 'admin@admin.com', 
            role: 'admin'
        };
        
        res.json({ user });
    } else {
        res.status(401).json({ message: 'Token inválido' });
    }
});

// Rota de estatísticas do dashboard
app.get('/api/dashboard/stats', (req, res) => {
    console.log('📊 Requisição de estatísticas do dashboard');
    res.json(mockStats);
});

// API para gráficos avançados do dashboard
app.get('/api/dashboard/charts/users-growth', (req, res) => {
    console.log('📈 Requisição de gráfico de crescimento de usuários');
    
    // Dados mock para gráfico de crescimento mensal de usuários nos últimos 12 meses
    const monthlyGrowth = [
        { month: 'Jan', users: 45, new_users: 12 },
        { month: 'Fev', users: 62, new_users: 17 },
        { month: 'Mar', users: 78, new_users: 16 },
        { month: 'Abr', users: 95, new_users: 17 },
        { month: 'Mai', users: 114, new_users: 19 },
        { month: 'Jun', users: 135, new_users: 21 },
        { month: 'Jul', users: 158, new_users: 23 },
        { month: 'Ago', users: 182, new_users: 24 },
        { month: 'Set', users: 208, new_users: 26 },
        { month: 'Out', users: 235, new_users: 27 },
        { month: 'Nov', users: 264, new_users: 29 },
        { month: 'Dez', users: 295, new_users: 31 }
    ];
    
    res.json({
        success: true,
        data: monthlyGrowth,
        period: '12 months',
        total_growth: 250
    });
});

app.get('/api/dashboard/charts/events-performance', (req, res) => {
    console.log('🎯 Requisição de gráfico de performance de eventos');
    
    // Dados mock para performance de eventos por categoria
    const eventPerformance = {
        categories: [
            { 
                name: 'Batizados', 
                total_events: 8, 
                avg_participants: 45, 
                revenue: 18500,
                satisfaction: 4.8 
            },
            { 
                name: 'Workshops', 
                total_events: 15, 
                avg_participants: 25, 
                revenue: 12750,
                satisfaction: 4.6 
            },
            { 
                name: 'Rodas', 
                total_events: 24, 
                avg_participants: 35, 
                revenue: 8400,
                satisfaction: 4.9 
            },
            { 
                name: 'Aulas Abertas', 
                total_events: 12, 
                avg_participants: 18, 
                revenue: 3600,
                satisfaction: 4.5 
            }
        ],
        monthly_revenue: [
            { month: 'Jan', revenue: 3200 },
            { month: 'Fev', revenue: 4100 },
            { month: 'Mar', revenue: 3800 },
            { month: 'Abr', revenue: 4500 },
            { month: 'Mai', revenue: 5200 },
            { month: 'Jun', revenue: 4900 }
        ]
    };
    
    res.json({
        success: true,
        data: eventPerformance,
        period: '6 months'
    });
});

app.get('/api/dashboard/charts/registrations-analysis', (req, res) => {
    console.log('📋 Requisição de análise de inscrições');
    
    // Dados mock para análise de inscrições
    const registrationsAnalysis = {
        status_distribution: [
            { status: 'approved', count: 156, percentage: 65 },
            { status: 'pending', count: 42, percentage: 17.5 },
            { status: 'rejected', count: 28, percentage: 11.7 },
            { status: 'cancelled', count: 14, percentage: 5.8 }
        ],
        conversion_rates: [
            { month: 'Jan', applications: 45, approved: 32, rate: 71 },
            { month: 'Fev', applications: 52, approved: 38, rate: 73 },
            { month: 'Mar', applications: 48, approved: 34, rate: 71 },
            { month: 'Abr', applications: 61, approved: 45, rate: 74 },
            { month: 'Mai', applications: 55, approved: 42, rate: 76 },
            { month: 'Jun', applications: 58, approved: 46, rate: 79 }
        ],
        peak_hours: [
            { hour: '08:00', registrations: 12 },
            { hour: '12:00', registrations: 28 },
            { hour: '18:00', registrations: 45 },
            { hour: '20:00', registrations: 38 },
            { hour: '21:00', registrations: 22 }
        ]
    };
    
    res.json({
        success: true,
        data: registrationsAnalysis,
        period: '6 months'
    });
});

app.get('/api/dashboard/charts/financial-overview', (req, res) => {
    console.log('💰 Requisição de overview financeiro');
    
    // Dados mock para overview financeiro
    const financialData = {
        monthly_revenue: [
            { month: 'Jan', revenue: 8500, expenses: 3200, profit: 5300 },
            { month: 'Fev', revenue: 9200, expenses: 3500, profit: 5700 },
            { month: 'Mar', revenue: 8900, expenses: 3100, profit: 5800 },
            { month: 'Abr', revenue: 10500, expenses: 3800, profit: 6700 },
            { month: 'Mai', revenue: 11200, expenses: 4000, profit: 7200 },
            { month: 'Jun', revenue: 12100, expenses: 4200, profit: 7900 }
        ],
        revenue_sources: [
            { source: 'Mensalidades', amount: 45600, percentage: 65 },
            { source: 'Eventos', amount: 18400, percentage: 26 },
            { source: 'Workshops', amount: 4800, percentage: 7 },
            { source: 'Produtos', amount: 1400, percentage: 2 }
        ],
        expense_categories: [
            { category: 'Aluguel', amount: 12000, percentage: 52 },
            { category: 'Equipamentos', amount: 4500, percentage: 19.5 },
            { category: 'Marketing', amount: 2800, percentage: 12.2 },
            { category: 'Manutenção', amount: 2200, percentage: 9.6 },
            { category: 'Outros', amount: 1500, percentage: 6.5 }
        ]
    };
    
    res.json({
        success: true,
        data: financialData,
        period: '6 months',
        total_revenue: 70200,
        total_expenses: 23000,
        net_profit: 47200
    });
});

// ==================== APIS DE PAGAMENTO ====================

// Criar Payment Intent para checkout
app.post('/api/payments/create-payment-intent', async (req, res) => {
    console.log('💳 Criando Payment Intent:', req.body);
    
    const { amount, currency = 'brl', event_id, user_id, user_email, description } = req.body;
    
    try {
        // Em produção, usar Stripe real
        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: amount,
        //     currency: currency,
        //     metadata: {
        //         event_id: event_id,
        //         user_id: user_id
        //     }
        // });
        
        // Mock payment intent para desenvolvimento
        const mockPaymentIntent = {
            id: `pi_mock_${Date.now()}`,
            client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
            amount: amount,
            currency: currency,
            status: 'requires_payment_method',
            created: Math.floor(Date.now() / 1000)
        };
        
        res.json({
            success: true,
            payment_intent: mockPaymentIntent
        });
        
    } catch (error) {
        console.error('❌ Erro ao criar Payment Intent:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Confirmar pagamento
app.post('/api/payments/confirm-payment', async (req, res) => {
    console.log('✅ Confirmando pagamento:', req.body);
    
    const { payment_intent_id, event_id, user_id, user_name, user_email, event_title, amount } = req.body;
    
    try {
        // Em produção, verificar com Stripe
        // const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
        // if (paymentIntent.status !== 'succeeded') {
        //     throw new Error('Pagamento não confirmado');
        // }
        
        // Mock: simular pagamento bem-sucedido
        const newPayment = {
            id: payment_intent_id,
            stripe_payment_intent_id: payment_intent_id,
            user_id: user_id,
            user_name: user_name,
            user_email: user_email,
            event_id: event_id,
            event_title: event_title,
            amount: amount,
            currency: 'brl',
            status: 'succeeded',
            payment_method: 'card',
            payment_method_details: {
                card: {
                    brand: 'visa',
                    last4: '4242',
                    exp_month: 12,
                    exp_year: 2025
                }
            },
            description: `Inscrição - ${event_title}`,
            receipt_email: user_email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        mockPayments.push(newPayment);
        
        // Atualizar status da inscrição para aprovada e paga
        const registrationIndex = mockEventRegistrations.findIndex(
            r => r.event_id === event_id && r.user_id === user_id
        );
        
        if (registrationIndex !== -1) {
            mockEventRegistrations[registrationIndex].status = 'approved';
            mockEventRegistrations[registrationIndex].payment_status = 'paid';
        }
        
        res.json({
            success: true,
            payment: newPayment,
            message: 'Pagamento confirmado com sucesso!'
        });
        
    } catch (error) {
        console.error('❌ Erro ao confirmar pagamento:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Listar pagamentos com filtros
app.get('/api/admin/payments', (req, res) => {
    console.log('💰 Requisição de listagem de pagamentos:', req.query);
    
    const { page = 1, limit = 10, status = '', user_id = '', event_id = '' } = req.query;
    
    let filteredPayments = [...mockPayments];
    
    // Filtros
    if (status) {
        filteredPayments = filteredPayments.filter(payment => payment.status === status);
    }
    
    if (user_id) {
        filteredPayments = filteredPayments.filter(payment => payment.user_id === parseInt(user_id));
    }
    
    if (event_id) {
        filteredPayments = filteredPayments.filter(payment => payment.event_id === parseInt(event_id));
    }
    
    // Ordenar por data mais recente
    filteredPayments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Paginação
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedPayments = filteredPayments.slice(startIndex, endIndex);
    
    const pagination = {
        current_page: parseInt(page),
        total_pages: Math.ceil(filteredPayments.length / parseInt(limit)),
        total_items: filteredPayments.length,
        items_per_page: parseInt(limit)
    };
    
    res.json({
        success: true,
        payments: paginatedPayments,
        pagination: pagination
    });
});

// Estatísticas de pagamentos
app.get('/api/admin/payments/stats', (req, res) => {
    console.log('📊 Requisição de estatísticas de pagamentos');
    
    const totalPayments = mockPayments.length;
    const succeededPayments = mockPayments.filter(p => p.status === 'succeeded');
    const pendingPayments = mockPayments.filter(p => p.status === 'requires_payment_method');
    const failedPayments = mockPayments.filter(p => p.status === 'canceled');
    
    const totalRevenue = succeededPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const averageTicket = succeededPayments.length > 0 ? totalRevenue / succeededPayments.length : 0;
    
    // Receita mensal dos últimos 6 meses
    const monthlyRevenue = {
        'Jan': 12500,
        'Fev': 15800,
        'Mar': 18200,
        'Abr': 16900,
        'Mai': 21300,
        'Jun': 19800
    };
    
    const stats = {
        total_payments: totalPayments,
        succeeded_payments: succeededPayments.length,
        pending_payments: pendingPayments.length,
        failed_payments: failedPayments.length,
        total_revenue: totalRevenue,
        average_ticket: Math.round(averageTicket),
        monthly_revenue: monthlyRevenue,
        success_rate: totalPayments > 0 ? ((succeededPayments.length / totalPayments) * 100).toFixed(1) : 0
    };
    
    res.json({
        success: true,
        stats: stats
    });
});

// Webhook do Stripe (para produção)
app.post('/api/payments/webhook', express.raw({type: 'application/json'}), (req, res) => {
    console.log('🔔 Webhook do Stripe recebido');
    
    // Em produção, verificar assinatura do webhook
    // const sig = req.headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    // Processar diferentes tipos de eventos
    // switch (event.type) {
    //     case 'payment_intent.succeeded':
    //         // Atualizar banco de dados com pagamento confirmado
    //         break;
    //     case 'payment_intent.payment_failed':
    //         // Processar falha no pagamento
    //         break;
    //     default:
    //         console.log(`Evento não tratado: ${event.type}`);
    // }
    
    res.json({received: true});
});

// Reembolsar pagamento
app.post('/api/admin/payments/:paymentId/refund', async (req, res) => {
    console.log(`🔄 Processando reembolso para pagamento ${req.params.paymentId}`);
    
    const paymentId = req.params.paymentId;
    const { reason = 'requested_by_customer' } = req.body;
    
    try {
        const paymentIndex = mockPayments.findIndex(p => p.id === paymentId);
        
        if (paymentIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Pagamento não encontrado'
            });
        }
        
        const payment = mockPayments[paymentIndex];
        
        if (payment.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                error: 'Apenas pagamentos confirmados podem ser reembolsados'
            });
        }
        
        // Em produção, processar reembolso via Stripe
        // const refund = await stripe.refunds.create({
        //     payment_intent: payment.stripe_payment_intent_id,
        //     reason: reason
        // });
        
        // Mock: simular reembolso
        mockPayments[paymentIndex].status = 'refunded';
        mockPayments[paymentIndex].updated_at = new Date().toISOString();
        
        // Atualizar status da inscrição
        const registrationIndex = mockEventRegistrations.findIndex(
            r => r.event_id === payment.event_id && r.user_id === payment.user_id
        );
        
        if (registrationIndex !== -1) {
            mockEventRegistrations[registrationIndex].payment_status = 'refunded';
            mockEventRegistrations[registrationIndex].status = 'cancelled';
        }
        
        res.json({
            success: true,
            message: 'Reembolso processado com sucesso',
            payment: mockPayments[paymentIndex]
        });
        
    } catch (error) {
        console.error('❌ Erro ao processar reembolso:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Listar usuários com paginação, busca e filtros
app.get('/api/admin/users', (req, res) => {
    console.log('👥 Requisição de listagem de usuários:', req.query);
    
    const { page = 1, limit = 10, search = '', role = '', status = '' } = req.query;
    
    let filteredUsers = [...mockUsers];
    
    // Filtro por busca (nome ou email)
    if (search) {
        filteredUsers = filteredUsers.filter(user => 
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Filtro por role
    if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    // Filtro por status
    if (status !== '') {
        const isActive = status === 'true';
        filteredUsers = filteredUsers.filter(user => user.is_active === isActive);
    }
    
    // Paginação
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    const pagination = {
        current_page: parseInt(page),
        total_pages: Math.ceil(filteredUsers.length / parseInt(limit)),
        total_items: filteredUsers.length,
        items_per_page: parseInt(limit)
    };
    
    res.json({
        users: paginatedUsers,
        pagination
    });
});

// Estatísticas dos usuários
app.get('/api/admin/users/stats', (req, res) => {
    console.log('📈 Requisição de estatísticas de usuários');
    
    const total = mockUsers.length;
    const active = mockUsers.filter(u => u.is_active).length;
    const inactive = mockUsers.filter(u => !u.is_active).length;
    const admins = mockUsers.filter(u => u.role === 'admin').length;
    const students = mockUsers.filter(u => u.role === 'student').length;
    
    res.json({
        users: {
            total,
            active,
            inactive, 
            admins,
            students
        }
    });
});

// Criar usuário
app.post('/api/admin/users', (req, res) => {
    console.log('➕ Criando novo usuário:', req.body);
    
    const { name, email, phone, role } = req.body;
    
    // Verificar se email já existe
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email já cadastrado' });
    }
    
    const newUser = {
        id: Math.max(...mockUsers.map(u => u.id)) + 1,
        name,
        email,
        role: role || 'student',
        is_active: true,
        phone: phone || null,
        created_at: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    // Salvar dados no arquivo
    saveData('users', mockUsers);
    
    res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: newUser
    });
});

// Atualizar usuário
app.put('/api/admin/users/:id', (req, res) => {
    console.log(`✏️ Atualizando usuário ${req.params.id}:`, req.body);
    
    const userId = parseInt(req.params.id);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Verificar se email já existe em outro usuário
    if (req.body.email) {
        const existingUser = mockUsers.find(u => u.email === req.body.email && u.id !== userId);
        if (existingUser) {
            return res.status(400).json({ message: 'Email já cadastrado para outro usuário' });
        }
    }
    
    // Atualizar usuário
    mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...req.body
    };
    
    // Salvar dados no arquivo
    saveData('users', mockUsers);
    
    res.json({
        message: 'Usuário atualizado com sucesso',
        user: mockUsers[userIndex]
    });
});

// Deletar usuário
app.delete('/api/admin/users/:id', (req, res) => {
    console.log(`🗑️ Deletando usuário ${req.params.id}`);
    
    const userId = parseInt(req.params.id);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    const deletedUser = mockUsers.splice(userIndex, 1)[0];
    
    // Salvar dados no arquivo
    saveData('users', mockUsers);
    
    res.json({
        message: 'Usuário deletado com sucesso',
        user: deletedUser
    });
});

// ============= EVENTOS APIs =============

// Listar eventos com filtros
app.get('/api/admin/events', (req, res) => {
    console.log('🎉 Requisição de listagem de eventos:', req.query);
    
    const { search = '', status = '', category = '', limit = '12' } = req.query;
    
    let filteredEvents = [...mockEvents];
    
    // Filtro por busca (título, descrição ou local)
    if (search) {
        filteredEvents = filteredEvents.filter(event => 
            event.title.toLowerCase().includes(search.toLowerCase()) ||
            event.description.toLowerCase().includes(search.toLowerCase()) ||
            event.location.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Filtro por status
    if (status) {
        filteredEvents = filteredEvents.filter(event => event.status === status);
    }
    
    // Filtro por categoria
    if (category) {
        filteredEvents = filteredEvents.filter(event => event.category === category);
    }
    
    // Ordenar por data (mais recentes primeiro)
    filteredEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Limitar resultados
    const limitNum = parseInt(limit);
    if (limitNum > 0) {
        filteredEvents = filteredEvents.slice(0, limitNum);
    }
    
    res.json({
        events: filteredEvents,
        total: filteredEvents.length
    });
});

// Estatísticas dos eventos
app.get('/api/admin/events/stats', (req, res) => {
    console.log('📊 Requisição de estatísticas de eventos');
    
    const total = mockEvents.length;
    const active = mockEvents.filter(e => e.status === 'active').length;
    const completed = mockEvents.filter(e => e.status === 'completed').length;
    const cancelled = mockEvents.filter(e => e.status === 'cancelled').length;
    
    res.json({
        events: {
            total,
            active,
            completed,
            cancelled
        }
    });
});

// Obter evento específico
app.get('/api/admin/events/:id', (req, res) => {
    console.log(`🎯 Obtendo evento ${req.params.id}`);
    
    const eventId = parseInt(req.params.id);
    const event = mockEvents.find(e => e.id === eventId);
    
    if (!event) {
        return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    res.json({ event });
});

// Criar evento
app.post('/api/admin/events', (req, res) => {
    console.log('➕ Criando novo evento:', req.body);
    
    const {
        title,
        description,
        date,
        time,
        location,
        max_participants,
        price,
        category
    } = req.body;
    
    // Validações básicas
    if (!title || !description || !date || !time || !location) {
        return res.status(400).json({ message: 'Campos obrigatórios: título, descrição, data, hora e local' });
    }
    
    const newEvent = {
        id: Math.max(...mockEvents.map(e => e.id)) + 1,
        title,
        description,
        date,
        time,
        location,
        max_participants: parseInt(max_participants) || 50,
        price: parseFloat(price) || 0,
        status: 'active',
        category: category || 'geral',
        image_url: null,
        registrations_count: 0,
        confirmed_count: 0,
        available_spots: parseInt(max_participants) || 50,
        created_at: new Date().toISOString()
    };
    
    mockEvents.push(newEvent);
    
    // Salvar dados no arquivo
    saveData('events', mockEvents);
    
    res.status(201).json({
        message: 'Evento criado com sucesso',
        event: newEvent
    });
});

// Atualizar evento
app.put('/api/admin/events/:id', (req, res) => {
    console.log(`✏️ Atualizando evento ${req.params.id}:`, req.body);
    
    const eventId = parseInt(req.params.id);
    const eventIndex = mockEvents.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
        return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    // Atualizar evento
    const updatedEvent = {
        ...mockEvents[eventIndex],
        ...req.body
    };
    
    // Recalcular vagas disponíveis se necessário
    if (req.body.max_participants) {
        updatedEvent.available_spots = parseInt(req.body.max_participants) - updatedEvent.registrations_count;
    }
    
    mockEvents[eventIndex] = updatedEvent;
    
    // Salvar dados no arquivo
    saveData('events', mockEvents);
    
    res.json({
        message: 'Evento atualizado com sucesso',
        event: updatedEvent
    });
});

// Deletar evento
app.delete('/api/admin/events/:id', (req, res) => {
    console.log(`🗑️ Deletando evento ${req.params.id}`);
    
    const eventId = parseInt(req.params.id);
    const eventIndex = mockEvents.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
        return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    const deletedEvent = mockEvents.splice(eventIndex, 1)[0];
    
    // Salvar dados no arquivo
    saveData('events', mockEvents);
    
    res.json({
        message: 'Evento deletado com sucesso',
        event: deletedEvent
    });
});

// ==================== ROTAS DE INSCRIÇÕES DE EVENTOS ====================

// Listar inscrições de um evento específico
app.get('/api/admin/events/:eventId/registrations', (req, res) => {
    console.log(`📋 Listando inscrições do evento ${req.params.eventId}`);
    
    const eventId = parseInt(req.params.eventId);
    const registrations = mockEventRegistrations.filter(r => r.event_id === eventId);
    
    // Ordenar por data de inscrição (mais recentes primeiro)
    registrations.sort((a, b) => new Date(b.registration_date) - new Date(a.registration_date));
    
    res.json({
        registrations: registrations,
        total: registrations.length,
        summary: {
            pending: registrations.filter(r => r.status === 'pending').length,
            approved: registrations.filter(r => r.status === 'approved').length,
            rejected: registrations.filter(r => r.status === 'rejected').length,
            cancelled: registrations.filter(r => r.status === 'cancelled').length
        }
    });
});

// Aprovar/Rejeitar inscrição
app.put('/api/admin/events/:eventId/registrations/:registrationId', (req, res) => {
    console.log(`✅ Atualizando inscrição ${req.params.registrationId} do evento ${req.params.eventId}`);
    
    const eventId = parseInt(req.params.eventId);
    const registrationId = parseInt(req.params.registrationId);
    const { status, notes, payment_status } = req.body;
    
    const registrationIndex = mockEventRegistrations.findIndex(
        r => r.id === registrationId && r.event_id === eventId
    );
    
    if (registrationIndex === -1) {
        return res.status(404).json({ message: 'Inscrição não encontrada' });
    }
    
    // Atualizar dados da inscrição
    const updatedRegistration = {
        ...mockEventRegistrations[registrationIndex],
        status: status || mockEventRegistrations[registrationIndex].status,
        notes: notes !== undefined ? notes : mockEventRegistrations[registrationIndex].notes,
        payment_status: payment_status || mockEventRegistrations[registrationIndex].payment_status,
        updated_at: new Date().toISOString()
    };
    
    mockEventRegistrations[registrationIndex] = updatedRegistration;
    
    // Atualizar contadores do evento
    const event = mockEvents.find(e => e.id === eventId);
    if (event) {
        const eventRegistrations = mockEventRegistrations.filter(r => r.event_id === eventId);
        event.registrations_count = eventRegistrations.length;
        event.confirmed_count = eventRegistrations.filter(r => r.status === 'approved').length;
        event.available_spots = event.max_participants - event.confirmed_count;
    }
    
    res.json({
        message: 'Inscrição atualizada com sucesso',
        registration: updatedRegistration
    });
});

// Cancelar/Remover inscrição
app.delete('/api/admin/events/:eventId/registrations/:registrationId', (req, res) => {
    console.log(`🗑️ Removendo inscrição ${req.params.registrationId} do evento ${req.params.eventId}`);
    
    const eventId = parseInt(req.params.eventId);
    const registrationId = parseInt(req.params.registrationId);
    
    const registrationIndex = mockEventRegistrations.findIndex(
        r => r.id === registrationId && r.event_id === eventId
    );
    
    if (registrationIndex === -1) {
        return res.status(404).json({ message: 'Inscrição não encontrada' });
    }
    
    const deletedRegistration = mockEventRegistrations.splice(registrationIndex, 1)[0];
    
    // Atualizar contadores do evento
    const event = mockEvents.find(e => e.id === eventId);
    if (event) {
        const eventRegistrations = mockEventRegistrations.filter(r => r.event_id === eventId);
        event.registrations_count = eventRegistrations.length;
        event.confirmed_count = eventRegistrations.filter(r => r.status === 'approved').length;
        event.available_spots = event.max_participants - event.confirmed_count;
    }
    
    res.json({
        message: 'Inscrição removida com sucesso',
        registration: deletedRegistration
    });
});

// Criar nova inscrição (para teste)
app.post('/api/admin/events/:eventId/registrations', (req, res) => {
    console.log(`➕ Criando nova inscrição para evento ${req.params.eventId}`);
    
    const eventId = parseInt(req.params.eventId);
    const { user_name, user_email, user_phone, notes } = req.body;
    
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) {
        return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    // Verificar se já existe inscrição com este email
    const existingRegistration = mockEventRegistrations.find(
        r => r.event_id === eventId && r.user_email === user_email
    );
    
    if (existingRegistration) {
        return res.status(400).json({ message: 'Usuário já inscrito neste evento' });
    }
    
    // Criar nova inscrição
    const newRegistration = {
        id: Math.max(...mockEventRegistrations.map(r => r.id)) + 1,
        event_id: eventId,
        user_id: Math.floor(Math.random() * 1000) + 100, // ID fictício
        user_name,
        user_email,
        user_phone,
        status: 'pending',
        registration_date: new Date().toISOString(),
        payment_status: 'pending',
        notes: notes || '',
        created_at: new Date().toISOString()
    };
    
    mockEventRegistrations.push(newRegistration);
    
    // Atualizar contadores do evento
    const eventRegistrations = mockEventRegistrations.filter(r => r.event_id === eventId);
    event.registrations_count = eventRegistrations.length;
    event.confirmed_count = eventRegistrations.filter(r => r.status === 'approved').length;
    event.available_spots = event.max_participants - event.confirmed_count;
    
    res.status(201).json({
        message: 'Inscrição criada com sucesso',
        registration: newRegistration
    });
});

// ===== ROTAS DA GALERIA DE FOTOS =====

// Listar todas as fotos da galeria (público)
app.get('/api/gallery', (req, res) => {
    console.log('📸 Buscando fotos da galeria');
    
    const { category, featured, limit = 20, page = 1, search } = req.query;
    
    let filteredPhotos = mockGalleryPhotos.filter(photo => photo.is_public);
    
    // Filtro por categoria
    if (category && category !== 'all') {
        filteredPhotos = filteredPhotos.filter(photo => photo.category === category);
    }
    
    // Filtro por featured
    if (featured === 'true') {
        filteredPhotos = filteredPhotos.filter(photo => photo.is_featured);
    }
    
    // Busca por título ou tags
    if (search) {
        const searchTerm = search.toLowerCase();
        filteredPhotos = filteredPhotos.filter(photo => 
            photo.title.toLowerCase().includes(searchTerm) ||
            photo.description.toLowerCase().includes(searchTerm) ||
            photo.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    // Ordenar por data de criação (mais recentes primeiro)
    filteredPhotos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Paginação
    const pageSize = parseInt(limit);
    const currentPage = parseInt(page);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedPhotos = filteredPhotos.slice(startIndex, endIndex);
    
    res.json({
        photos: paginatedPhotos,
        pagination: {
            current_page: currentPage,
            per_page: pageSize,
            total: filteredPhotos.length,
            total_pages: Math.ceil(filteredPhotos.length / pageSize),
            has_next: endIndex < filteredPhotos.length,
            has_prev: currentPage > 1
        },
        categories: [...new Set(mockGalleryPhotos.map(p => p.category))],
        total_photos: mockGalleryPhotos.filter(p => p.is_public).length
    });
});

// Buscar foto específica por ID
app.get('/api/gallery/:id', (req, res) => {
    console.log('📸 Buscando foto:', req.params.id);
    
    const photoId = parseInt(req.params.id);
    const photo = mockGalleryPhotos.find(p => p.id === photoId && p.is_public);
    
    if (!photo) {
        return res.status(404).json({ message: 'Foto não encontrada' });
    }
    
    // Incrementar visualizações
    photo.views += 1;
    
    res.json({ photo });
});

// Curtir foto
app.post('/api/gallery/:id/like', (req, res) => {
    console.log('👍 Curtindo foto:', req.params.id);
    
    const photoId = parseInt(req.params.id);
    const photo = mockGalleryPhotos.find(p => p.id === photoId);
    
    if (!photo) {
        return res.status(404).json({ message: 'Foto não encontrada' });
    }
    
    photo.likes += 1;
    
    res.json({ 
        message: 'Foto curtida com sucesso',
        likes: photo.likes
    });
});

// ===== ROTAS ADMIN DA GALERIA =====

// Listar todas as fotos (admin) - incluindo privadas
app.get('/api/admin/gallery', (req, res) => {
    console.log('🔐 [ADMIN] Buscando todas as fotos da galeria');
    
    const { category, is_featured, is_public, limit = 50, page = 1, search } = req.query;
    
    let filteredPhotos = [...mockGalleryPhotos];
    
    // Filtros admin
    if (category && category !== 'all') {
        filteredPhotos = filteredPhotos.filter(photo => photo.category === category);
    }
    
    if (is_featured !== undefined) {
        filteredPhotos = filteredPhotos.filter(photo => photo.is_featured === (is_featured === 'true'));
    }
    
    if (is_public !== undefined) {
        filteredPhotos = filteredPhotos.filter(photo => photo.is_public === (is_public === 'true'));
    }
    
    // Busca
    if (search) {
        const searchTerm = search.toLowerCase();
        filteredPhotos = filteredPhotos.filter(photo => 
            photo.title.toLowerCase().includes(searchTerm) ||
            photo.description.toLowerCase().includes(searchTerm) ||
            photo.photographer.toLowerCase().includes(searchTerm) ||
            photo.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    // Ordenar por data de criação (mais recentes primeiro)
    filteredPhotos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Paginação
    const pageSize = parseInt(limit);
    const currentPage = parseInt(page);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedPhotos = filteredPhotos.slice(startIndex, endIndex);
    
    res.json({
        photos: paginatedPhotos,
        pagination: {
            current_page: currentPage,
            per_page: pageSize,
            total: filteredPhotos.length,
            total_pages: Math.ceil(filteredPhotos.length / pageSize),
            has_next: endIndex < filteredPhotos.length,
            has_prev: currentPage > 1
        },
        categories: [...new Set(mockGalleryPhotos.map(p => p.category))],
        stats: {
            total_photos: mockGalleryPhotos.length,
            public_photos: mockGalleryPhotos.filter(p => p.is_public).length,
            featured_photos: mockGalleryPhotos.filter(p => p.is_featured).length,
            total_views: mockGalleryPhotos.reduce((sum, p) => sum + p.views, 0),
            total_likes: mockGalleryPhotos.reduce((sum, p) => sum + p.likes, 0)
        }
    });
});

// Estatísticas da galeria (admin)
app.get('/api/admin/gallery/stats', (req, res) => {
    console.log('📊 [ADMIN] Estatísticas da galeria');
    
    const stats = {
        total_photos: mockGalleryPhotos.length,
        public_photos: mockGalleryPhotos.filter(p => p.is_public).length,
        private_photos: mockGalleryPhotos.filter(p => !p.is_public).length,
        featured_photos: mockGalleryPhotos.filter(p => p.is_featured).length,
        total_views: mockGalleryPhotos.reduce((sum, p) => sum + p.views, 0),
        total_likes: mockGalleryPhotos.reduce((sum, p) => sum + p.likes, 0),
        categories: mockGalleryPhotos.reduce((acc, photo) => {
            acc[photo.category] = (acc[photo.category] || 0) + 1;
            return acc;
        }, {}),
        photographers: mockGalleryPhotos.reduce((acc, photo) => {
            acc[photo.photographer] = (acc[photo.photographer] || 0) + 1;
            return acc;
        }, {}),
        monthly_uploads: mockGalleryPhotos.reduce((acc, photo) => {
            const month = new Date(photo.created_at).toISOString().slice(0, 7); // YYYY-MM
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {}),
        top_photos: mockGalleryPhotos
            .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
            .slice(0, 5)
            .map(p => ({
                id: p.id,
                title: p.title,
                views: p.views,
                likes: p.likes,
                total_engagement: p.views + p.likes
            }))
    };
    
    res.json({ stats });
});

// Criar nova foto (admin)
app.post('/api/admin/gallery', (req, res) => {
    console.log('📸 [ADMIN] Criando nova foto na galeria');
    
    const { 
        title, 
        description, 
        image_url, 
        thumbnail_url,
        category, 
        event_id,
        photographer,
        camera_settings,
        location,
        tags,
        is_featured = false,
        is_public = true
    } = req.body;
    
    // Validações
    if (!title || !image_url || !category) {
        return res.status(400).json({ 
            message: 'Título, URL da imagem e categoria são obrigatórios' 
        });
    }
    
    const newPhoto = {
        id: Math.max(...mockGalleryPhotos.map(p => p.id)) + 1,
        title: title.trim(),
        description: description?.trim() || '',
        image_url: image_url.trim(),
        thumbnail_url: thumbnail_url || image_url.trim(),
        category: category.trim(),
        event_id: event_id ? parseInt(event_id) : null,
        photographer: photographer?.trim() || 'Não informado',
        camera_settings: camera_settings?.trim() || '',
        location: location?.trim() || '',
        likes: 0,
        views: 0,
        tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: Boolean(is_featured),
        is_public: Boolean(is_public)
    };
    
    mockGalleryPhotos.push(newPhoto);
    
    res.status(201).json({
        message: 'Foto adicionada à galeria com sucesso',
        photo: newPhoto
    });
});

// Atualizar foto (admin)
app.put('/api/admin/gallery/:id', (req, res) => {
    console.log('📝 [ADMIN] Atualizando foto:', req.params.id);
    
    const photoId = parseInt(req.params.id);
    const photoIndex = mockGalleryPhotos.findIndex(p => p.id === photoId);
    
    if (photoIndex === -1) {
        return res.status(404).json({ message: 'Foto não encontrada' });
    }
    
    const updateData = { ...req.body };
    delete updateData.id; // Não permitir alteração do ID
    delete updateData.likes; // Não permitir alteração manual de likes
    delete updateData.views; // Não permitir alteração manual de views
    delete updateData.created_at; // Não permitir alteração da data de criação
    
    // Atualizar apenas os campos fornecidos
    const updatedPhoto = {
        ...mockGalleryPhotos[photoIndex],
        ...updateData,
        updated_at: new Date().toISOString()
    };
    
    mockGalleryPhotos[photoIndex] = updatedPhoto;
    
    res.json({
        message: 'Foto atualizada com sucesso',
        photo: updatedPhoto
    });
});

// Deletar foto (admin)
app.delete('/api/admin/gallery/:id', (req, res) => {
    console.log('🗑️ [ADMIN] Deletando foto:', req.params.id);
    
    const photoId = parseInt(req.params.id);
    const photoIndex = mockGalleryPhotos.findIndex(p => p.id === photoId);
    
    if (photoIndex === -1) {
        return res.status(404).json({ message: 'Foto não encontrada' });
    }
    
    const deletedPhoto = mockGalleryPhotos.splice(photoIndex, 1)[0];
    
    res.json({
        message: 'Foto removida da galeria com sucesso',
        photo: deletedPhoto
    });
});

// Toggle status de destaque (admin)
app.patch('/api/admin/gallery/:id/featured', (req, res) => {
    console.log('⭐ [ADMIN] Alterando status de destaque da foto:', req.params.id);
    
    const photoId = parseInt(req.params.id);
    const photo = mockGalleryPhotos.find(p => p.id === photoId);
    
    if (!photo) {
        return res.status(404).json({ message: 'Foto não encontrada' });
    }
    
    photo.is_featured = !photo.is_featured;
    photo.updated_at = new Date().toISOString();
    
    res.json({
        message: `Foto ${photo.is_featured ? 'adicionada aos' : 'removida dos'} destaques`,
        photo: photo
    });
});

// Toggle visibilidade pública (admin)
app.patch('/api/admin/gallery/:id/visibility', (req, res) => {
    console.log('👁️ [ADMIN] Alterando visibilidade da foto:', req.params.id);
    
    const photoId = parseInt(req.params.id);
    const photo = mockGalleryPhotos.find(p => p.id === photoId);
    
    if (!photo) {
        return res.status(404).json({ message: 'Foto não encontrada' });
    }
    
    photo.is_public = !photo.is_public;
    photo.updated_at = new Date().toISOString();
    
    res.json({
        message: `Foto ${photo.is_public ? 'publicada' : 'ocultada'}`,
        photo: photo
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('❌ Erro do servidor:', err);
    res.status(500).json({ 
        message: 'Erro interno do servidor',
        error: err.message 
    });
});

// Rota 404
app.use('*', (req, res) => {
    console.log('🔍 Rota não encontrada:', req.originalUrl);
    res.status(404).json({ 
        message: 'Rota não encontrada' 
    });
});

// Mock data para mensagens/chat
let mockMessages = [
  {
    id: 1,
    room_id: "general",
    user_id: 1,
    user_name: "Antonio Maria",
    message: "Bem-vindos ao chat da Capoeira Nacional! 🥋",
    timestamp: "2024-12-29T10:00:00.000Z",
    type: "text",
    edited: false,
    edited_at: null
  },
  {
    id: 2,
    room_id: "general",
    user_id: 2,
    user_name: "João Silva",
    message: "Bom dia pessoal! Quando será o próximo treino?",
    timestamp: "2024-12-29T10:15:00.000Z",
    type: "text",
    edited: false,
    edited_at: null
  },
  {
    id: 3,
    room_id: "general",
    user_id: 1,
    user_name: "Antonio Maria",
    message: "O treino será na segunda-feira às 19h. Todos estão convidados!",
    timestamp: "2024-12-29T10:18:00.000Z",
    type: "text",
    edited: false,
    edited_at: null
  },
  {
    id: 4,
    room_id: "instrutores",
    user_id: 1,
    user_name: "Antonio Maria",
    message: "Reunião de instrutores amanhã às 18h para discutir o cronograma",
    timestamp: "2024-12-29T11:00:00.000Z",
    type: "text",
    edited: false,
    edited_at: null
  },
  {
    id: 5,
    room_id: "general",
    user_id: 3,
    user_name: "Maria Santos",
    message: "Posso trazer um amigo no próximo treino?",
    timestamp: "2024-12-29T14:30:00.000Z",
    type: "text",
    edited: false,
    edited_at: null
  },
  {
    id: 6,
    room_id: "general",
    user_id: 4,
    user_name: "Pedro Costa",
    message: "Galera, alguém tem berimbau emprestado? O meu quebrou",
    timestamp: "2024-12-29T15:45:00.000Z",
    type: "text",
    edited: false,
    edited_at: null
  }
];

// Mock data para salas de chat
let mockChatRooms = [
  {
    id: "general",
    name: "Geral",
    description: "Canal principal para conversas gerais",
    type: "public",
    created_by: 1,
    created_at: "2024-12-01T00:00:00.000Z",
    members_count: 25,
    last_activity: "2024-12-29T15:45:00.000Z"
  },
  {
    id: "instrutores",
    name: "Instrutores",
    description: "Canal privado para instrutores",
    type: "private",
    created_by: 1,
    created_at: "2024-12-01T00:00:00.000Z",
    members_count: 3,
    last_activity: "2024-12-29T11:00:00.000Z"
  },
  {
    id: "eventos",
    name: "Eventos",
    description: "Discussões sobre eventos e apresentações",
    type: "public",
    created_by: 1,
    created_at: "2024-12-01T00:00:00.000Z",
    members_count: 18,
    last_activity: "2024-12-28T20:30:00.000Z"
  },
  {
    id: "iniciantes",
    name: "Iniciantes",
    description: "Canal para alunos iniciantes tirarem dúvidas",
    type: "public",
    created_by: 1,
    created_at: "2024-12-01T00:00:00.000Z",
    members_count: 12,
    last_activity: "2024-12-28T18:20:00.000Z"
  }
];

// Mock data para usuários online
let onlineUsers = [
  {
    user_id: 1,
    user_name: "Antonio Maria",
    status: "online",
    last_seen: new Date().toISOString(),
    room_id: "general"
  },
  {
    user_id: 2,
    user_name: "João Silva", 
    status: "online",
    last_seen: new Date().toISOString(),
    room_id: "general"
  },
  {
    user_id: 3,
    user_name: "Maria Santos",
    status: "away",
    last_seen: "2024-12-29T14:35:00.000Z",
    room_id: null
  }
];

// ============ ROTAS DO CHAT/MENSAGENS ============

// Listar salas de chat
app.get('/api/chat/rooms', (req, res) => {
    try {
        // Simular filtro por tipo se necessário
        const { type } = req.query;
        let rooms = [...mockChatRooms];
        
        if (type) {
            rooms = rooms.filter(room => room.type === type);
        }
        
        res.json({
            success: true,
            data: rooms
        });
    } catch (error) {
        console.error('Erro ao buscar salas:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// Obter mensagens de uma sala
app.get('/api/chat/rooms/:roomId/messages', (req, res) => {
    try {
        const { roomId } = req.params;
        const { limit = 50, before } = req.query;
        
        let messages = mockMessages.filter(msg => msg.room_id === roomId);
        
        // Filtrar mensagens antes de uma data específica (paginação)
        if (before) {
            messages = messages.filter(msg => new Date(msg.timestamp) < new Date(before));
        }
        
        // Ordenar por timestamp decrescente e limitar
        messages = messages
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, parseInt(limit));
        
        res.json({
            success: true,
            data: messages.reverse(), // Reverter para ordem cronológica
            has_more: messages.length === parseInt(limit)
        });
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// Enviar mensagem
app.post('/api/chat/rooms/:roomId/messages', (req, res) => {
    try {
        const { roomId } = req.params;
        const { message, user_id, user_name, type = 'text' } = req.body;
        
        if (!message || !user_id || !user_name) {
            return res.status(400).json({
                success: false,
                message: 'Mensagem, user_id e user_name são obrigatórios'
            });
        }
        
        const newMessage = {
            id: mockMessages.length + 1,
            room_id: roomId,
            user_id,
            user_name,
            message,
            timestamp: new Date().toISOString(),
            type,
            edited: false,
            edited_at: null
        };
        
        mockMessages.push(newMessage);
        
        // Atualizar última atividade da sala
        const room = mockChatRooms.find(r => r.id === roomId);
        if (room) {
            room.last_activity = newMessage.timestamp;
        }
        
        res.status(201).json({
            success: true,
            data: newMessage
        });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// Listar usuários online
app.get('/api/chat/online-users', (req, res) => {
    try {
        const { room_id } = req.query;
        
        let users = [...onlineUsers];
        
        if (room_id) {
            users = users.filter(user => user.room_id === room_id);
        }
        
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Erro ao buscar usuários online:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// Atualizar status do usuário
app.patch('/api/chat/users/:userId/status', (req, res) => {
    try {
        const { userId } = req.params;
        const { status, room_id } = req.body;
        
        let user = onlineUsers.find(u => u.user_id === parseInt(userId));
        
        if (!user) {
            // Criar novo usuário online
            const userData = mockUsers.find(u => u.id === parseInt(userId));
            if (!userData) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }
            
            user = {
                user_id: userData.id,
                user_name: userData.name,
                status: status || 'online',
                last_seen: new Date().toISOString(),
                room_id: room_id || null
            };
            onlineUsers.push(user);
        } else {
            // Atualizar usuário existente
            user.status = status || user.status;
            user.room_id = room_id !== undefined ? room_id : user.room_id;
            user.last_seen = new Date().toISOString();
        }
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// Criar nova sala (admin)
app.post('/api/chat/rooms', (req, res) => {
    try {
        const { name, description, type = 'public', created_by } = req.body;
        
        if (!name || !created_by) {
            return res.status(400).json({
                success: false,
                message: 'Nome e created_by são obrigatórios'
            });
        }
        
        const roomId = name.toLowerCase().replace(/\s+/g, '-');
        
        // Verificar se já existe
        if (mockChatRooms.find(r => r.id === roomId)) {
            return res.status(400).json({
                success: false,
                message: 'Já existe uma sala com este nome'
            });
        }
        
        const newRoom = {
            id: roomId,
            name,
            description,
            type,
            created_by,
            created_at: new Date().toISOString(),
            members_count: 1,
            last_activity: new Date().toISOString()
        };
        
        mockChatRooms.push(newRoom);
        
        res.status(201).json({
            success: true,
            data: newRoom
        });
    } catch (error) {
        console.error('Erro ao criar sala:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// Estatísticas do chat (admin)
app.get('/api/admin/chat/stats', (req, res) => {
    try {
        const totalRooms = mockChatRooms.length;
        const totalMessages = mockMessages.length;
        const onlineCount = onlineUsers.filter(u => u.status === 'online').length;
        
        // Mensagens por dia (últimos 7 dias)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayStart = new Date(date.setHours(0, 0, 0, 0));
            const dayEnd = new Date(date.setHours(23, 59, 59, 999));
            
            const messagesCount = mockMessages.filter(msg => {
                const msgDate = new Date(msg.timestamp);
                return msgDate >= dayStart && msgDate <= dayEnd;
            }).length;
            
            last7Days.push({
                date: dayStart.toISOString().split('T')[0],
                messages: messagesCount
            });
        }
        
        // Salas mais ativas
        const roomActivity = mockChatRooms.map(room => {
            const messagesCount = mockMessages.filter(msg => msg.room_id === room.id).length;
            return {
                room_name: room.name,
                messages_count: messagesCount,
                members_count: room.members_count
            };
        }).sort((a, b) => b.messages_count - a.messages_count);
        
        res.json({
            success: true,
            data: {
                overview: {
                    total_rooms: totalRooms,
                    total_messages: totalMessages,
                    online_users: onlineCount,
                    active_rooms: mockChatRooms.filter(r => {
                        const lastActivity = new Date(r.last_activity);
                        const today = new Date();
                        return (today - lastActivity) < 24 * 60 * 60 * 1000; // Últimas 24h
                    }).length
                },
                messages_by_day: last7Days,
                room_activity: roomActivity.slice(0, 5)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas do chat:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🚀 Servidor backend rodando na porta', PORT);
    console.log('🌐 API disponível em: http://localhost:' + PORT);
    console.log('📝 Rotas disponíveis:');
    console.log('  POST /api/auth/login');
    console.log('  GET  /api/auth/me');
    console.log('  GET  /api/dashboard/stats');
    console.log('  GET  /api/dashboard/charts/users-growth');
    console.log('  GET  /api/dashboard/charts/events-performance');
    console.log('  GET  /api/dashboard/charts/registrations-analysis');
    console.log('  GET  /api/dashboard/charts/financial-overview');
    console.log('  GET  /api/admin/users');
    console.log('  GET  /api/admin/users/stats');
    console.log('  POST /api/admin/users');
    console.log('  PUT  /api/admin/users/:id');
    console.log('  DELETE /api/admin/users/:id');
    console.log('  GET  /api/admin/events');
    console.log('  GET  /api/admin/events/stats');
    console.log('  GET  /api/admin/events/:id');
    console.log('  POST /api/admin/events');
    console.log('  PUT  /api/admin/events/:id');
    console.log('  DELETE /api/admin/events/:id');
    console.log('  GET  /api/admin/events/:eventId/registrations');
    console.log('  PUT  /api/admin/events/:eventId/registrations/:registrationId');
    console.log('  DELETE /api/admin/events/:eventId/registrations/:registrationId');
    console.log('  POST /api/payments/create-payment-intent');
    console.log('  POST /api/payments/confirm-payment');
    console.log('  GET  /api/admin/payments');
    console.log('  GET  /api/admin/payments/stats');
    console.log('  POST /api/payments/webhook');
    console.log('  POST /api/admin/payments/:paymentId/refund');
    console.log('  GET  /api/gallery');
    console.log('  GET  /api/gallery/:id');
    console.log('  POST /api/gallery/:id/like');
    console.log('  GET  /api/admin/gallery');
    console.log('  GET  /api/admin/gallery/stats');
    console.log('  POST /api/admin/gallery');
    console.log('  PUT  /api/admin/gallery/:id');
    console.log('  DELETE /api/admin/gallery/:id');
    console.log('  PATCH /api/admin/gallery/:id/featured');
    console.log('  PATCH /api/admin/gallery/:id/visibility');
    console.log('  GET  /api/chat/rooms');
    console.log('  GET  /api/chat/rooms/:roomId/messages');
    console.log('  POST /api/chat/rooms/:roomId/messages');
    console.log('  GET  /api/chat/online-users');
    console.log('  PATCH /api/chat/users/:userId/status');
    console.log('  POST /api/chat/rooms');
    console.log('  GET  /api/admin/chat/stats');
});