import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  Query,
  QueryConstraint,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  WriteBatch,
  batch as createBatch
} from 'firebase/firestore';
import { db } from '@config/firebase';

export class FirestoreRepository<T extends { id?: string }> {
  constructor(private collectionName: string) {}

  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const collRef = collection(db, this.collectionName);
      const q = constraints.length > 0 ? query(collRef, ...constraints) : collRef;
      const snapshot = await getDocs(q as Query<DocumentData>);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as T));
    } catch (error) {
      console.error(`Erro ao buscar ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const snapshot = await getDoc(docRef);
      return snapshot.exists()
        ? ({ id: snapshot.id, ...snapshot.data() } as T)
        : null;
    } catch (error) {
      console.error(`Erro ao buscar ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }

  async add(data: Omit<T, 'id'>): Promise<string> {
    try {
      const collRef = collection(db, this.collectionName);
      const docRef = await addDoc(collRef, {
        ...data,
        criadoEm: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error(`Erro ao adicionar em ${this.collectionName}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, data as any);
    } catch (error) {
      console.error(`Erro ao atualizar ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Erro ao deletar ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }

  async batch(): Promise<WriteBatch> {
    return createBatch();
  }
}
