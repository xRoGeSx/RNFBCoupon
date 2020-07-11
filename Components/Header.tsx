import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';


const CustomHeader : React.FC = (props) => {
  return (
    <View style={styles.container}>
      {props.children}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
      flex: 0.8,
      flexDirection: 'row',

      backgroundColor: '#465493',
      justifyContent: 'space-between',
      alignItems: 'center',
  }
});
