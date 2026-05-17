import type { Question, ClueType } from '../types/game';

const BADGE_CONFIG: Record<ClueType, { bg: string; icon: string; label: string }> = {
  landmark: { bg: 'bg-at-blue text-white', icon: '🏛️', label: 'LANDMARK' },
  makanan:  { bg: 'bg-at-yellow text-at-black', icon: '🍜', label: 'MAKANAN' },
  budaya:   { bg: 'bg-at-purple text-white', icon: '🎭', label: 'BUDAYA' },
};

interface Props {
  question: Question;
}

export function ClueCard({ question }: Props) {
  const badge = BADGE_CONFIG[question.clueType];

  return (
    <div
      className="bg-at-cream border-3 border-at-black shadow-[4px_4px_0_#1A1A1A] p-4 flex flex-col gap-3"
      style={{ borderRadius: '12px 8px 14px 6px' }}
    >
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-at-black font-bubblegum text-sm w-fit ${badge.bg}`}>
        <span>{badge.icon}</span>
        <span>{badge.label}</span>
      </div>

      <p className="font-bubblegum text-lg text-at-black leading-tight">{question.question}</p>

      <div className="rounded-lg overflow-hidden border-3 border-at-black shadow-[3px_3px_0_#1A1A1A]">
        <img
          src={question.imageUrl}
          alt={question.imageAlt}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x200?text=Gambar+tidak+tersedia';
          }}
        />
      </div>
    </div>
  );
}
