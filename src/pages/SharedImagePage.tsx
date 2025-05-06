
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { photoApi, Photo } from '@/lib/api';

export default function SharedImagePage() {
  const { token } = useParams<{ token: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<string>('');
  
  useEffect(() => {
    const loadSharedImage = async () => {
      if (!token) {
        setError('Invalid share link');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const sharedPhoto = await photoApi.getSharedPhoto(token);
        setPhoto(sharedPhoto);
        
        // Mock expiry time (in real app this would come from the API)
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 3); // 3 hours expiry
        
        // Calculate time remaining
        const updateExpiry = () => {
          const now = new Date();
          const diff = Math.max(0, Math.floor((expiryTime.getTime() - now.getTime()) / 1000));
          
          if (diff <= 0) {
            setExpiresIn('Expired');
            setError('This share link has expired');
            clearInterval(interval);
            return;
          }
          
          const hours = Math.floor(diff / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          setExpiresIn(`${hours}h ${minutes}m`);
        };
        
        updateExpiry();
        const interval = setInterval(updateExpiry, 60000); // Update every minute
        
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error loading shared image:', error);
        setError('This shared image is no longer available or the link has expired');
      } finally {
        setLoading(false);
      }
    };
    
    loadSharedImage();
  }, [token]);
  
  const handleDownload = () => {
    if (!photo) return;
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.title || 'downloaded-image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started');
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="bg-black/90 border-b border-white/10 p-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-white text-xl font-bold">PixPath</Link>
          
          <Link to="/">
            <Button variant="ghost" className="text-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        {loading ? (
          <div className="animate-pulse bg-gray-700 rounded-lg w-full max-w-4xl aspect-video"></div>
        ) : error ? (
          <div className="text-center">
            <div className="bg-white/5 rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Oops!</h2>
              <p className="text-gray-300 mb-6">{error}</p>
              <Link to="/">
                <Button>
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        ) : photo ? (
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col">
              <div className="bg-white/5 backdrop-blur rounded-t-lg p-4 flex justify-between items-center">
                <div>
                  <Link to="/" className="text-white flex items-center hover:text-gray-300">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Link>
                </div>
                
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white">{photo.title}</h2>
                  {expiresIn && (
                    <p className="text-sm text-gray-300">
                      {expiresIn === 'Expired' ? 'Link expired' : `Link expires in ${expiresIn}`}
                    </p>
                  )}
                </div>
                
                <Button onClick={handleDownload} variant="ghost" className="text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="overflow-hidden bg-black flex items-center justify-center">
                <img 
                  src={photo.url} 
                  alt={photo.title || 'Shared photo'} 
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>
            </div>
          </div>
        ) : null}
      </main>
      
      <footer className="bg-black/90 border-t border-white/10 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} PixPath. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
