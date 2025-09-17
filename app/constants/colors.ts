// Railway Track Fittings App Color Scheme
export const Colors = {
  // Primary Colors
  primary: '#1E40AF', // Blue
  primaryLight: '#3B82F6',
  primaryDark: '#1E3A8A',
  
  // Secondary Colors
  secondary: '#F59E0B', // Yellow/Amber
  secondaryLight: '#FCD34D',
  secondaryDark: '#D97706',
  
  // Background Colors
  background: '#FFFFFF', // White
  backgroundGray: '#F8FAFC',
  backgroundLight: '#F1F5F9',
  
  // Text Colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textWhite: '#FFFFFF',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Border Colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Railway Theme Colors
  railway: {
    blue: '#1E40AF',
    yellow: '#F59E0B',
    white: '#FFFFFF',
    steel: '#64748B',
    track: '#374151',
  }
};

// Color combinations for different components
export const ComponentColors = {
  header: {
    background: Colors.background,
    text: Colors.textPrimary,
    border: Colors.border,
  },
  button: {
    primary: {
      background: Colors.primary,
      text: Colors.textWhite,
    },
    secondary: {
      background: Colors.background,
      text: Colors.primary,
      border: Colors.primary,
    },
    warning: {
      background: Colors.secondary,
      text: Colors.textWhite,
    },
  },
  card: {
    background: Colors.background,
    border: Colors.borderLight,
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  status: {
    active: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
    pending: Colors.secondary,
  },
};
