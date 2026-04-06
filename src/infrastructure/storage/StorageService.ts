import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@config/firebase';

export class StorageService {
  static async uploadFoto(jogadorId: string, arquivo: File): Promise<string> {
    try {
      const storageRef = ref(storage, `fotos/${jogadorId}`);
      await uploadBytes(storageRef, arquivo);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  }

  static async getDownloadUrl(jogadorId: string): Promise<string> {
    try {
      const storageRef = ref(storage, `fotos/${jogadorId}`);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Erro ao recuperar URL:', error);
      throw error;
    }
  }
}
