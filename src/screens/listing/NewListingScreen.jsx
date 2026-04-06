import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import styles from './styles';

// Components
import PhotoUpload from './components/PhotoUpload';
import InputField from './components/InputField';
import DropdownField from './components/DropdownField';
import SegmentedControl from './components/SegmentedControl';
import PrimaryButton from './components/PrimaryButton';

const SUBJECTS = ['Mathematics', 'Physics', 'Portuguese', 'History', 'Chemistry', 'Biology'];
const CONDITIONS = ['New', 'Good', 'Fair', 'Poor'];
const CAMPUSES = ['FEUP', 'ISEP', 'UP Law', 'Colégio Dom Dinis', 'Other'];
const LISTING_TYPES = ['Sell', 'Swap'];

export default function NewListingScreen({ onPublish }) {
  const [hasPhoto, setHasPhoto]         = useState(false);
  const [title, setTitle]               = useState('');
  const [subject, setSubject]           = useState('');
  const [condition, setCondition]       = useState('');
  const [campus, setCampus]             = useState('');
  const [listingType, setListingType]   = useState('Sell');
  const [price, setPrice]               = useState('');
  const [errors, setErrors]             = useState({});
  const [published, setPublished]       = useState(false);

  function validate() {
    const e = {};
    if (!hasPhoto)              e.photo     = 'A photo is required.';
    if (!title.trim())          e.title     = 'Title is required.';
    if (!subject)               e.subject   = 'Please select a subject.';
    if (!condition)             e.condition = 'Please select a condition.';
    if (!campus)                e.campus    = 'Campus / School Tag is required.';
    if (listingType === 'Sell' && !price.trim())
                                e.price     = 'Price is required for items on sale.';
    return e;
  }

  function handlePublish() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setPublished(true);
    if (onPublish) onPublish({ title, subject, condition, campus, listingType, price });
  }

  return (
    <ScrollView
      testID="new-listing-screen"
      accessible={true}
      accessibilityLabel="New Listing Screen"
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text testID="screen-title" accessible={true} accessibilityLabel="New Listing" style={styles.screenTitle}>New Listing</Text>

      <PhotoUpload 
        hasPhoto={hasPhoto} 
        setHasPhoto={setHasPhoto} 
        error={errors.photo} 
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

      <PrimaryButton
        title="Publish Listing"
        onPress={handlePublish}
        testID="btn-publish"
        accessibilityLabel="Publish Listing"
      />

      {published && (
        <Text testID="msg-success" style={styles.success}>
          <Text testID="success-icon">🎉</Text> Listing published successfully!
        </Text>
      )}
    </ScrollView>
  );
}
