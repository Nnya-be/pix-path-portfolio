
// Mock data for the photo management application
import { Photo, PaginatedResponse, ShareLinkResponse } from './api';

// Generate random image URLs from Unsplash as placeholders
const getRandomImageUrl = (width: number = 800, height: number = 600, index: number): string => {
  const imageIds = [
    'photo-1649972904349-6e44c42644a7',
    'photo-1488590528505-98d2b5aba04b',
    'photo-1518770660439-4636190af475', 
    'photo-1461749280684-dccba630e2f6',
    'photo-1486312338219-ce68d2c6f44d',
    'photo-1581091226825-a6a2a5aee158',
    'photo-1485827404703-89b55fcc595e',
    'photo-1526374965328-7f61d4dc18c5',
    'photo-1531297484001-80022131f5a1',
    'photo-1487058792275-0ad4aaf24ca7'
  ];
  
  const id = imageIds[index % imageIds.length];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&h=${height}`;
};

// Generate mock photos array
const generateMockPhotos = (count: number, isRecycled: boolean = false): Photo[] => {
  return Array.from({ length: count }, (_, i) => {
    const id = `photo-${isRecycled ? 'recycled-' : ''}${i + 1}`;
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    
    return {
      id,
      url: getRandomImageUrl(1200, 800, i),
      thumbnail: getRandomImageUrl(600, 400, i),
      title: `Photo ${i + 1} ${isRecycled ? '(Recycled)' : ''}`,
      createdAt: randomDate.toISOString(),
      isRecycled
    };
  });
};

// Mock data store
export const mockDataStore = {
  activePhotos: generateMockPhotos(18),
  recycledPhotos: generateMockPhotos(7, true),
  
  // Add a photo to active photos
  addPhoto: (photo: Photo) => {
    mockDataStore.activePhotos.unshift(photo);
  },
  
  // Move a photo to recycled
  recyclePhoto: (photoId: string) => {
    const photoIndex = mockDataStore.activePhotos.findIndex(p => p.id === photoId);
    if (photoIndex >= 0) {
      const photo = { ...mockDataStore.activePhotos[photoIndex], isRecycled: true };
      mockDataStore.activePhotos.splice(photoIndex, 1);
      mockDataStore.recycledPhotos.unshift(photo);
    }
  },
  
  // Recover a photo from recycled
  recoverPhoto: (photoId: string) => {
    const photoIndex = mockDataStore.recycledPhotos.findIndex(p => p.id === photoId);
    if (photoIndex >= 0) {
      const photo = { ...mockDataStore.recycledPhotos[photoIndex], isRecycled: false };
      mockDataStore.recycledPhotos.splice(photoIndex, 1);
      mockDataStore.activePhotos.unshift(photo);
    }
  },
  
  // Delete a photo permanently
  deletePhotoForever: (photoId: string) => {
    const photoIndex = mockDataStore.recycledPhotos.findIndex(p => p.id === photoId);
    if (photoIndex >= 0) {
      mockDataStore.recycledPhotos.splice(photoIndex, 1);
    }
  }
};

// Simulate delayed API response
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API implementation
export const mockApiService = {
  // Get active photos with pagination
  getPhotos: async (page = 1, limit = 20): Promise<PaginatedResponse<Photo>> => {
    await delay(800); // Simulate network delay
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPhotos = mockDataStore.activePhotos.slice(start, end);
    
    return {
      items: paginatedPhotos,
      totalCount: mockDataStore.activePhotos.length,
      pageSize: limit,
      currentPage: page
    };
  },
  
  // Get recycled photos
  getRecycledPhotos: async (page = 1, limit = 20): Promise<PaginatedResponse<Photo>> => {
    await delay(600); // Simulate network delay
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPhotos = mockDataStore.recycledPhotos.slice(start, end);
    
    return {
      items: paginatedPhotos,
      totalCount: mockDataStore.recycledPhotos.length,
      pageSize: limit,
      currentPage: page
    };
  },
  
  // Upload a photo
  uploadPhoto: async (file: File): Promise<Photo> => {
    await delay(1500); // Simulate longer upload time
    
    // Create a mock photo from the uploaded file
    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      url: URL.createObjectURL(file),
      thumbnail: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      createdAt: new Date().toISOString(),
      isRecycled: false
    };
    
    mockDataStore.addPhoto(newPhoto);
    return newPhoto;
  },
  
  // Move photo to recycle bin
  recyclePhoto: async (photoId: string): Promise<void> => {
    await delay(500);
    mockDataStore.recyclePhoto(photoId);
  },
  
  // Restore photo from recycle bin
  recoverPhoto: async (photoId: string): Promise<void> => {
    await delay(500);
    mockDataStore.recoverPhoto(photoId);
  },
  
  // Delete photo permanently
  deletePhotoForever: async (photoId: string): Promise<void> => {
    await delay(700);
    mockDataStore.deletePhotoForever(photoId);
  },
  
  // Generate share link
  sharePhoto: async (photoId: string): Promise<ShareLinkResponse> => {
    await delay(800);
    
    // Generate mock token
    const token = `${photoId}-${Date.now()}`;
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 3); // 3 hours expiry
    
    return {
      url: `/share/${token}`,
      expiresAt: expiryDate.toISOString()
    };
  },
  
  // Get shared photo by token
  getSharedPhoto: async (token: string): Promise<Photo> => {
    await delay(700);
    
    // Extract photoId from token
    const photoIdMatch = token.match(/^(photo-\w+)/);
    
    if (!photoIdMatch) {
      throw new Error('Invalid share token');
    }
    
    const photoId = photoIdMatch[1];
    const photo = mockDataStore.activePhotos.find(p => p.id === photoId);
    
    if (!photo) {
      throw new Error('Photo not found or link expired');
    }
    
    return photo;
  },
  
  // Optional: Check service health
  checkStatus: async (): Promise<{ status: string; message?: string }> => {
    await delay(300);
    
    // Randomly simulate service issues about 10% of the time
    if (Math.random() > 0.9) {
      return { 
        status: 'degraded',
        message: 'Some features may be experiencing delays due to high traffic'
      };
    }
    
    return { status: 'healthy' };
  }
};
