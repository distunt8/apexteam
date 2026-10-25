import type { Category, EntryType, OrderStatus, Role, TicketStatus } from "@/lib/store";

export const ROLE_LABEL: Record<Role, string> = {
  employee: "Сотрудник",
  manager: "Руководитель",
  admin: "Администратор",
  chief: "Главный администратор",
};

export const CATEGORY_LABEL: Record<string, string> = {
  merch: "Мерч",
  certificate: "Сертификаты",
  experience: "Впечатления",
};

export function categoryLabel(id: Category, name?: string) {
  if (name?.trim()) return name;
  return CATEGORY_LABEL[id] ?? "Без категории";
}

export const ORDER_STATUS: Record<OrderStatus, string> = {
  created: "Создан",
  processing: "Обрабатывается",
  ready: "Готов",
  issued: "Выдан",
  cancelled: "Отменён",
};

export function orderStatusLabel(status: string) {
  return ORDER_STATUS[status as OrderStatus] ?? status;
}

export const TICKET_STATUS: Record<TicketStatus, string> = {
  open: "Открыто",
  in_progress: "В работе",
  resolved: "Решено",
  closed: "Закрыто",
};

export const ENTRY_LABEL: Record<EntryType, string> = {
  activity_reward: "Награда за активность",
  recognition_sent: "Благодарность отправлена",
  recognition_received: "Благодарность получена",
  manager_award: "Поощрение руководителя",
  purchase: "Покупка",
  refund: "Возврат",
  admin_adjustment: "Корректировка",
};

export const ORDER_FLOW: OrderStatus[] = ["created", "processing", "ready", "issued", "cancelled"];
