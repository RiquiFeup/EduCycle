import { StyleSheet } from 'react-native';

export const PRIMARY   = '#2D6A4F';
export const ERROR_RED = '#8C2D19';
export const GRAY_BG   = '#F4F6F4';
export const BORDER    = '#E0E0E0';
export const TEXT      = '#1A1A1A';
export const HINT      = '#6B6B6B';

export default StyleSheet.create({
  container:          { padding: 20, backgroundColor: '#fff', paddingBottom: 40 },
  screenTitle:        { fontSize: 22, fontWeight: 'bold', color: TEXT, marginBottom: 20 },

  photoArea:          { borderWidth: 1.5, borderColor: PRIMARY, borderStyle: 'dashed',
                        borderRadius: 12, height: 160, alignItems: 'center',
                        justifyContent: 'center', backgroundColor: GRAY_BG, marginBottom: 4 },
  photoAreaFilled:    { borderStyle: 'solid', backgroundColor: '#E8F5E9' },
  photoIcon:          { fontSize: 32, marginBottom: 8 },
  photoLabel:         { fontSize: 14, color: HINT },

  thumbnailContainer: { flexDirection: 'row', marginBottom: 4, height: 160 },
  thumbnailWrapper:   { marginRight: 10, position: 'relative', width: 120, height: 160 },
  thumbnail:          { width: 120, height: 160, borderRadius: 12 },
  removeBtn:          { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.6)', 
                        width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  removeBtnText:      { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  addMoreBtn:         { width: 80, height: 160, borderWidth: 1.5, borderColor: PRIMARY, borderStyle: 'dashed', 
                        borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: GRAY_BG },
  addMoreIcon:        { fontSize: 32, color: PRIMARY },


  label:              { fontSize: 14, fontWeight: '600', color: TEXT, marginTop: 16, marginBottom: 6 },
  required:           { color: ERROR_RED },
  input:              { borderWidth: 1, borderColor: BORDER, borderRadius: 12,
                        paddingHorizontal: 14, height: 48, fontSize: 14, color: TEXT,
                        backgroundColor: '#fff' },
  inputError:         { borderColor: ERROR_RED },
  error:              { color: ERROR_RED, fontSize: 12, marginTop: 4 },
  hint:               { fontSize: 11, color: HINT, marginTop: 4 },
  placeholder:        { fontSize: 14, color: HINT, marginTop: 2, fontStyle: 'italic' },
  selectedValue:      { fontSize: 14, color: PRIMARY, marginTop: 2, fontWeight: '600' },

  dropdown:           { borderWidth: 1, borderColor: BORDER, borderRadius: 12,
                        backgroundColor: '#fff', overflow: 'hidden', marginTop: 2 },
  campusDropdown:     { borderLeftWidth: 3, borderLeftColor: PRIMARY },
  option:             { paddingVertical: 10, paddingHorizontal: 14,
                        borderBottomWidth: 1, borderBottomColor: BORDER },
  optionSelected:     { backgroundColor: PRIMARY },
  optionText:         { fontSize: 14, color: TEXT },
  optionTextSelected: { fontSize: 14, color: '#fff', fontWeight: '600' },

  segmentedControl:   { flexDirection: 'row', borderWidth: 1, borderColor: BORDER,
                        borderRadius: 12, overflow: 'hidden', marginTop: 2 },
  segment:            { flex: 1, paddingVertical: 12, alignItems: 'center',
                        backgroundColor: '#fff' },
  segmentActive:      { backgroundColor: PRIMARY },
  segmentText:        { fontSize: 14, color: HINT, fontWeight: '600' },
  segmentTextActive:  { color: '#fff' },

  btnPublish:         { marginTop: 28, backgroundColor: PRIMARY, borderRadius: 14,
                        height: 52, alignItems: 'center', justifyContent: 'center' },
  btnPublishText:     { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  success:            { marginTop: 16, textAlign: 'center', color: PRIMARY,
                        fontSize: 16, fontWeight: 'bold' },
});
