/**
 * Image Storage Service - Production-Ready Local/Mock Implementation
 * 
 * This service handles image storage and can later connect to:
 * - AWS S3
 * - Cloudinary
 * - Firebase Storage
 * - Azure Blob Storage
 * 
 * Currently uses local storage with IndexedDB for file persistence
 */

export interface StoredImage {
  id: string;
  url: string; // Data URL or external URL
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  source: 'local' | 's3' | 'cloudinary' | 'firebase'; // For tracking storage backend
}

const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const DB_NAME = 'PacMonkImageStorage';
const STORE_NAME = 'images';

class ImageStorageService {
  private db: IDBDatabase | null = null;

  /**
   * Initialize IndexedDB for persistent local storage
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      return {
        valid: false,
        error: `Unsupported file format. Supported: JPG, JPEG, PNG, WEBP. Got: ${file.type}`,
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File too large. Maximum size: ${sizeMB}MB. Your file: ${(file.size / (1024 * 1024)).toFixed(1)}MB`,
      };
    }

    return { valid: true };
  }

  /**
   * Upload file and store locally
   */
  async uploadFile(file: File): Promise<StoredImage> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Ensure DB is initialized
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const dataUrl = event.target?.result as string;
          const storedImage: StoredImage = {
            id: this.generateId(),
            url: dataUrl,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            uploadedAt: new Date().toISOString(),
            source: 'local',
          };

          // Save to IndexedDB
          await this.saveToDb(storedImage);
          resolve(storedImage);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Save image to IndexedDB
   */
  private async saveToDb(image: StoredImage): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(image);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Get image from storage
   */
  async getImage(imageId: string): Promise<StoredImage | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(imageId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  /**
   * Delete image from storage
   */
  async deleteImage(imageId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(imageId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Get all images
   */
  async getAllImages(): Promise<StoredImage[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  /**
   * Generate unique ID for images
   */
  private generateId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all images (for testing/reset)
   */
  async clearAllImages(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const imageStorage = new ImageStorageService();
