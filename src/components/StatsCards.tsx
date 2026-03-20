'use client';

interface StatsCardsProps {
  stats: {
    total: number;
    pendientes: number;
    enProceso: number;
    completos: number;
    enviados: number;
  };
  mostrarAnteriores?: boolean;
}

export default function StatsCards({ stats, mostrarAnteriores = false }: StatsCardsProps) {
  const cards = [
    { label: 'Total', value: stats.total, color: 'border-b-gray-500' },
    { label: 'Pendientes', value: stats.pendientes, color: 'border-b-orange-500' },
    { label: 'Completos', value: stats.completos, color: 'border-b-green-500' },
    { label: 'Entregados', value: stats.enviados, color: 'border-b-gray-400' },
  ];

  return (
    <div className='w-full'>
      <h1 className="text-2xl font-bold text-gray-900">
        Resumen de Examenes {mostrarAnteriores ? 'Anteriores' : 'de Hoy'}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-6">
        {cards.map(card => (
          <div key={card.label} className={`bg-white rounded-lg p-4 border border-gray-200 border-b-4 ${card.color} shadow-sm`}>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{card.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
