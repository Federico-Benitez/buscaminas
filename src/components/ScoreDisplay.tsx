import { Trophy } from "lucide-react";

type Props = {
    score: number;
};

export function ScoreDisplay({ score }: Props) {
    return (
        <div className="mt-4 mr-auto w-fit font-bold text-lg flex items-center gap-2 bg-white/80 dark:bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-gray-200 dark:border-gray-700">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-900 dark:text-gray-100">
                Puntuación: <span className="text-yellow-600 dark:text-yellow-400">{score}</span>
            </span>
        </div>
    );
}
