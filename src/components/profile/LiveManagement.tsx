import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddLiveDialog } from "@/components/AddLiveDialog";
import { Calendar, Clock, Video, Users } from "lucide-react";

interface ScheduledLive {
  id: number;
  title: string;
  date: Date;
  type: "youtube" | "facebook" | "instagram" | "whatsapp";
  viewers: number;
}

export const LiveManagement = () => {
  // Mock data - à remplacer par des vraies données
  const [scheduledLives] = useState<ScheduledLive[]>([
    {
      id: 1,
      title: "Visite Villa Moderne Casablanca",
      date: new Date("2024-03-20T14:00:00"),
      type: "youtube",
      viewers: 12,
    },
    {
      id: 2,
      title: "Appartement Vue Mer - Tanger",
      date: new Date("2024-03-25T16:30:00"),
      type: "facebook",
      viewers: 8,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gestion des Lives</h3>
        <AddLiveDialog />
      </div>

      <div className="space-y-4">
        {scheduledLives.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Video className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Aucun live programmé</p>
            <p className="text-sm">Commencez par ajouter votre premier live</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {scheduledLives.map((live) => (
              <div
                key={live.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{live.title}</h4>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {live.date.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {live.date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    {live.type}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {live.viewers} inscrits
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};