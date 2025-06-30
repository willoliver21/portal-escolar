import { createContext, useContext } from 'react'; // CORREÇÃO: Adicionada a importação do React

// ... (o resto do ficheiro continua igual) ...
type ToastType = 'success' | 'error';

interface NotificationContextType {
  showToast: (message: string, type: ToastType) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }
  return context;
};
