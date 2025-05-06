
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';
import PhotoGrid from '@/components/photos/PhotoGrid';
import { useQueryClient } from '@tanstack/react-query';

export default function RecycleBinPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Redirect to auth page if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['recycledPhotos'] });
    } finally {
      setRefreshing(false);
    }
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center mb-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2 -ml-3"
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold">Recycle Bin</h1>
              </div>
              <p className="text-gray-600">
                Photos remain here for 30 days before being permanently deleted
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Photo Grid */}
          <PhotoGrid mode="recycled" onRefreshNeeded={handleRefresh} />
        </div>
      </main>
    </div>
  );
}
