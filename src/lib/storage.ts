import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryStorage = new Map<string, string>();
let warnedStorageUnavailable = false;

function isMissingNativeStorageError(error: unknown) {
  return error instanceof Error && error.message.includes('Native module is null');
}

function warnStorageUnavailableOnce(error: unknown) {
  if (warnedStorageUnavailable) return;
  warnedStorageUnavailable = true;
  console.log('AsyncStorage unavailable, using in-memory fallback', error);
}

export async function storageGetItem(key: string) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    if (isMissingNativeStorageError(error)) {
      warnStorageUnavailableOnce(error);
      return memoryStorage.get(key) ?? null;
    }
    throw error;
  }
}

export async function storageSetItem(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    if (isMissingNativeStorageError(error)) {
      warnStorageUnavailableOnce(error);
      memoryStorage.set(key, value);
      return;
    }
    throw error;
  }
}

export async function storageRemoveItem(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    if (isMissingNativeStorageError(error)) {
      warnStorageUnavailableOnce(error);
      memoryStorage.delete(key);
      return;
    }
    throw error;
  }
}
