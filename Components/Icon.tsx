import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { useScale } from '../Hooks/useScale';

interface IconProps {
    source: ImageSourcePropType,
    size?: number,
}

const Icon : React.FC<IconProps> = (props: IconProps) => {
  const {source, size = 30} = props;
  const scale = useScale();
  return (
      <Image source={source} resizeMode='contain' style={{width: scale(size), height: scale(size)}} />
  );
};

export default Icon;

const styles = StyleSheet.create({
  icon_container: {
      
      alignContent: 'center',

  }
});
