import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  photos: File[];
  setPhotos: React.Dispatch<React.SetStateAction<File[]>>;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ photos, setPhotos }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a valid image file.`,
          variant: "destructive"
        });
      }
      
      if (!isValidSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds 10MB limit.`,
          variant: "destructive"
        });
      }
      
      return isValidType && isValidSize;
    });

    setPhotos(prev => [...prev, ...validFiles]);
    
    if (validFiles.length > 0) {
      toast({
        title: "Photos Uploaded",
        description: `${validFiles.length} photo(s) uploaded successfully.`,
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Photo Removed",
      description: "Photo has been removed from the upload list.",
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-primary" />
        Asset Photos
      </Label>
      
      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <Button 
          onClick={triggerFileInput}
          variant="outline"
          className="w-full border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 h-20"
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm font-medium">Upload Photos</span>
            <span className="text-xs text-muted-foreground">
              Click to select images (Max 10MB each)
            </span>
          </div>
        </Button>

        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="aspect-square bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Asset photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {photo.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {photos.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {photos.length} photo(s) selected
          </div>
        )}
      </div>
    </div>
  );
};