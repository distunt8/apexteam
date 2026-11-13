import type { Category, EntryType, OrderStatus, Role, TicketStatus } from "@/lib/store";

export const ROLE_LABEL: Record<Role, string> = {
  employee: "Сотрудник",
  manager: "Руководитель",
  hr: "HR",
  merchandiser: "Мерчендайзер",
  support: "Оператор поддержки",
  admin: "Администратор",
  chief: "Главный администратор",
};

export function roleCodeLabel(code: string) {
  const key = code.trim().toLowerCase();
  if (/superadmin|super-admin|chief|owner/.test(key)) return "Главный администратор";
  if (/^admin$|administrator/.test(key)) return "Администратор";
  if (/humanresources|^hr$/.test(key)) return "HR";
  if (/merchandiser|^merch$/.test(key)) return "Мерчендайзер";
  if (/support/.test(key) || key === "operator" || key === "helpdesk") return "Оператор поддержки";
  if (/manager|lead|supervisor/.test(key)) return "Руководитель";
  if (/employee|^user$/.test(key)) return "Сотрудник";
  return ROLE_LABEL[key as Role] ?? code;
}

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
  paid: "Оплачен",
  pending: "Ожидает",
  processing: "Обрабатывается",
  ready: "Готов",
  completed: "Завершён",
  issued: "Выдан",
  cancelled: "Отменён",
  created: "Создан",
};

export function orderStatusLabel(status: string) {
  const key = status.trim().toLowerCase();
  return ORDER_STATUS[key as OrderStatus] ?? status;
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

export const ORDER_FLOW: OrderStatus[] = ["paid", "processing", "ready", "cancelled"];
