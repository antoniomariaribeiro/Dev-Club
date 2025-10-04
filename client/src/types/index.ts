export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'student';
  avatar?: string;
  birth_date?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  event_date: string;
  end_date?: string;
  location: string;
  address?: string;
  price: number;
  max_participants?: number;
  image?: string;
  status: 'draft' | 'published' | 'cancelled' | 'finished';
  is_featured: boolean;
  registration_deadline?: string;
  requirements?: string;
  what_to_bring?: string;
  instructor?: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  userRegistration?: EventRegistration;
  totalRegistrations?: number;
}

export interface EventRegistration {
  id: number;
  user_id: number;
  event_id: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded' | 'free';
  registration_date: string;
  notes?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  old_price?: number;
  category: 'instruments' | 'clothing' | 'accessories' | 'books' | 'multimedia';
  brand?: string;
  sku?: string;
  stock_quantity: number;
  images?: string[];
  status: 'active' | 'inactive' | 'out_of_stock';
  is_featured: boolean;
  tags?: string[];
}

export interface Gallery {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  category: 'events' | 'training' | 'performances' | 'academy' | 'competitions';
  photographer?: string;
  event_date?: string;
  location?: string;
  is_featured: boolean;
  views: number;
  likes: number;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  message?: string;
  interest_type: 'classes' | 'events' | 'workshops' | 'performances' | 'general';
  experience_level: 'none' | 'beginner' | 'intermediate' | 'advanced';
  preferred_schedule: 'morning' | 'afternoon' | 'evening' | 'weekend' | 'flexible';
  status: 'new' | 'contacted' | 'enrolled' | 'not_interested';
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'student';
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}