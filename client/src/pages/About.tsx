import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme, Container } from '../styles/theme';

const AboutContainer = styled.div`
  padding: ${theme.spacing.xxl} 0;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%);
  color: white;
  padding: ${theme.spacing.xxl} 0;
  text-align: center;

  h1 {
    font-size: 3rem;
    margin-bottom: ${theme.spacing.lg};

    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.25rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const ContentSection = styled.section`
  padding: ${theme.spacing.xxl} 0;
  background: ${theme.colors.surface};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xxl};
  align-items: center;
  margin-bottom: ${theme.spacing.xxl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
  }

  &:nth-child(even) {
    .content {
      order: 2;
    }
    .image {
      order: 1;
    }
  }
`;

const ContentText = styled(motion.div)`
  h2 {
    color: ${theme.colors.primary};
    font-size: 2rem;
    margin-bottom: ${theme.spacing.lg};
  }

  p {
    color: ${theme.colors.text.secondary};
    line-height: 1.8;
    margin-bottom: ${theme.spacing.md};
    font-size: 1.1rem;
  }
`;

const ContentImage = styled(motion.div)`
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.md};
  }
`;

const ValuesSection = styled.section`
  padding: ${theme.spacing.xxl} 0;
  background: ${theme.colors.background};
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};
`;

const ValueCard = styled(motion.div)`
  background: ${theme.colors.surface};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  text-align: center;
  box-shadow: ${theme.shadows.sm};

  h3 {
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.md};
  }

  p {
    color: ${theme.colors.text.secondary};
    line-height: 1.6;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};

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

const About: React.FC = () => {
  return (
    <AboutContainer>
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Academia Capoeira Nacional</h1>
            <p>
              Conheça nossa história, filosofia e a tradição por trás desta arte marcial 
              que une música, dança e luta em uma expressão cultural única.
            </p>
          </motion.div>
        </Container>
      </HeroSection>

      {/* Content Sections */}
      <ContentSection>
        <Container>
          <ContentGrid>
            <ContentText
              className="content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2>A História da Capoeira</h2>
              <p>
                A capoeira nasceu no Brasil durante o período colonial, criada pelos escravos 
                africanos como uma forma de resistência e preservação cultural. Disfarçada 
                como dança para escapar da repressão, a capoeira combina elementos de luta, 
                música e arte.
              </p>
              <p>
                Ao longo dos séculos, evoluiu de uma prática marginalizada para um patrimônio 
                cultural brasileiro reconhecido mundialmente. Em 2014, foi declarada Patrimônio 
                Cultural Imaterial da Humanidade pela UNESCO.
              </p>
            </ContentText>
            
            <ContentImage
              className="image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="História da Capoeira"
              />
            </ContentImage>
          </ContentGrid>

          <ContentGrid>
            <ContentText
              className="content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2>Os Elementos da Capoeira</h2>
              <p>
                A capoeira é muito mais que uma luta. É uma expressão completa que envolve 
                movimentos acrobáticos, música ao vivo com instrumentos tradicionais como 
                berimbau, pandeiro e atabaque, e cantos que contam histórias e transmitem 
                ensinamentos.
              </p>
              <p>
                Na roda de capoeira, os jogadores se enfrentam em um diálogo corporal, 
                onde agilidade, criatividade e respeito mútuo são fundamentais. Cada 
                movimento conta uma história, cada música carrega uma tradição.
              </p>
            </ContentText>
            
            <ContentImage
              className="image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Elementos da Capoeira"
              />
            </ContentImage>
          </ContentGrid>

          <ContentGrid>
            <ContentText
              className="content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2>Capoeira Hoje</h2>
              <p>
                Atualmente, a capoeira é praticada em mais de 160 países, levando a cultura 
                brasileira para todos os cantos do mundo. É uma ferramenta de inclusão social, 
                educação e desenvolvimento pessoal que atrai pessoas de todas as idades.
              </p>
              <p>
                Nossa academia mantém viva essa tradição, ensinando não apenas os movimentos, 
                mas também os valores de respeito, disciplina, criatividade e união que fazem 
                da capoeira uma filosofia de vida.
              </p>
            </ContentText>
            
            <ContentImage
              className="image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Capoeira Moderna"
              />
            </ContentImage>
          </ContentGrid>
        </Container>
      </ContentSection>

      {/* Values Section */}
      <ValuesSection>
        <Container>
          <SectionHeader>
            <h2>Nossos Valores</h2>
            <p>
              A capoeira nos ensina valores fundamentais que levamos para toda a vida, 
              construindo não apenas melhores capoeiristas, mas melhores pessoas.
            </p>
          </SectionHeader>

          <ValuesGrid>
            <ValueCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3>Respeito</h3>
              <p>
                O respeito pelo mestre, pelos colegas e pela tradição é fundamental. 
                Aprendemos a valorizar diferentes perspectivas e a crescer através 
                da troca de experiências.
              </p>
            </ValueCard>

            <ValueCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3>Disciplina</h3>
              <p>
                A prática regular e dedicada desenvolve autodisciplina, perseverança 
                e a capacidade de superar desafios tanto na capoeira quanto na vida.
              </p>
            </ValueCard>

            <ValueCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3>Criatividade</h3>
              <p>
                Cada jogador desenvolve seu próprio estilo, estimulando a expressão 
                individual dentro de uma tradição coletiva. A criatividade é celebrada 
                e incentivada.
              </p>
            </ValueCard>

            <ValueCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3>União</h3>
              <p>
                A roda de capoeira é um círculo de energia onde todos são iguais. 
                Construímos uma família unida pela paixão por esta arte maravilhosa.
              </p>
            </ValueCard>

            <ValueCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3>Tradição</h3>
              <p>
                Preservamos e transmitimos os conhecimentos ancestrais, mantendo viva 
                a rica herança cultural que nos foi deixada pelos mestres antigos.
              </p>
            </ValueCard>

            <ValueCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h3>Alegria</h3>
              <p>
                A capoeira é celebração! A música, o sorriso e a alegria de estar 
                junto fazem de cada treino uma festa da cultura brasileira.
              </p>
            </ValueCard>
          </ValuesGrid>
        </Container>
      </ValuesSection>
    </AboutContainer>
  );
};

export default About;