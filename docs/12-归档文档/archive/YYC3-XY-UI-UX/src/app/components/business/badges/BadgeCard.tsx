import React from 'react';
import { Badge } from '../../../../types/badge';
import { Card } from '../../ui/card';
import { Lock } from 'lucide-react';
import { cn } from '../../ui/utils';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

interface BadgeCardProps {
  badge: Badge;
  isEarned: boolean;
  onClick: (badge: Badge) => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isEarned, onClick }) => {
  // Rarity colors
  const rarityColors = {
    common: 'border-slate-200 bg-slate-50',
    rare: 'border-blue-200 bg-blue-50',
    epic: 'border-purple-200 bg-purple-50',
    legendary: 'border-amber-200 bg-amber-50',
    mythical: 'border-rose-200 bg-rose-50',
  };

  const glowStyles = badge.metadata.glowColor && isEarned ? {
    boxShadow: `0 0 15px ${badge.metadata.glowColor}40`
  } : {};

  return (
    <div 
      className={cn(
        "relative group cursor-pointer transition-all duration-300 hover:scale-105",
        !isEarned && "opacity-70 grayscale hover:grayscale-0 hover:opacity-100"
      )}
      onClick={() => onClick(badge)}
    >
      <Card 
        className={cn(
          "flex flex-col items-center p-4 h-full border-2",
          isEarned ? rarityColors[badge.rarity] : "border-slate-200 bg-slate-100"
        )}
        style={glowStyles}
      >
        <div className="relative w-24 h-24 mb-3">
          {/* Badge Icon */}
          <div className={cn(
            "w-full h-full rounded-full flex items-center justify-center overflow-hidden",
             !isEarned ? "bg-slate-200" : "bg-white"
          )}>
             {badge.icon.startsWith('/') ? (
               // Assuming these are local assets or placeholders. 
               // For now, if it's a path, we might not have the image. 
               // I'll use a placeholder or the ImageWithFallback if available, 
               // but ImageWithFallback is for Figma assets usually.
               // I will use a simple img or a placeholder div.
               <ImageWithFallback src={badge.icon} alt={badge.title} className="w-full h-full object-cover" />
             ) : (
                <span className="text-4xl">{badge.icon}</span> // For emojis in the group, though badge.icon is usually a path in the mock data
             )}
          </div>
          
          {/* Lock Overlay */}
          {!isEarned && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-full">
              <Lock className="w-8 h-8 text-slate-500" />
            </div>
          )}

          {/* Level Badge (Optional) */}
           {isEarned && (
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full border border-white shadow-sm capitalize">
              {badge.level}
            </div>
           )}
        </div>

        <h3 className="text-sm font-bold text-center mb-1 line-clamp-1">{badge.title}</h3>
        <p className="text-xs text-muted-foreground text-center line-clamp-2">{badge.description}</p>
        
        {badge.progress !== undefined && badge.progress > 0 && badge.progress < 100 && !isEarned && (
           <div className="w-full mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500" style={{ width: `${badge.progress}%` }} />
           </div>
        )}
      </Card>
    </div>
  );
};
