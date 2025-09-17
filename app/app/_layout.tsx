import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="component-detail" 
              options={{ 
                title: 'Component Details',
                headerStyle: { backgroundColor: Colors.background },
                headerTintColor: Colors.primary,
                headerTitleStyle: { fontWeight: '600' }
              }} 
            />
            <Stack.Screen 
              name="inspection-form" 
              options={{ 
                title: 'Inspection Form',
                headerStyle: { backgroundColor: Colors.background },
                headerTintColor: Colors.primary,
                headerTitleStyle: { fontWeight: '600' }
              }} 
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
