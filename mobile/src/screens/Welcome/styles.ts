import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, justifyContent: 'center' },
  logoArea: { alignItems: 'center', marginBottom: 60 },
  iconCircle: { width: 80, height: 80, backgroundColor: colors.primary, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 5 },
  actions: { gap: 16 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.surface, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: colors.surfaceHighlight },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  cardDesc: { color: colors.textSecondary, fontSize: 14 }
});