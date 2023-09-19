"use client";

import Image from "next/image";
import { useGameState } from "./use-game-state";

export function CurrentImage({ gameId }: { gameId: string }) {
  const [state] = useGameState(gameId);

  const alt = "secret image";

  return (
    <div className="border-b rounded-lg overflow-hidden bg-blue-100 w-[512px] h-[512px] shrink-0">
      {state.image && (
        <Image src={state.image} alt={alt} width={512} height={512} />
      )}
    </div>
  );
}
