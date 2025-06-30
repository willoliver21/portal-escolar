
// Definimos os tipos para o nosso contexto para garantir a segurança do código.
type ToastType = 'success' | 'error';

interface NotificationContextType {
  showToast: (message: string, type: ToastType) => void;
}

// Criamos o contexto que será usado para partilhar a função showToast.
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Criamos um "hook" personalizado para facilitar o uso do nosso contexto.
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }
  return context;
};
