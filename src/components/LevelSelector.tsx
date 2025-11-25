import type { MouseEvent } from 'react';

type Level = {
    id: 'beginner' | 'intermediate' | 'expert' | 'custom';
    label: string;
};

export default function LevelSelector({
    levels,
    onSelect,
}: {
    levels: Level[];
    onSelect: (id: Level['id']) => void;
}) {
    function handleClick(e: MouseEvent<HTMLButtonElement>, id: Level['id']) {
        e.preventDefault();
        onSelect(id);
    }

    return (
        <div className="text-black p-4 border-2 bg-white dark:bg-gray-800 dark:text-white">
            <h1 className="text-xl font-semibold mb-4">Seleccione el nivel</h1>
            <div className="space-y-2">
                {levels.map((lvl) => (
                    <button
                        key={lvl.id}
                        onClick={(e) => handleClick(e, lvl.id)}
                        className="block w-full text-left px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded hover:bg-gray-200"
                    >
                        {lvl.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
