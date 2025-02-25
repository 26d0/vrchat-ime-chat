interface CharacterCounterProps {
  current: number;
  max: number;
}

export function CharacterCounter({ current, max }: CharacterCounterProps) {
  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">
      {current}/{max}
    </div>
  );
}