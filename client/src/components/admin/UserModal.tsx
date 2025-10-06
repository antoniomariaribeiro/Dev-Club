import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Eye, EyeOff, Save, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import userService, { 
  User as UserType, 
  CreateUserData, 
  UpdateUserData 
} from '../../services/userService';

type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  user?: UserType | null;
  mode: 'create' | 'edit';
}

// ============ STYLED COMPONENTS ============
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContainer = styled(motion.div)`
  background: linear-gradient(135deg, rgba(45, 55, 72, 0.98) 0%, rgba(55, 65, 81, 0.98) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  color: white;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CloseButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }
  
  &:invalid {
    border-color: #ef4444;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255, 255, 255, 0.15);
  }
  
  option {
    background: #4a5568;
    color: white;
  }
`;

const PasswordInputContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: white;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 5px;
`;



const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 25px 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Button = styled(motion.button)<{ 
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}>`
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          color: #2d3748;
        `;
      case 'danger':
        return `
          background: linear-gradient(45deg, #ef4444, #dc2626);
          color: white;
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
    }
  }}
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
`;

const StatusBadge = styled.div<{ status: UserStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        `;
      case 'inactive':
        return `
          background: rgba(107, 114, 128, 0.2);
          color: #6b7280;
          border: 1px solid rgba(107, 114, 128, 0.3);
        `;
      case 'pending':
        return `
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        `;
      case 'suspended':
        return `
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
    }
  }}
`;

// ============ COMPONENT ============
const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  mode
}) => {
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student',
    status: 'active'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when user changes
  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        phone: user.phone || '',
        role: user.role,
        status: user.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'student',
        status: 'active'
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  // Handle input changes
  const handleChange = (field: keyof CreateUserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'create') {
        await userService.createUser(formData);
        toast.success('Usuário criado com sucesso!');
      } else if (mode === 'edit' && user) {
        const updateData: UpdateUserData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: formData.status
        };
        
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await userService.updateUser(user.id, updateData);
        toast.success('Usuário atualizado com sucesso!');
      }
      
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar usuário');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>
                {mode === 'create' ? <UserPlus size={24} /> : <User size={24} />}
                {mode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
              </ModalTitle>
              <CloseButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <form onSubmit={handleSubmit}>
              <ModalBody>
                <FormGrid>
                  <FormGroup>
                    <Label>Nome *</Label>
                    <Input
                      type="text"
                      placeholder="Nome completo"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                    {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <Label>Telefone</Label>
                    <Input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      {mode === 'create' ? 'Senha *' : 'Nova Senha'}
                      {mode === 'edit' && ' (deixe em branco para manter)'}
                    </Label>
                    <PasswordInputContainer>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={mode === 'create' ? 'Digite a senha' : 'Nova senha'}
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                      />
                      <PasswordToggle
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </PasswordToggle>
                    </PasswordInputContainer>
                    {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <Label>Role</Label>
                    <Select
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                    >
                      <option value="student">Aluno</option>
                      <option value="instructor">Instrutor</option>
                      <option value="manager">Gerente</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value as UserStatus)}
                    >
                      <option value="active">Ativo</option>
                      <option value="pending">Pendente</option>
                      <option value="inactive">Inativo</option>
                      <option value="suspended">Suspenso</option>
                    </Select>
                  </FormGroup>
                </FormGrid>

                {mode === 'edit' && user && (
                  <div style={{ marginBottom: '20px' }}>
                    <Label>Status Atual</Label>
                    <StatusBadge status={user.status}>
                      {user.status}
                    </StatusBadge>
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button type="button" onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Salvando...' : mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
                </Button>
              </ModalFooter>
            </form>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default UserModal;