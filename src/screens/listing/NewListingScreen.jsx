import React, { useState, useContext, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import createStyles from './styles';

import PhotoUpload from './components/PhotoUpload';
import InputField from './components/InputField';
import DropdownField from './components/DropdownField';
import SegmentedControl from './components/SegmentedControl';
import PrimaryButton from './components/PrimaryButton';

import { UserContext } from '../../contexts/UserContext';
import { createListing } from '../../services/listingService';

const SUBJECTS = ['Mathematics', 'Physics', 'Portuguese', 'History', 'Chemistry', 'Biology', 'Other'];
const CONDITIONS = ['New', 'Good', 'Fair', 'Poor'];
const CAMPUSES = ['FEUP', 'ISEP', 'UP Law', 'Colégio Dom Dinis', 'Other'];
const LISTING_TYPES = ['Sell', 'Swap'];

export default function NewListingScreen({ onPublish }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { currentUser } = useContext(UserContext);

  const [photos, setPhotos]             = useState([]);
  const [title, setTitle]               = useState('');
  const [description, setDescription]   = useState('');
  const [subject, setSubject]           = useState('');
  const [condition, setCondition]       = useState('');
  const [campus, setCampus]             = useState('');
  const [listingType, setListingType]   = useState('Sell');
  const [price, setPrice]               = useState('');
  const [isbn, setIsbn]                 = useState('');
  const [errors, setErrors]             = useState({});
  const [published, setPublished]       = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  function validate() {
    const e = {};
    if (photos.length === 0)    e.photos      = 'At least one photo is required.';
    if (!title.trim())          e.title       = 'Title is required.';
    if (!description.trim())    e.description = 'Description is required.';
    if (!subject)               e.subject     = 'Please select a subject.';
    if (!condition)             e.condition   = 'Please select a condition.';
    else if (!CONDITIONS.includes(condition)) e.condition = 'Invalid condition selected.';
    if (!campus)                e.campus      = 'Campus / School Tag is required.';
    if (listingType === 'Sell' && !price.trim())
                                e.price       = 'Price is required for items on sale.';
    return e;
  }

  async function handlePublish() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setIsPublishing(true);
    try {
      await createListing(
        { title, description, subject, condition, campus, listingType, price, isbn },
        currentUser?.id,
        photos
      );
      setPublished(true);
      if (onPublish) onPublish({ title, description, subject, condition, campus, listingType, price, isbn });

      setTitle('');
      setDescription('');
      setPrice('');
      setIsbn('');
      setPhotos([]);
      setSubject('');
      setCondition('');
      setCampus('');

    } catch (error) {
      setErrors({ ...e, submit: 'Não foi possível publicar o anúncio. Tenta novamente.' });
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <ScrollView
      testID="new-listing-screen"
      accessible={true}
      accessibilityLabel="New Listing Screen"
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <Text testID="screen-title" accessible={true} accessibilityLabel="New Listing" style={styles.screenTitle}>New Listing</Text>

      <PhotoUpload
        photos={photos}
        setPhotos={setPhotos}
        error={errors.photos}
      />

      <InputField
        label="Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Ex: Matemática A – 10.º Ano"
        testID="input-title"
        error={errors.title}
        accessibilityLabel="Title"
      />

      <InputField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Detalhes sobre o estado, edições, marcações..."
        testID="input-description"
        error={errors.description}
        accessibilityLabel="Description"
      />

      <InputField
        label="ISBN (Optional)"
        value={isbn}
        onChangeText={setIsbn}
        placeholder="Ex: 978-989-111-222"
        testID="input-isbn"
        accessibilityLabel="ISBN"
      />

      <DropdownField
        label="Subject"
        options={SUBJECTS}
        selectedValue={subject}
        onSelect={setSubject}
        testIDPrefix="subject"
        placeholder="Select subject"
        error={errors.subject}
      />

      <DropdownField
        label="Condition"
        options={CONDITIONS}
        selectedValue={condition}
        onSelect={setCondition}
        testIDPrefix="condition"
        placeholder="Select condition"
        error={errors.condition}
      />

      <DropdownField
        label="Campus / School Tag"
        options={CAMPUSES}
        selectedValue={campus}
        onSelect={setCampus}
        testIDPrefix="campus"
        placeholder="Link to a School Hub (required)"
        error={errors.campus}
        isRequired={true}
        isCampus={true}
      />

      <SegmentedControl
        label="Listing Type"
        options={LISTING_TYPES}
        selectedValue={listingType}
        onSelect={setListingType}
      />

      {listingType === 'Sell' && (
        <InputField
          label="Price (€)"
          value={price}
          onChangeText={setPrice}
          placeholder="0.00"
          testID="input-price"
          keyboardType="numeric"
          hint="Field hidden if Swap is selected"
          error={errors.price}
          accessibilityLabel="Price"
        />
      )}

      {errors.submit && (
        <Text style={styles.error}>{errors.submit}</Text>
      )}

      <PrimaryButton
        title={isPublishing ? "Publishing..." : "Publish Listing"}
        onPress={handlePublish}
        disabled={isPublishing}
        testID="btn-publish"
        accessibilityLabel="Publish Listing"
      />

      {published && (
        <View testID="msg-success" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 6 }}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.primary} />
          <Text style={[styles.success, { marginTop: 0 }]}>Listing published successfully!</Text>
        </View>
      )}
    </ScrollView>
  );
}