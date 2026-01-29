import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { fontFamily } from '../../../theme/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24 },
  backBtn: { marginBottom: 40, marginTop: 20, alignSelf: 'flex-start' },
  textGray: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 16 },
  authBox: { flex: 1, justifyContent: 'center', paddingBottom: 80 },
  
  title: { 
    fontFamily: fontFamily.heading, 
    fontSize: 32, 
    color: colors.primary, 
    marginBottom: 40, 
    textAlign: 'center',
    letterSpacing: 1
  },
});