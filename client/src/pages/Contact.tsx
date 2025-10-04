import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { theme, Container } from '../styles/theme';

const ContactContainer = styled(Container)`
  padding: 2rem;
  min-height: 80vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: ${theme.colors.primary};
  margin-bottom: 1rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactForm = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ContactInfo = styled(motion.div)`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, #4A7C59 100%);
  padding: 2rem;
  border-radius: 15px;
  color: white;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${theme.colors.primaryLight};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${theme.colors.primaryLight};
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, #4A7C59 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InfoIcon = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const InfoText = styled.p`
  margin: 0;
  opacity: 0.9;
  line-height: 1.5;
`;

const MapContainer = styled.div`
  margin-top: 3rem;
  height: 400px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const MapFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 15px;
`;

const MapTitle = styled.h2`
  text-align: center;
  color: ${theme.colors.primary};
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 700;
`;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica para enviar o formulário
    console.log('Form submitted:', formData);
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <ContactContainer>
      <Header>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>Contato</Title>
          <Subtitle>
            Entre em contato conosco para tirar suas dúvidas, conhecer nossa academia
            ou agendar uma aula experimental gratuita.
          </Subtitle>
        </motion.div>
      </Header>

      <ContactGrid>
        <ContactForm
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 style={{ color: theme.colors.primary, marginBottom: '1.5rem' }}>Envie sua Mensagem</h2>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">E-mail</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="subject">Assunto</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="message">Mensagem</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Conte-nos como podemos ajudá-lo..."
                required
              />
            </FormGroup>

            <SubmitButton
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send size={20} />
              Enviar Mensagem
            </SubmitButton>
          </form>
        </ContactForm>

        <ContactInfo
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>
            Academia Capoeira Nacional
          </h2>

          <InfoItem>
            <InfoIcon>
              <MapPin size={24} />
            </InfoIcon>
            <InfoContent>
              <InfoTitle>Endereço</InfoTitle>
              <InfoText>
                R. Dr. Américo Figueiredo, 1939<br />
                Wanel Ville - Sorocaba, SP<br />
                CEP: 18055-132
              </InfoText>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <Phone size={24} />
            </InfoIcon>
            <InfoContent>
              <InfoTitle>Telefones</InfoTitle>
              <InfoText>
                (15) 99108-0218 - Mestre<br />
                (15) 98812-6428
              </InfoText>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <Mail size={24} />
            </InfoIcon>
            <InfoContent>
              <InfoTitle>E-mail</InfoTitle>
              <InfoText>
                contato@capoeiraacional.com.br<br />
                sorocaba@capoeiraacional.com.br
              </InfoText>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <Clock size={24} />
            </InfoIcon>
            <InfoContent>
              <InfoTitle>Horário de Funcionamento</InfoTitle>
              <InfoText>
                Segunda a Sexta: 6h às 22h<br />
                Sábados: 7h às 18h<br />
                Domingos: 8h às 16h
              </InfoText>
            </InfoContent>
          </InfoItem>
        </ContactInfo>
      </ContactGrid>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <MapTitle>Nossa Localização</MapTitle>
        <Subtitle style={{ marginBottom: '2rem', textAlign: 'center' }}>
          Estamos localizados no bairro Wanel Ville, em Sorocaba. Venha nos visitar!
        </Subtitle>
        <MapContainer>
          <MapFrame
            src="https://maps.google.com/maps?q=R.+Dr.+Américo+Figueiredo,+1939+-+Wanel+Ville,+Sorocaba+-+SP,+18055-132,+Brasil&t=&z=16&ie=UTF8&iwloc=&output=embed"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Academia Capoeira Nacional - Localização em Sorocaba"
          ></MapFrame>
        </MapContainer>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '15px',
            border: `2px solid ${theme.colors.primaryLight}`
          }}
        >
          <h3 style={{ color: theme.colors.primary, marginBottom: '1rem' }}>
            Como Chegar
          </h3>
          <p style={{ color: '#666', lineHeight: 1.6, margin: 0 }}>
            <strong>Transporte Público:</strong> Diversas linhas de ônibus passam próximo à academia<br />
            <strong>Carro:</strong> Estacionamento disponível na rua<br />
            <strong>Pontos de Referência:</strong> Próximo ao Shopping Wanel Ville e farmácias da região
          </p>
        </motion.div>
      </motion.div>
    </ContactContainer>
  );
};

export default Contact;