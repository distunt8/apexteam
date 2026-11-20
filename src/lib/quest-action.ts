/** Only the fields the selected automatic step accepts. Extra keys are rejected by the API. */
export function automaticActionBody(input: {
  actionType: string;
  targetId?: string | number | null;
  achievementCode?: string | null;
  productId?: string | number | null;
  minAmount?: string | number | null;
  count?: string | number | null;
  requireAvatar?: boolean | null;
}): Record<string, unknown> | null {
  const type = input.actionType.trim();
  if (!type) return null;
  const target = positive(input.targetId);
  const product = positive(input.productId);
  const minAmount = nonNegative(input.minAmount);
  const count = positive(input.count);
  if (type === "complete_quest" || type === "complete_survey" || type === "attend_event" || type === "read_company_news") {
    return target == null ? { type } : { type, targetId: target };
  }
  if (type === "make_purchase") {
    const body: Record<string, unknown> = { type };
    if (minAmount != null) body.minAmount = minAmount;
    if (product != null) body.productId = product;
    return body;
  }
  if (type === "send_thanks" || type === "receive_thanks") {
    return { type, count: count ?? 1 };
  }
  if (type === "earn_achievement") {
    const code = input.achievementCode?.trim();
    return code ? { type, achievementCode: code } : { type };
  }
  if (type === "complete_profile") return { type, requireAvatar: true };
  return { type };
}

function positive(value: string | number | null | undefined) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function nonNegative(value: string | number | null | undefined) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function describeAutomaticAction(raw: unknown) {
  if (!raw || typeof raw !== "object") return "";
  const action = raw as Record<string, unknown>;
  const type = String(action.type || "");
  const count = Number(action.count);
  const minAmount = Number(action.minAmount);
  if (type === "send_thanks") return `Отправить благодарностей: ${Number.isFinite(count) && count > 0 ? count : 1}`;
  if (type === "receive_thanks") return `Получить благодарностей: ${Number.isFinite(count) && count > 0 ? count : 1}`;
  if (type === "make_purchase") {
    const parts = ["Совершить покупку"];
    if (Number.isFinite(minAmount) && minAmount > 0) parts.push(`от ${minAmount} апексов`);
    if (action.productId) parts.push("конкретный товар");
    return parts.join(", ");
  }
  if (type === "complete_quest") return "Завершить выбранный квест";
  if (type === "complete_survey") return "Пройти выбранную анкету";
  if (type === "attend_event") return "Посетить выбранное мероприятие";
  if (type === "earn_achievement") return action.achievementCode ? `Получить достижение «${action.achievementCode}»` : "Получить достижение";
  if (type === "complete_profile") return "Поставить фото в профиле";
  if (type === "read_company_news") return "Прочитать выбранную новость";
  return "";
}
