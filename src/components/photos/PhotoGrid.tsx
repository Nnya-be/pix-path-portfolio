
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PhotoCard from './PhotoCard';
import { photoApi, Photo } from '@/lib/api';

interface PhotoGridProps {
  mode: 'active' | 'recycled';
  onRefreshNeeded: () => void;
}

export default function PhotoGrid({ mode, onRefreshNeeded }: PhotoGridProps) {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [mode === 'active' ? 'photos' : 'recycledPhotos', page],
    queryFn: () => mode === 'active' 
      ? photoApi.getPhotos(page, limit) 
      : photoApi.getRecycledPhotos(page, limit),
  });

  const handlePhotoAction = () => {
    refetch();
    onRefreshNeeded();
  };

  // Function to load more photos
  const loadMore = () => {
    if (data && data.items.length >= limit) {
      setPage(prev => prev + 1);
    }
  };

  // If no photos available, display empty state
  if (!isLoading && !isError && (!data || data.items.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        {mode === 'active' ? (
          <>
            <img 
              src="/placeholder.svg" 
              alt="No photos" 
              className="w-24 h-24 mb-4 opacity-50"
            />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No photos yet</h3>
            <p className="text-gray-600 mb-4 max-w-md text-center">
              Upload your first photo to start building your collection
            </p>
          </>
        ) : (
          <>
            <img 
              src="/placeholder.svg" 
              alt="Empty recycling bin" 
              className="w-24 h-24 mb-4 opacity-50"
            />
            <h3 className="text-xl font-medium text-gray-800 mb-2">Recycle bin is empty</h3>
            <p className="text-gray-600 mb-4 max-w-md text-center">
              Items you delete will appear here for 30 days before being permanently removed
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <div className="masonry-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="photo-card mb-4">
              <Skeleton className="w-full h-64" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-10">
          <p className="text-red-500 mb-2">Failed to load photos</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      ) : (
        <>
          <div className="masonry-grid">
            {data?.items.map((photo: Photo) => (
              <PhotoCard 
                key={photo.id} 
                photo={photo} 
                onDeleted={handlePhotoAction}
                onRecovered={handlePhotoAction}
                onPermanentDelete={handlePhotoAction}
              />
            ))}
          </div>
          
          {data && data.items.length >= limit && (
            <div className="flex justify-center mt-8">
              <Button onClick={loadMore} variant="outline">
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
