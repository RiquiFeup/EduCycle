import React from 'react';
import { View, StyleSheet } from 'react-native';

function DecorativeDot({ style }) {
  return <View style={[styles.dot, style]} />;
}

function Person({ color, style }) {
  return (
    <View style={[styles.person, style]}>
      <View style={[styles.head, { backgroundColor: color }]} />
      <View style={[styles.body, { backgroundColor: color }]} />
    </View>
  );
}

export default function EduCycleLogo({ size = 90 }) {
  const scale = size / 90;

  return (
    <View
      style={[
        styles.container,
        {
          width: 110 * scale,
          height: 92 * scale,
          transform: [{ scale }],
        },
      ]}
      testID="educycle-logo"
    >
      <DecorativeDot style={{ top: 4, left: 18, opacity: 0.9 }} />
      <DecorativeDot style={{ top: 24, left: 33, width: 6, height: 6, opacity: 0.8 }} />
      <DecorativeDot style={{ top: 14, right: 14, opacity: 0.9, backgroundColor: '#9BB5A9' }} />
      <DecorativeDot style={{ top: 30, right: 28, width: 8, height: 8, backgroundColor: '#D1AAA2' }} />

      <View style={styles.triangle} />

      <Person color="#2F7657" style={{ left: 18, bottom: 6 }} />
      <Person color="#9C3B23" style={{ right: 18, bottom: 6 }} />

      <View style={styles.stackArea}>
        <View style={[styles.book, styles.smallBook]} />
        <View style={[styles.book, styles.mediumBook]} />
        <View style={[styles.book, styles.largeBook]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    width: 9,
    height: 13,
    borderRadius: 8,
    backgroundColor: '#A7C1B4',
  },
  triangle: {
    position: 'absolute',
    top: 10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#A8C3B6',
  },
  person: {
    position: 'absolute',
    alignItems: 'center',
  },
  head: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  body: {
    width: 15,
    height: 27,
    borderRadius: 2,
  },
  stackArea: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  book: {
    borderWidth: 1.4,
    borderColor: '#6B8C7D',
    backgroundColor: '#F3F4F2',
    borderRadius: 2,
  },
  smallBook: {
    width: 14,
    height: 10,
    marginBottom: 3,
  },
  mediumBook: {
    width: 20,
    height: 10,
    marginBottom: 3,
  },
  largeBook: {
    width: 18,
    height: 18,
  },
});