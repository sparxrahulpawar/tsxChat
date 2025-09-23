import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  LogOut, 
  Camera, 
  Edit, 
  Moon, 
  Sun, 
  Monitor,
  Key,
  Mail,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Save,
  X
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { updateProfile } from '@/store/slices/userSlice';

interface SettingsScreenProps {
  onClose: () => void;
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose, onLogout }) => {
  const dispatch = useDispatch();
  const { currentUser } = useTypedSelector((state) => state.user);
  
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Love connecting with people!'
  });
  
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: {
      messages: true,
      calls: true,
      groups: true,
      sounds: true,
      desktop: true,
      email: false
    },
    privacy: {
      lastSeen: 'everyone',
      profilePhoto: 'everyone',
      status: 'contacts',
      readReceipts: true,
      typing: true
    }
  });

  const handleSaveProfile = () => {
    dispatch(updateProfile({
      name: profileForm.name
    }));
    setEditingProfile(false);
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('New passwords do not match');
      return;
    }
    // Mock password change
    alert('Password changed successfully');
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl">Settings</CardTitle>
            <CardDescription>Manage your account and preferences</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Appearance
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-2xl">{currentUser.avatar}</AvatarFallback>
                      </Avatar>
                      <Button 
                        size="sm" 
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{currentUser.name}</h3>
                      <p className="text-sm text-muted-foreground">Change your profile picture</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Profile Form */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Personal Information</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
                      >
                        {editingProfile ? (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!editingProfile}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!editingProfile}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!editingProfile}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!editingProfile}
                        placeholder="Tell others about yourself"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.new}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => togglePasswordVisibility('new')}
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => togglePasswordVisibility('confirm')}
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleChangePassword} className="w-full">
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Message Notifications</h4>
                        <p className="text-sm text-muted-foreground">Get notified about new messages</p>
                      </div>
                      <Switch
                        checked={settings.notifications.messages}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, messages: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Call Notifications</h4>
                        <p className="text-sm text-muted-foreground">Get notified about incoming calls</p>
                      </div>
                      <Switch
                        checked={settings.notifications.calls}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, calls: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Group Notifications</h4>
                        <p className="text-sm text-muted-foreground">Get notified about group activities</p>
                      </div>
                      <Switch
                        checked={settings.notifications.groups}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, groups: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Sound Notifications</h4>
                        <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
                      </div>
                      <Switch
                        checked={settings.notifications.sounds}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, sounds: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Desktop Notifications</h4>
                        <p className="text-sm text-muted-foreground">Show desktop notifications</p>
                      </div>
                      <Switch
                        checked={settings.notifications.desktop}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, desktop: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, email: checked }
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control who can see your information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Read Receipts</h4>
                        <p className="text-sm text-muted-foreground">Show when you've read messages</p>
                      </div>
                      <Switch
                        checked={settings.privacy.readReceipts}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            privacy: { ...prev.privacy, readReceipts: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Typing Indicators</h4>
                        <p className="text-sm text-muted-foreground">Show when you're typing</p>
                      </div>
                      <Switch
                        checked={settings.privacy.typing}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            privacy: { ...prev.privacy, typing: checked }
                          }))
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Who can see your last seen</h4>
                      <div className="flex gap-2">
                        {['everyone', 'contacts', 'nobody'].map((option) => (
                          <Badge
                            key={option}
                            variant={settings.privacy.lastSeen === option ? 'default' : 'outline'}
                            className="cursor-pointer capitalize"
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, lastSeen: option }
                            }))}
                          >
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Who can see your profile photo</h4>
                      <div className="flex gap-2">
                        {['everyone', 'contacts', 'nobody'].map((option) => (
                          <Badge
                            key={option}
                            variant={settings.privacy.profilePhoto === option ? 'default' : 'outline'}
                            className="cursor-pointer capitalize"
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, profilePhoto: option }
                            }))}
                          >
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Who can see your status</h4>
                      <div className="flex gap-2">
                        {['everyone', 'contacts', 'nobody'].map((option) => (
                          <Badge
                            key={option}
                            variant={settings.privacy.status === option ? 'default' : 'outline'}
                            className="cursor-pointer capitalize"
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, status: option }
                            }))}
                          >
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize how ChatConnect looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Theme</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Monitor }
                      ].map(({ value, label, icon: Icon }) => (
                        <Card
                          key={value}
                          className={`cursor-pointer transition-colors border-2 ${
                            settings.theme === value ? 'border-primary' : 'border-border'
                          }`}
                          onClick={() => setSettings(prev => ({ ...prev, theme: value }))}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <Icon className="w-8 h-8 mb-2" />
                            <span className="font-medium">{label}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Logout Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <Button
              variant="destructive"
              onClick={onLogout}
              className="w-full flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};