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
        <div className="
            p-8 max-w-md w-full
            bg-gray-900 text-green-400
            border-4 border-green-400
            shadow-[8px_8px_0_0_#4ade80]
            font-mono
        ">
            <h1 className="text-2xl font-bold uppercase tracking-widest text-center mb-8 drop-shadow-[2px_2px_0_rgba(74,222,128,0.5)]">
                Seleccione Nivel
            </h1>
            <div className="space-y-4">
                {levels.map((lvl) => (
                    <button
                        key={lvl.id}
                        onClick={(e) => handleClick(e, lvl.id)}
                        className="
                            block w-full text-center px-4 py-3
                            bg-black text-green-400
                            border-2 border-green-400
                            font-bold uppercase tracking-wider
                            shadow-[4px_4px_0_0_#4ade80]
                            hover:translate-x-[2px] hover:translate-y-[2px]
                            hover:shadow-[2px_2px_0_0_#4ade80]
                            hover:bg-green-900/20
                            active:translate-x-[4px] active:translate-y-[4px]
                            active:shadow-none
                            transition-all duration-75
                        "
                    >
                        {lvl.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
