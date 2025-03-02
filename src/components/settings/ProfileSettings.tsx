
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProfileFormValues {
  email: string;
  fullName: string;
  website: string;
  avatarUrl: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const ProfileSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>();

  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile(data);
          setValue('email', user.email || '');
          setValue('fullName', data.full_name || '');
          setValue('website', data.website || '');
          setAvatarUrl(data.avatar_url);
          
          // Set social links
          const socialLinks = data.social_links || {};
          setValue('socialLinks.instagram', socialLinks.instagram || '');
          setValue('socialLinks.facebook', socialLinks.facebook || '');
          setValue('socialLinks.linkedin', socialLinks.linkedin || '');
          setValue('socialLinks.twitter', socialLinks.twitter || '');
        }
      } catch (error: any) {
        toast.error(error.message || 'Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setUpdating(true);
    
    try {
      const updates = {
        id: user.id,
        full_name: data.fullName,
        website: data.website,
        avatar_url: avatarUrl,
        social_links: {
          instagram: data.socialLinks.instagram || '',
          facebook: data.socialLinks.facebook || '',
          linkedin: data.socialLinks.linkedin || '',
          twitter: data.socialLinks.twitter || '',
        },
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar perfil');
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setUploadingAvatar(true);

    try {
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
      toast.success('Avatar atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer upload do avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil do Usuário</CardTitle>
        <CardDescription>
          Gerencie suas informações pessoais e configurações de perfil
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl || ''} alt="Avatar" />
                <AvatarFallback>{profile?.full_name?.substring(0, 2)?.toUpperCase() || user?.email?.substring(0, 2)?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center">
                <Label htmlFor="avatar" className="cursor-pointer text-sm text-primary hover:underline">
                  {uploadingAvatar ? 'Enviando...' : 'Alterar avatar'}
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar}
                />
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register('email')}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    {...register('fullName', { required: 'Nome é obrigatório' })}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://seu-site.com"
                  {...register('website')}
                />
              </div>

              <div className="space-y-2">
                <Label>Redes Sociais</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="instagram" className="text-xs">Instagram</Label>
                    <Input
                      id="instagram"
                      placeholder="@seuusuario"
                      {...register('socialLinks.instagram')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook" className="text-xs">Facebook</Label>
                    <Input
                      id="facebook"
                      placeholder="username"
                      {...register('socialLinks.facebook')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin" className="text-xs">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      placeholder="username"
                      {...register('socialLinks.linkedin')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter" className="text-xs">Twitter</Label>
                    <Input
                      id="twitter"
                      placeholder="@username"
                      {...register('socialLinks.twitter')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={updating}>
            {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Salvar alterações
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileSettings;
