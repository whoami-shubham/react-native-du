import {
  Alert,
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-du' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const DownloadUtil = NativeModules.DownloadUtil
  ? NativeModules.DownloadUtil
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const isiOS = Platform.OS === 'ios';

function onPermissionDeniedFn() {
  Alert.alert('Permission Denied', 'storage_permission_denied');
}

function onErrorFn(error: any) {
  Alert.alert('Error', 'Something went wrong :(');
  console.log(error);
}

export type downloadFileFnType = {
  url: string;
  fileName: string;
  desc?: string;
  onPermissionDenied?: () => void;
  onError?: (error: any) => void;
};

export async function downloadFile({
  url,
  fileName,
  desc = '',
  onPermissionDenied = onPermissionDeniedFn,
  onError = onErrorFn,
}: downloadFileFnType): Promise<string[] | void> {
  if (isiOS) {
    Linking.openURL(url);
  } else {
    return askForPermission(
      () => {
        return DownloadUtil?.downloadFile(url, fileName, desc);
      },
      onPermissionDenied,
      onError
    );
  }
}

export async function downloadStatus(
  downloadId: string
): Promise<string[] | void> {
  return DownloadUtil?.getDownloadStatus(downloadId);
}

async function askForPermission(
  onSuccess: () => void,
  onFailure: () => void,
  onError: (err: any) => void
) {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE as any
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return onSuccess();
    } else {
      onFailure();
    }
  } catch (_error) {
    onError(_error);
  }
}

export { DOWNLOAD_MANAGER_STATUS } from './constants';
