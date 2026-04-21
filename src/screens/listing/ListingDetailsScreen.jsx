import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import { COLORS, SPACING, RADIUS } from '../../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MODE_LABELS = {
  sell: '',
  swap: 'For Swap',
  lend: 'For Lend',
};

const MODE_COLORS = {
  swap: '#2E7D59',
  lend: '#1565C0',
};

export default function ListingDetailsScreen({ listing, navigate }) {
  const badge = MODE_LABELS[listing?.mode];
  const badgeColor = MODE_COLORS[listing?.mode];

  return (
    <View style={styles.mainContainer}>
      {/* Header Fixo com Botão Voltar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate('Home')}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Produto</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Imagem do Produto */}
        <View style={styles.imageContainer}>
          {listing?.image ? (
            <Image source={{ uri: listing.image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
        </View>

        {/* Corpo do Produto */}
        <View style={styles.content}>
          {/* Badge */}
          {badge ? (
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}

          {/* Título e Preço */}
          <Text style={styles.title}>{listing?.title}</Text>
          {listing?.price != null && (
            <Text style={styles.price}>€ {Number(listing.price).toFixed(2)}</Text>
          )}

          {/* Localização / Instituição */}
          <View style={styles.institutionRow}>
            <View style={styles.locationDot} />
            <Text style={styles.institution}>{listing?.institution}</Text>
          </View>

          {/* Subject & ISBN */}
          {listing?.subject ? (
            <View style={styles.detailRow} testID="listing-subject">
              <Text style={styles.detailLabel}>Subject</Text>
              <View style={styles.subjectBadge}>
                <Text style={styles.subjectBadgeText}>{listing.subject}</Text>
              </View>
            </View>
          ) : null}

          {listing?.isbn ? (
            <View style={styles.detailRow} testID="listing-isbn">
              <Text style={styles.detailLabel}>ISBN</Text>
              <Text style={styles.detailValue}>{listing.isbn}</Text>
            </View>
          ) : null}

          {/* Descrição Falsa (já que o card atual não tem) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>
              {listing?.description || "Sem descrição detalhada fornecida pelo vendedor para este artigo."}
            </Text>
          </View>

            {/* Vendedor */}
          <TouchableOpacity 
            style={styles.vendorCard} 
            // Ao clicar, envia o sellerId que veio do listings.js
            onPress={() => navigate('PublicProfile', { sellerId: listing?.sellerId })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {listing?.sellerPhoto ? (
                <Image source={{ uri: listing.sellerPhoto }} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.surface }} />
              ) : (
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.border }} />
              )}
              
              <View>
                {/* Mostra o nome do vendedor ou o fallback */}
                <Text style={styles.vendorName}>{listing?.sellerName || 'Vendedor Anónimo'}</Text>
                <Text style={styles.vendorSubtext}>Ver Perfil Público →</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Botão de Contacto */}
          <TouchableOpacity style={styles.actionButton} onPress={() => navigate('Chat', { conversationId: 'c1' })}>
            <Text style={styles.actionButtonText}>Enviar Mensagem</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.background },
  header: {
    height: 60,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: 10,
  },
  backButton: { paddingRight: 15 },
  backButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, flex: 1, textAlign: 'center', marginRight: 60 },
  container: { flex: 1 },
  imageContainer: { width: '100%', height: SCREEN_WIDTH * 0.8, backgroundColor: COLORS.surface },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, backgroundColor: '#E8EDF0' },
  content: { padding: SPACING.lg },
  badge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: SPACING.sm },
  badgeText: { color: COLORS.background, fontSize: 12, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  price: { fontSize: 22, fontWeight: '800', color: COLORS.primary, marginBottom: SPACING.md },
  institutionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.lg },
  locationDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E53E3E' },
  institution: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  section: { marginTop: SPACING.md, marginBottom: SPACING.lg },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  description: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 24 },
  vendorCard: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: RADIUS.panel, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  vendorName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  vendorSubtext: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: SPACING.sm },
  detailLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, minWidth: 60 },
  detailValue: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  subjectBadge: { backgroundColor: COLORS.primarySoft, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  subjectBadgeText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  actionButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.button, alignItems: 'center' },
  actionButtonText: { color: COLORS.background, fontSize: 16, fontWeight: '700' },
});