import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Camera, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Music, 
  MapPin, 
  CheckSquare,
  X,
  Plus,
  Trash
} from 'lucide-react';

interface AttachmentMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (files: File[], type: string) => void;
  onLocationShare: (location: { lat: number; lng: number; address: string }) => void;
  onChecklistCreate: (checklist: ChecklistItem[]) => void;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export const AttachmentMenu: React.FC<AttachmentMenuProps> = ({
  isOpen,
  onClose,
  onFileSelect,
  onLocationShare,
  onChecklistCreate
}) => {
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showChecklistDialog, setShowChecklistDialog] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', text: '', completed: false }
  ]);
  const [checklistTitle, setChecklistTitle] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const attachmentOptions = [
    { 
      icon: Camera, 
      label: 'Camera', 
      color: 'text-blue-500 bg-blue-500/10', 
      action: () => cameraInputRef.current?.click()
    },
    { 
      icon: ImageIcon, 
      label: 'Photos', 
      color: 'text-green-500 bg-green-500/10', 
      action: () => {
        if (fileInputRef.current) {
          fileInputRef.current.accept = 'image/*';
          fileInputRef.current.multiple = true;
          fileInputRef.current.click();
        }
      }
    },
    { 
      icon: Video, 
      label: 'Videos', 
      color: 'text-purple-500 bg-purple-500/10', 
      action: () => {
        if (fileInputRef.current) {
          fileInputRef.current.accept = 'video/*';
          fileInputRef.current.multiple = true;
          fileInputRef.current.click();
        }
      }
    },
    { 
      icon: Music, 
      label: 'Audio', 
      color: 'text-orange-500 bg-orange-500/10', 
      action: () => {
        if (fileInputRef.current) {
          fileInputRef.current.accept = 'audio/*';
          fileInputRef.current.multiple = true;
          fileInputRef.current.click();
        }
      }
    },
    { 
      icon: FileText, 
      label: 'Document', 
      color: 'text-red-500 bg-red-500/10', 
      action: () => {
        if (fileInputRef.current) {
          fileInputRef.current.accept = '.pdf,.doc,.docx,.txt,.rtf,.odt';
          fileInputRef.current.multiple = true;
          fileInputRef.current.click();
        }
      }
    },
    { 
      icon: MapPin, 
      label: 'Location', 
      color: 'text-cyan-500 bg-cyan-500/10', 
      action: () => setShowLocationDialog(true)
    },
    { 
      icon: CheckSquare, 
      label: 'Checklist', 
      color: 'text-yellow-500 bg-yellow-500/10', 
      action: () => setShowChecklistDialog(true)
    }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const fileType = e.target.accept?.includes('image') ? 'image' : 
                     e.target.accept?.includes('video') ? 'video' :
                     e.target.accept?.includes('audio') ? 'audio' : 'file';
      onFileSelect(files, fileType);
      onClose();
    }
  };

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Mock reverse geocoding - in real app would use Google Maps API
          const mockAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          onLocationShare({
            lat: latitude,
            lng: longitude,
            address: mockAddress
          });
          setShowLocationDialog(false);
          onClose();
        },
        (error) => {
          console.error('Error getting location:', error);
          // Mock location for demo
          onLocationShare({
            lat: 40.7128,
            lng: -74.0060,
            address: 'New York, NY, USA'
          });
          setShowLocationDialog(false);
          onClose();
        }
      );
    }
  };

  const addChecklistItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: '',
      completed: false
    };
    setChecklist(prev => [...prev, newItem]);
  };

  const updateChecklistItem = (id: string, text: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, text } : item
    ));
  };

  const removeChecklistItem = (id: string) => {
    if (checklist.length > 1) {
      setChecklist(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleChecklistCreate = () => {
    const validItems = checklist.filter(item => item.text.trim());
    if (validItems.length > 0) {
      onChecklistCreate(validItems);
      setShowChecklistDialog(false);
      setChecklist([{ id: '1', text: '', completed: false }]);
      setChecklistTitle('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Attachment Menu */}
      <div className="fixed bottom-20 left-4 right-4 z-50 flex justify-center">
        <Card className="w-full max-w-sm bg-card/95 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              {attachmentOptions.map((option) => (
                <Button
                  key={option.label}
                  variant="ghost"
                  onClick={option.action}
                  className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-background-secondary"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${option.color}`}>
                    <option.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">{option.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Location Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Share Location
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Share your current location with this chat.
            </p>
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Current Location</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your location will be shared as a map pin
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowLocationDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleLocationShare} className="flex-1">
                Share Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Checklist Dialog */}
      <Dialog open={showChecklistDialog} onOpenChange={setShowChecklistDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              Create Checklist
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="checklist-title">Title (Optional)</Label>
              <Input
                id="checklist-title"
                placeholder="Checklist title..."
                value={checklistTitle}
                onChange={(e) => setChecklistTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Items</Label>
              <div className="space-y-2">
                {checklist.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Input
                      placeholder={`Item ${index + 1}...`}
                      value={item.text}
                      onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                      className="flex-1"
                    />
                    {checklist.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChecklistItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <Button
                variant="outline"
                onClick={addChecklistItem}
                className="w-full flex items-center gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowChecklistDialog(false)} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleChecklistCreate} className="flex-1">
                Create Checklist
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};