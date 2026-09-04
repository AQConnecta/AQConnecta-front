import React, { useCallback, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { toast } from 'sonner';
import { Camera, Loader2, ZoomIn } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import api from '../../services/api';
import { Usuario } from '../../services/endpoints/auth';
import { handleApiError } from '../../lib/errors';
import { getCroppedBlob, Area } from '../../lib/cropImage';

type PerfilProps = {
  user: Usuario;
  isMe: boolean;
  onUploaded?: (url: string) => void;
};

function Perfil({ user, isMe, onUploaded }: PerfilProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function closeCropper() {
    setImageSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  }

  async function handleSave() {
    if (!imageSrc || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      const file = new File([blob], 'foto-perfil.jpg', { type: 'image/jpeg' });
      const res = await api.perfil.uploadImagemPerfil(file);
      toast.success('Foto de perfil atualizada!');
      onUploaded?.(res.data.data);
      closeCropper();
    } catch (error) {
      handleApiError(error, 'Erro ao enviar a imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Dialog open={!!imageSrc} onOpenChange={(open) => !open && closeCropper()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar foto de perfil</DialogTitle>
          </DialogHeader>

          <div className="relative w-full h-72 bg-muted rounded-lg overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className="flex items-center gap-3 px-1">
            <ZoomIn className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
              aria-label="Aproximar"
            />
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Arraste para posicionar e use o controle para aproximar.
          </p>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeCropper} disabled={uploading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Salvar foto'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardContent className="flex flex-col items-center justify-center gap-4 py-6">
        <div
          className={`relative ${isMe ? 'cursor-pointer group' : ''}`}
          onClick={() => isMe && fileInputRef.current?.click()}
        >
          <Avatar className="w-32 h-32 border-2 border-white shadow-md">
            <AvatarImage src={user.fotoPerfil || undefined} alt={user.nome} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {user.nome?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {isMe && (
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold">{user.nome}</h2>

        <div className="text-center">
          <p className="text-muted-foreground">
            <span className="font-semibold">E-mail:</span> {user.email}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default Perfil;
