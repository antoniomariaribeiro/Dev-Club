import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { 
  Users, 
  Calendar, 
  Trophy, 
  Music, 
  ArrowRight, 
  Star,
  Play
} from 'lucide-react';
import { theme, Container, Button, Input, Textarea, Card } from '../styles/theme';
import api from '../services/api';

// Styled Components
const HeroSection = styled.section`
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.95) 0%, rgba(102, 187, 106, 0.95) 100%),
              url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
  color: white;
  position: relative;
`;

const HeroContent = styled(Container)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xxl};
  align-items: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: ${theme.spacing.xl};
  }
`;

const HeroText = styled.div`
  h1 {
    font-size: 3.5rem;
    font-weight: bold;
    margin-bottom: ${theme.spacing.lg};
    line-height: 1.2;

    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.25rem;
    opacity: 0.9;
    margin-bottom: ${theme.spacing.xl};
    line-height: 1.6;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const ContactForm = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  color: ${theme.colors.text.primary};

  h3 {
    color: ${theme.colors.primary};
    text-align: center;
    margin-bottom: ${theme.spacing.lg};
  }
`;

const FormGrid = styled.div`
  display: grid;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.paper};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  background: ${theme.colors.surface};
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

const StatsSection = styled.section`
  padding: ${theme.spacing.xxl} 0;
  background: ${theme.colors.surface};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.xl};
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: ${theme.spacing.xl};

  .icon {
    background: ${theme.colors.primary};
    color: white;
    width: 60px;
    height: 60px;
    border-radius: ${theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing.md};
  }

  .number {
    font-size: 3rem;
    font-weight: bold;
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.sm};
  }

  .label {
    color: ${theme.colors.text.secondary};
    font-weight: 500;
  }
`;

const FeaturesSection = styled.section`
  padding: ${theme.spacing.xxl} 0;
  background: ${theme.colors.background};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xxl};

  h2 {
    color: ${theme.colors.text.primary};
    font-size: 2.5rem;
    margin-bottom: ${theme.spacing.md};
  }

  p {
    color: ${theme.colors.text.secondary};
    font-size: 1.125rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.xl};
`;

const FeatureCard = styled(motion.div)`
  background: ${theme.colors.surface};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  text-align: center;
  box-shadow: ${theme.shadows.sm};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-4px);
  }

  .icon {
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryLight});
    color: white;
    width: 80px;
    height: 80px;
    border-radius: ${theme.borderRadius.full};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing.lg};
  }

  h3 {
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.md};
  }

  p {
    color: ${theme.colors.text.secondary};
    line-height: 1.6;
  }
`;

// Schema de validação
const contactSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(2, 'Nome muito curto'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: yup.string().optional(),
  age: yup.number().optional().min(3, 'Idade mínima: 3 anos').max(120, 'Idade máxima: 120 anos'),
  interest_type: yup.string().required('Tipo de interesse é obrigatório'),
  experience_level: yup.string().required('Nível de experiência é obrigatório'),
  preferred_schedule: yup.string().required('Horário preferido é obrigatório'),
  message: yup.string().optional()
});

type ContactFormData = yup.InferType<typeof contactSchema>;

