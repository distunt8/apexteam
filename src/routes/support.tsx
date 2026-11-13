import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pager, usePage } from "@/components/pager";
import { Shell } from "@/components/shell";
import { Button, Field, Panel, TextArea, TextInput } from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import { TICKET_STATUS } from "@/lib/labels";
import { canManageSupport, useStore, type TicketStatus } from "@/lib/store";

export const Route = createFileRoute("/support")({ component: SupportPage });

function SupportPage() {
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const tickets = useStore((state) => state.tickets);
  const ticketsError = useStore((state) => state.ticketsError);
  const loadTickets = useStore((state) => state.loadTickets);
  const createTicket = useStore((state) => state.createTicket);
  const reply = useStore((state) => state.replyTicket);
  const openTicket = useStore((state) => state.openTicket);
  const setStatus = useStore((state) => state.setTicketStatus);
  const assignTicket = useStore((state) => state.assignTicket);
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [pending, setPending] = useState(false);
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  const current = tickets.find((ticket) => ticket.id === openId) ?? tickets[0];
  const ticketPage = usePage(tickets, 8);
  useEffect(() => {
    if (current?.id) void openTicket(current.id);
  }, [current?.id, tickets.length, openTicket]);

  if (!user) return null;
  const staff = canManageSupport(user.role);

  return (
    <Shell mode="shop">
      <h1 className="text-3xl font-bold tracking-tight">Поддержка</h1>
      <p className="mt-2 text-sm text-muted">
        {staff ? "Все обращения сотрудников. Ответ и статус пишутся здесь." : "Напишите вопрос. Ответ придёт в это же обращение."}
      </p>
      {ticketsError ? <p className="mt-3 text-sm text-danger">{ticketsError}</p> : null}

      <form
        className="mt-5 grid gap-3 rounded-lg bg-card p-4"
        onSubmit={(event) => {
          event.preventDefault();
          setPending(true);
          void createTicket(subject, text).then((result) => {
            setPending(false);
            if (!result.ok) toast.error(result.error);
            else {
              toast.success("Обращение создано");
              setSubject("");
              setText("");
            }
          });
        }}
      >
        <Field label="Тема">
          <TextInput value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Коротко, о чём речь" />
        </Field>
        <Field label="Описание">
          <TextArea value={text} onChange={(event) => setText(event.target.value)} placeholder="Что произошло и чем помочь" />
        </Field>
        <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
          Отправить обращение
        </Button>
      </form>

      <div className="mt-6 grid items-start gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div>
        <ul className="space-y-2">
          {tickets.length === 0 ? <li className="text-sm text-muted">Обращений пока нет.</li> : null}
          {ticketPage.items.map((ticket) => (
            <li key={ticket.id}>
              <button
                type="button"
                onClick={() => setOpenId(ticket.id)}
                className={`w-full rounded-lg px-3 py-3 text-left ${current?.id === ticket.id ? "bg-brand-wash" : "bg-card"}`}
              >
                <span className="block text-sm font-semibold">{ticket.subject}</span>
                <span className="mt-1 block text-xs text-muted">
                  {staff ? `${ticket.userName || "Сотрудник"} · ` : ""}
                  {TICKET_STATUS[ticket.status]}
                  {ticket.assignedName ? ` · ${ticket.assignedName}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Pager page={ticketPage.page} pages={ticketPage.pages} total={ticketPage.total} onPage={ticketPage.setPage} />
        </div>
        {current ? (
          <Panel>
            <h2 className="font-bold">{current.subject}</h2>
            <p className="mt-1 text-xs text-muted">
              {current.userName || "Сотрудник"} · {TICKET_STATUS[current.status]}
              {current.assignedName ? ` · ведёт ${current.assignedName}` : staff ? " · не назначено" : ""}
            </p>
            {staff ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  className="h-10 rounded-md border border-line bg-surface px-2 text-sm"
                  value={current.status}
                  onChange={(event) => {
                    const status = event.target.value as TicketStatus;
                    void setStatus(current.id, status).then((result) => {
                      if (!result.ok) toast.error(result.error);
                    });
                  }}
                >
                  {(Object.keys(TICKET_STATUS) as TicketStatus[]).map((status) => (
                    <option key={status} value={status}>
                      {TICKET_STATUS[status]}
                    </option>
                  ))}
                </select>
                {current.assignedTo === user.id ? (
                  <Button
                    variant="line"
                    onClick={() =>
                      void assignTicket(current.id, null).then((result) => {
                        if (!result.ok) toast.error(result.error);
                      })
                    }
                  >
                    Снять с себя
                  </Button>
                ) : !current.assignedTo ? (
                  <Button
                    variant="line"
                    onClick={() =>
                      void assignTicket(current.id, user.id).then((result) => {
                        if (!result.ok) toast.error(result.error);
                        else toast.success("Обращение у вас");
                      })
                    }
                  >
                    Взять себе
                  </Button>
                ) : null}
              </div>
            ) : null}
            <ul className="mt-4 space-y-3">
              {current.messages.length === 0 ? <li className="text-sm text-muted">Сообщений пока нет.</li> : null}
              {current.messages.map((message) => (
                <li key={message.id} className="rounded-md bg-surface px-3 py-2">
                  <p className="text-xs font-semibold text-brand-deep">{message.authorName || "Сотрудник"}</p>
                  <p className="mt-1 text-sm">{message.text}</p>
                  <p className="mt-1 text-xs text-muted">{message.createdAt ? formatDateTime(message.createdAt) : ""}</p>
                </li>
              ))}
            </ul>
            {current.status === "closed" || current.status === "resolved" ? (
              <p className="mt-4 text-sm text-muted">
                {current.status === "resolved"
                  ? "Обращение решено. Новые сообщения не принимаются."
                  : "Обращение закрыто. Новые сообщения не принимаются."}
              </p>
            ) : (
            <form
              className="mt-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (replying) return;
                setReplying(true);
                void reply(current.id, answer).then((result) => {
                  setReplying(false);
                  if (!result.ok) toast.error(result.error);
                  else {
                    setAnswer("");
                    toast.success("Сообщение отправлено");
                  }
                });
              }}
            >
              <TextArea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Сообщение" />
              <Button type="submit" className="mt-2" disabled={replying}>
                Отправить
              </Button>
            </form>
            )}
          </Panel>
        ) : null}
      </div>
    </Shell>
  );
}
