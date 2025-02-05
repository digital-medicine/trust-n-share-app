import React from 'react';
import {TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, View} from 'react-native';

interface PrimaryButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  style?: ViewStyle; // Optional style prop for customization
  badgeCount?: number; // Optional badge count to display on the button
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onPress, title, style, badgeCount }) => {
  return (
    <>
      <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>

        {badgeCount !== undefined && badgeCount > 0 && (
          <View
            style={{
              position: 'absolute',
              right: -10,
              top: -10,
              backgroundColor: 'red',
              borderRadius: 16,
              width: 24,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
              {badgeCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>


    </>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0071e3',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
