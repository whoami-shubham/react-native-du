# react-native-du

A file download utility for react native

## Installation

```sh
npm install react-native-du
```

or

```sh
yarn add react-native-du
```

## Usage

```js
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
      const id = await downloadFile({
        url: 'https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.jpg',
        fileName: 'cat.jpg',
        desc: 'This is a cat ',
      });
      console.log({ id });
      const status = await downloadStatus(id?.[0] || '');
      const idx: string = status?.[0] || '';
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
```

## Functions

```js
async function downloadFile({
  url,
  fileName,
  desc = '',
  onPermissionDenied,
  onError,
})
// params
{
  url : 'https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.jpg' // request url,
  fileName: 'cat.jpg' // file Name with extension
  desc: 'Description of download manager' // optional
  onPermissionDenied: ()=>{}  // optional , this function gets called if storgae permission is denied
  onError: (error)=>{} // optional , this function gets called if any exception is thrown
}

// returns
['downloadId'] or undefined


async function downloadStatus(downloadId: string)
// params
{
  downloadId : 'id' // download id returned by downloadFile function,
}

// returns
['download_manager_status'] or undefined



```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
