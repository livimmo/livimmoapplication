import { useNavigate } from "react-router-dom";
import { type Property } from "@/types/property";
import { PropertyImage } from "./property/PropertyImage";
import { PropertyInfo } from "./PropertyInfo";

type PropertyCardProps = Property & {
  viewers?: number;
  isLiveNow?: boolean;
  remainingSeats?: number;
  isUserRegistered?: boolean;
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
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const currentUrl = `${window.location.origin}/property/${id}`;

  const handleJoinLive = () => {
    navigate(`/live/${id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
      />
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
    </div>
  );
};