import { Heart } from "lucide-react";

type Props = {
    lives: number;
    maxLives: number;
};

export function LivesDisplay({ lives, maxLives }: Props) {
    return (
        <div className="mt-4 ml-auto w-fit font-bold text-lg flex gap-1 bg-white/80 dark:bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {Array.from({ length: maxLives }).map((_, i) => (
                <div key={i} className="relative w-6 h-6">
                    {/* Empty Heart (Background) */}
                    <Heart className="absolute inset-0 w-6 h-6 text-red-500/30" />

                    {/* Filled Heart (Foreground) - Animates out when life is lost */}
                    <Heart
                        className={`
              absolute inset-0 w-6 h-6 text-red-500 fill-red-500 drop-shadow-sm
              ${i < lives ? 'opacity-100 scale-100' : 'animate-heart-drop'}
            `}
                    />
                </div>
            ))}
        </div>
    );
}
