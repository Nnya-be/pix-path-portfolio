
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, Share, Recycle } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-20 md:py-32">
          <div className="container mx-auto px-4 text-center md:text-left">
            <div className="max-w-2xl md:ml-8 lg:ml-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your personal photo journey
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Upload, organize, and share your photos with ease. All your memories in one secure place.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button size="lg" className="w-full sm:w-auto">
                        Get Started
                      </Button>
                    </Link>
                    <Link to="/auth">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block absolute right-0 top-0 h-full w-2/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/90 z-10" />
            <div className="grid grid-cols-2 gap-4 opacity-90 transform translate-x-16 h-full p-8">
              <div className="grid gap-4">
                <div className="bg-gray-200 h-64 rounded-xl animate-fade-in" style={{ animationDelay: '0.2s' }}></div>
                <div className="bg-gray-300 h-32 rounded-xl animate-fade-in" style={{ animationDelay: '0.4s' }}></div>
                <div className="bg-gray-200 h-64 rounded-xl animate-fade-in" style={{ animationDelay: '0.6s' }}></div>
              </div>
              <div className="grid gap-4 pt-16">
                <div className="bg-gray-300 h-48 rounded-xl animate-fade-in" style={{ animationDelay: '0.3s' }}></div>
                <div className="bg-gray-200 h-64 rounded-xl animate-fade-in" style={{ animationDelay: '0.5s' }}></div>
                <div className="bg-gray-300 h-48 rounded-xl animate-fade-in" style={{ animationDelay: '0.7s' }}></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Everything you need for your photos</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
                <p className="text-gray-600">
                  Simply drag and drop your photos or use our file picker.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Share className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Sharing</h3>
                <p className="text-gray-600">
                  Generate temporary links to share your photos with friends.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Recycle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Recycle Bin</h3>
                <p className="text-gray-600">
                  Recover deleted photos for up to 30 days.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/80 to-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to store your memories?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust PixPath with their precious photos.
            </p>
            
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Start for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} PixPath. All rights reserved.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-primary text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-primary text-sm">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-primary text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
