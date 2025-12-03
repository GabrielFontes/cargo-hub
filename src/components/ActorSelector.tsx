import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

export interface Actor {
  id: string;
  name: string;
  avatar: string;
  salary: string;
  phone: string;
  email: string;
  positions: string[];
  isOnline?: boolean;
}

interface ActorSelectorProps {
  actors: Actor[];
  onActorClick: (actor: Actor) => void;
}

export function ActorSelector({ actors, onActorClick }: ActorSelectorProps) {
  if (actors.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 group">
          <div className="flex -space-x-2">
            {actors.slice(0, 3).map((actor, i) => (
              <img
                key={actor.id}
                src={actor.avatar}
                alt={actor.name}
                className="w-8 h-8 rounded-full border-2 border-card object-cover"
                style={{ zIndex: 3 - i }}
              />
            ))}
            {actors.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                +{actors.length - 3}
              </div>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-1 mb-1">
          Atores ({actors.length})
        </div>
        <div className="max-h-48 overflow-y-auto scrollbar-thin">
          {actors.map((actor) => (
            <button
              key={actor.id}
              onClick={() => onActorClick(actor)}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors text-left"
            >
              <div className="relative">
                <img
                  src={actor.avatar}
                  alt={actor.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                {actor.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-popover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{actor.name}</div>
                <div className="text-xs text-muted-foreground truncate">{actor.email}</div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
