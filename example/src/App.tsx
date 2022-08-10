import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import {
  downloadFile,
  downloadStatus,
  DOWNLOAD_MANAGER_STATUS,
} from 'react-native-du';

export default function App() {
  const downloadPdf = async () => {
    try {
      const id: any = await downloadFile(
        'https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.jpg',
        'cat.jpg',
        'This is a cat '
      );
      console.log({ id });
      const status = await downloadStatus(id[0]);
      const idx: string = status[0];
      console.log({ status: DOWNLOAD_MANAGER_STATUS[idx] });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Download" onPress={downloadPdf} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
