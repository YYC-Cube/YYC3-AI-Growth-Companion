import React from 'react';
import { BadgeGroup } from '../../../../types/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { cn } from '../../ui/utils';
import { Trophy } from 'lucide-react';

interface BadgeSeriesCardProps {
  group: BadgeGroup;
  onClick: (groupId: string) => void;
  isActive?: boolean;
}

export const BadgeSeriesCard: React.FC<BadgeSeriesCardProps> = ({ group, onClick, isActive }) => {
  return (
    <div 
      className={cn(
        "cursor-pointer transition-all duration-200",
        isActive ? "ring-2 ring-primary ring-offset-2 rounded-xl" : "hover:opacity-80"
      )}
      onClick={() => onClick(group.id)}
    >
      <Card className="h-full">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
              {group.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{group.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                 <Trophy className="w-3 h-3" />
                 <span>{group.earnedCount}/{group.badgeCount}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto">
             <div className="flex justify-between text-xs mb-1">
               <span>进度</span>
               <span>{Math.round(group.progress)}%</span>
             </div>
             <Progress value={group.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
