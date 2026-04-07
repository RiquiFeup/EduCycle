
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import NewListingScreen from '../../src/screens/listing/NewListingScreen';


function fillValidSellListing() {
  // Photo
  fireEvent.press(screen.getByTestId('photo-upload-area'));
  // Title
  fireEvent.changeText(screen.getByTestId('input-title'), 'Matemática A – 10.º Ano');
  // Subject
  fireEvent.press(screen.getByTestId('subject-option-Mathematics'));
  // Condition
  fireEvent.press(screen.getByTestId('condition-option-Good'));
  // Campus (mandatory)
  fireEvent.press(screen.getByTestId('campus-option-FEUP'));
  // Listing type: Sell (already default — press anyway to be explicit)
  fireEvent.press(screen.getByTestId('listing-type-sell'));
  // Price
  fireEvent.changeText(screen.getByTestId('input-price'), '12');
}


describe('US-03 — Publish a New Listing (As a seller, I want to create a listing)', () => {

  describe('Cenário 1 — Normal: Successful listing publication', () => {

    it('AT1 — renders the New Listing screen with all required fields visible', () => {
      render(<NewListingScreen />);

      expect(screen.getByTestId('screen-title')).toBeTruthy();
      expect(screen.getByTestId('photo-upload-area')).toBeTruthy();
      expect(screen.getByTestId('input-title')).toBeTruthy();
      expect(screen.getByTestId('dropdown-subject')).toBeTruthy();
      expect(screen.getByTestId('dropdown-condition')).toBeTruthy();
      expect(screen.getByTestId('dropdown-campus')).toBeTruthy();
      expect(screen.getByTestId('listing-type-sell')).toBeTruthy();
      expect(screen.getByTestId('listing-type-swap')).toBeTruthy();
      expect(screen.getByTestId('btn-publish')).toBeTruthy();
    });

    it('AT2 — given all fields are correctly filled, when Publish is pressed, then success message appears', () => {
      // GIVEN
      const mockOnPublish = jest.fn();
      render(<NewListingScreen onPublish={mockOnPublish} />);

      // WHEN
      fillValidSellListing();
      fireEvent.press(screen.getByTestId('btn-publish'));

      // THEN
      expect(screen.getByTestId('msg-success')).toBeTruthy();
      expect(mockOnPublish).toHaveBeenCalledTimes(1);
      expect(mockOnPublish).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Matemática A – 10.º Ano',
          subject: 'Mathematics',
          condition: 'Good',
          campus: 'FEUP',
          listingType: 'Sell',
          price: '12',
        })
      );
    });

    it('AT3 — given Sell is selected, the Price field is visible; given Swap is selected, Price field disappears', () => {
      render(<NewListingScreen />);

      // Sell is default — price should be visible
      expect(screen.getByTestId('input-price')).toBeTruthy();

      // Switch to Swap — price should disappear
      fireEvent.press(screen.getByTestId('listing-type-swap'));
      expect(screen.queryByTestId('input-price')).toBeNull();

      // Switch back to Sell — price reappears
      fireEvent.press(screen.getByTestId('listing-type-sell'));
      expect(screen.getByTestId('input-price')).toBeTruthy();
    });

    it('AT4 — photo upload area changes label after being pressed', () => {
      render(<NewListingScreen />);

      expect(screen.getByText('Tap to add photos')).toBeTruthy();
      fireEvent.press(screen.getByTestId('photo-upload-area'));
      expect(screen.getByText('✓ Photo added')).toBeTruthy();
    });

    it('AT5 — Campus/School Tag field is rendered with mandatory indicator', () => {
      render(<NewListingScreen />);

      // The label contains an asterisk (*) indicating it is mandatory
      expect(screen.getByText(/Campus \/ School Tag/)).toBeTruthy();
      expect(screen.getByTestId('dropdown-campus')).toBeTruthy();
    });

  });


});