const Home: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema) as any
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      await api.post('/contacts', data);
      toast.success('Sua mensagem foi enviada! Entraremos em contato em breve.');
      reset();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao enviar mensagem';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeroText>
              <h1>Academia Capoeira Nacional - Descubra a Arte da Capoeira</h1>
              <p>
                Venha fazer parte da nossa família! Aprenda capoeira com os melhores mestres, 
                desenvolva seu corpo e mente enquanto se conecta com uma rica tradição cultural brasileira.
              </p>
              
              <HeroButtons>
                <Button size="lg">
                  Começar Agora <ArrowRight size={20} />
                </Button>
                <Button variant="outline" size="lg">
                  <Play size={20} /> Assistir Vídeo
                </Button>
              </HeroButtons>
            </HeroText>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ContactForm>
              <h3>Demonstre seu Interesse</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormGrid>
                  <FormRow>
                    <div>
                      <Input
                        {...register('name')}
                        placeholder="Seu nome"
                        className={errors.name ? 'error' : ''}
                      />
                      {errors.name && <p style={{color: theme.colors.error, fontSize: '0.875rem'}}>{errors.name.message}</p>}
                    </div>
                    
                    <div>
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="Seu email"
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <p style={{color: theme.colors.error, fontSize: '0.875rem'}}>{errors.email.message}</p>}
                    </div>
                  </FormRow>

                  <FormRow>
                    <div>
                      <Input
                        {...register('phone')}
                        placeholder="Telefone (opcional)"
                      />
                    </div>
                    
                    <div>
                      <Input
                        {...register('age')}
                        type="number"
                        placeholder="Idade (opcional)"
                        min="3"
                        max="120"
                      />
                    </div>
                  </FormRow>

                  <Select {...register('interest_type')}>
                    <option value="">Interesse em...</option>
                    <option value="classes">Aulas regulares</option>
                    <option value="events">Eventos especiais</option>
                    <option value="workshops">Workshops</option>
                    <option value="performances">Apresentações</option>
                    <option value="general">Informações gerais</option>
                  </Select>

                  <FormRow>
                    <Select {...register('experience_level')}>
                      <option value="">Nível de experiência</option>
                      <option value="none">Nenhuma experiência</option>
                      <option value="beginner">Iniciante</option>
                      <option value="intermediate">Intermediário</option>
                      <option value="advanced">Avançado</option>
                    </Select>

                    <Select {...register('preferred_schedule')}>
                      <option value="">Horário preferido</option>
                      <option value="morning">Manhã</option>
                      <option value="afternoon">Tarde</option>
                      <option value="evening">Noite</option>
                      <option value="weekend">Fim de semana</option>
                      <option value="flexible">Flexível</option>
                    </Select>
                  </FormRow>

                  <Textarea
                    {...register('message')}
                    placeholder="Deixe uma mensagem (opcional)"
                    rows={3}
                  />
                </FormGrid>

                <Button 
                  type="submit" 
                  fullWidth 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Interesse'}
                </Button>
              </form>
            </ContactForm>
          </motion.div>
        </HeroContent>
      </HeroSection>

      {/* Stats Section */}
      <StatsSection>
        <Container>
          <StatsGrid>
            <StatCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="icon">
                <Users size={24} />
              </div>
              <div className="number">500+</div>
              <div className="label">Alunos Ativos</div>
            </StatCard>

            <StatCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="icon">
                <Calendar size={24} />
              </div>
              <div className="number">15</div>
              <div className="label">Anos de Experiência</div>
            </StatCard>

            <StatCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="icon">
                <Trophy size={24} />
              </div>
              <div className="number">100+</div>
              <div className="label">Campeonatos</div>
            </StatCard>

            <StatCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="icon">
                <Music size={24} />
              </div>
              <div className="number">24/7</div>
              <div className="label">Música e Alegria</div>
            </StatCard>
          </StatsGrid>
        </Container>
      </StatsSection>

      {/* Features Section */}
      <FeaturesSection>
        <Container>
          <SectionHeader>
            <h2>Por que Escolher a Capoeira Nacional?</h2>
            <p>
              Oferecemos uma experiência completa de capoeira, combinando tradição, 
              técnica e diversão em um ambiente acolhedor e profissional.
            </p>
          </SectionHeader>

          <FeaturesGrid>
            <FeatureCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="icon">
                <Star size={32} />
              </div>
              <h3>Mestres Qualificados</h3>
              <p>
                Aprenda com mestres experientes que dominam tanto a técnica 
                quanto a filosofia da capoeira, garantindo um aprendizado completo.
              </p>
            </FeatureCard>

            <FeatureCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="icon">
                <Users size={32} />
              </div>
              <h3>Turmas para Todos</h3>
              <p>
                Oferecemos aulas para crianças, adolescentes e adultos, 
                com horários flexíveis que se adaptam à sua rotina.
              </p>
            </FeatureCard>

            <FeatureCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="icon">
                <Trophy size={32} />
              </div>
              <h3>Eventos e Competições</h3>
              <p>
                Participe de rodas, workshops e competições que enriquecem 
                sua experiência e conectam você com a comunidade da capoeira.
              </p>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </FeaturesSection>
    </>
  );
};

export default Home;