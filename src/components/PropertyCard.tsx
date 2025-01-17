import { useNavigate } from "react-router-dom";
import { type Property } from "@/types/property";
import { PropertyImage } from "./property/PropertyImage";
import { PropertyInfo } from "./PropertyInfo";
import { PropertyActions } from "./property/PropertyActions";
import { FavoriteButton } from "./property/FavoriteButton";
import { Badge } from "./ui/badge";
import { getRandomTags } from "@/utils/propertyTags";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";

type PropertyCardProps = Property & {
  viewers?: number;
  isLiveNow?: boolean;
  remainingSeats?: number;
  isUserRegistered?: boolean;
  offers?: number;
};

export const PropertyCard = ({
  id,
  images,
  title,
  price,
  location,
  type,
  surface,
  rooms,
  hasLive,
  liveDate,
  viewers = 0,
  isLiveNow,
  remainingSeats = 15,
  isUserRegistered = false,
  offers = 0,
  agent,
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const currentUrl = `${window.location.origin}/property/${id}`;
  const tags = getRandomTags();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleJoinLive = () => {
    navigate(`/live/${id}`);
  };

  const handleAgentClick = () => {
    if (agent.id) {
      navigate(`/agent/${agent.id}`);
    }
  };

  const handleAuthAction = (action: 'login' | 'signup') => {
    setShowAuthDialog(false);
    navigate(`/${action}`);
  };

  // Générer aléatoirement le statut vérifié si non défini
  if (agent.verified === undefined) {
    agent.verified = Math.random() > 0.5;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <PropertyImage
            id={id}
            title={title}
            image={images[0]}
            hasLive={hasLive}
            liveDate={liveDate}
            viewers={viewers}
            currentUrl={currentUrl}
            isLiveNow={isLiveNow}
            isUserRegistered={isUserRegistered}
            remainingSeats={remainingSeats}
            offers={offers}
          />
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <FavoriteButton 
              propertyId={id} 
              title={title} 
              onUnauthorized={() => setShowAuthDialog(true)}
            />
            <PropertyActions title={title} currentUrl={currentUrl} />
          </div>
          <div className="absolute top-2 left-2 right-14 z-10">
            <div className="flex flex-wrap gap-1">
              {!hasLive && (
                <Badge variant="destructive">Vendu</Badge>
              )}
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={
                    tag === "Coup de fusil"
                      ? "destructive"
                      : tag === "Nouveauté"
                      ? "default"
                      : "secondary"
                  }
                  className="bg-white/90 backdrop-blur-sm whitespace-nowrap"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <PropertyInfo
          id={id}
          title={title}
          price={price}
          location={location}
          type={type}
          surface={surface}
          rooms={rooms}
          hasLive={hasLive}
          liveDate={liveDate}
          onJoinLive={handleJoinLive}
          isLiveNow={isLiveNow}
          remainingSeats={remainingSeats}
          isUserRegistered={isUserRegistered}
        />
        <div 
          className="px-4 py-3 border-t flex items-center justify-between bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleAgentClick}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarImage src={agent.image} alt={agent.name} />
              <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{agent.name}</span>
              <span className="text-xs text-gray-500">{agent.company || 'Agent indépendant'}</span>
            </div>
          </div>
          {agent.verified && (
            <div className="flex items-center gap-1 text-primary">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs">Vérifié</span>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connectez-vous pour ajouter aux favoris</DialogTitle>
            <DialogDescription>
              Pour ajouter ce bien à vos favoris, vous devez avoir un compte Livimmo.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-4">
            <Button variant="outline" className="w-full" onClick={() => handleAuthAction('signup')}>
              Créer un compte
            </Button>
            <Button className="w-full" onClick={() => handleAuthAction('login')}>
              Se connecter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};