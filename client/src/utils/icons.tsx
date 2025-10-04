import React from 'react';
import { IconType } from 'react-icons';
import {
  FiUsers,
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiMail,
  FiPhone,
  FiUser,
  FiMessageSquare,
  FiEdit3,
  FiTrash2,
  FiX,
  FiRefreshCw,
  FiDownload,
  FiDollarSign,
  FiTrendingUp,
  FiTarget,
  FiActivity,
  FiEye,
  FiBarChart,
  FiPieChart,
  FiInfo,
  FiFilter,
  FiSearch,
  FiTag,
  FiCheckSquare,
  FiSquare,
  FiEdit,
  FiShoppingBag,
  FiImage,
  FiArrowRight,
  FiAlertCircle,
  FiAlertTriangle
} from 'react-icons/fi';

interface IconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

// Componente wrapper genérico
const IconWrapper = ({ Icon, ...props }: IconProps & { Icon: IconType }) => {
  return React.createElement(Icon as any, props);
};

// Componentes wrapper para garantir tipagem correta
export const UsersIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiUsers} {...props} />;
export const PlusIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiPlus} {...props} />;
export const CheckCircleIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiCheckCircle} {...props} />;
export const ClockIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiClock} {...props} />;
export const CalendarIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiCalendar} {...props} />;
export const MailIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiMail} {...props} />;
export const PhoneIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiPhone} {...props} />;
export const UserIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiUser} {...props} />;
export const MessageSquareIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiMessageSquare} {...props} />;
export const Edit3Icon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiEdit3} {...props} />;
export const Trash2Icon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiTrash2} {...props} />;
export const XIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiX} {...props} />;
export const RefreshCwIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiRefreshCw} {...props} />;
export const DownloadIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiDownload} {...props} />;
export const DollarSignIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiDollarSign} {...props} />;
export const TrendingUpIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiTrendingUp} {...props} />;
export const TargetIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiTarget} {...props} />;
export const ActivityIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiActivity} {...props} />;
export const EyeIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiEye} {...props} />;
export const BarChartIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiBarChart} {...props} />;
export const PieChartIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiPieChart} {...props} />;
export const InfoIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiInfo} {...props} />;
export const FilterIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiFilter} {...props} />;
export const SearchIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiSearch} {...props} />;
export const TagIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiTag} {...props} />;
export const CheckSquareIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiCheckSquare} {...props} />;
export const SquareIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiSquare} {...props} />;
export const EditIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiEdit} {...props} />;
export const ShoppingBagIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiShoppingBag} {...props} />;
export const ImageIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiImage} {...props} />;
export const ArrowRightIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiArrowRight} {...props} />;
export const AlertCircleIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiAlertCircle} {...props} />;
export const AlertTriangleIcon: React.FC<IconProps> = (props) => <IconWrapper Icon={FiAlertTriangle} {...props} />;

// Objeto para facilitar o acesso aos ícones (mantém compatibilidade com o código existente)
export const Icons = {
  FiUsers: UsersIcon,
  FiPlus: PlusIcon,
  FiCheckCircle: CheckCircleIcon,
  FiClock: ClockIcon,
  FiCalendar: CalendarIcon,
  FiMail: MailIcon,
  FiPhone: PhoneIcon,
  FiUser: UserIcon,
  FiMessageSquare: MessageSquareIcon,
  FiEdit3: Edit3Icon,
  FiTrash2: Trash2Icon,
  FiX: XIcon,
  FiRefreshCw: RefreshCwIcon,
  FiDownload: DownloadIcon,
  FiDollarSign: DollarSignIcon,
  FiTrendingUp: TrendingUpIcon,
  FiTarget: TargetIcon,
  FiActivity: ActivityIcon,
  FiEye: EyeIcon,
  FiBarChart: BarChartIcon,
  FiPieChart: PieChartIcon,
  FiInfo: InfoIcon,
  FiFilter: FilterIcon,
  FiSearch: SearchIcon,
  FiTag: TagIcon,
  FiCheckSquare: CheckSquareIcon,
  FiSquare: SquareIcon,
  FiEdit: EditIcon,
  FiShoppingBag: ShoppingBagIcon,
  FiImage: ImageIcon,
  FiArrowRight: ArrowRightIcon,
  FiAlertCircle: AlertCircleIcon,
  FiAlertTriangle: AlertTriangleIcon
};