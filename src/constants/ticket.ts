// src/constants/ticket.ts
export const STATUS_MAP = {
  ABERTO: 'Aberto',
  EM_ANDAMENTO: 'Em andamento',
  FECHADO: 'Fechado',
} as const;

export const PRIORITY_MAP = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
} as const;

export type TicketStatus = keyof typeof STATUS_MAP;
export type TicketPriority = keyof typeof PRIORITY_MAP;