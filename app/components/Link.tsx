import React from 'react';
import {GestureResponderEvent, StyleSheet, Text, TextProps} from 'react-native';

interface LinkProps extends TextProps {
  onPress: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({onPress, children, style, ...props}) => {
  return (
    <Text style={[styles.link, style]} onPress={onPress} {...props}>
      {children}
    </Text>
  );
};

export default Link;

const styles = StyleSheet.create({
  link: {
    color: '#000',
    textDecorationLine: 'underline',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },
});
