import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button, Field, Panel, TextArea, TextInput } from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import { TICKET_STATUS } from "@/lib/labels";
import { isAdminRole, useStore } from "@/lib/store";

export const Route = createFileRoute("/support")({ component: SupportPage });

function SupportPage() {
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const people = useStore((state) => state.people);
  const tickets = useStore((state) => state.tickets);
  const createTicket = useStore((state) => state.createTicket);
  const reply = useStore((state) => state.replyTicket);
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  if (!user) return null;

  const visible = isAdminRole(user.role) ? tickets : tickets.filter((ticket) => ticket.userId === user.id);
  const current = visible.find((ticket) => ticket.id === openId) ?? visible[0];

  return (
    <Shell mode="shop">
      <h1 className="text-3xl font-bold tracking-tight">Поддержка</h1>
      <p className="mt-2 text-sm text-muted">
        Напишите вопрос. Ответ придёт в это же обращение. Обращения пока хранятся только в этом браузере — в базе такого раздела нет.
      </p>

      <form
        className="mt-5 grid gap-3 rounded-lg bg-card p-4"
        onSubmit={(event) => {
          event.preventDefault();
          const result = createTicket(subject, text);
          if (!result.ok) toast.error(result.error);
          else {
            toast.success("Обращение создано");
            setSubject("");
            setText("");
          }
        }}
      >
        <Field label="Тема">
          <TextInput value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Коротко, о чём речь" />
        </Field>
        <Field label="Описание">
          <TextArea value={text} onChange={(event) => setText(event.target.value)} placeholder="Что произошло и чем помочь" />
        </Field>
        <Button type="submit" className="w-full sm:w-auto">
          Отправить обращение
        </Button>
      </form>

      <div className="mt-6 grid items-start gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ul className="space-y-2">
          {visible.length === 0 ? <li className="text-sm text-muted">Обращений пока нет.</li> : null}
          {visible.map((ticket) => (
            <li key={ticket.id}>
              <button
                type="button"
                onClick={() => setOpenId(ticket.id)}
                className={`w-full rounded-lg px-3 py-3 text-left ${current?.id === ticket.id ? "bg-brand-wash" : "bg-card"}`}
              >
                <span className="block text-sm font-semibold">{ticket.subject}</span>
                <span className="mt-1 block text-xs text-muted">{TICKET_STATUS[ticket.status]}</span>
              </button>
            </li>
          ))}
        </ul>
        {current ? (
          <Panel>
            <h2 className="font-bold">{current.subject}</h2>
            <p className="mt-1 text-xs text-muted">
              {people.find((person) => person.id === current.userId)?.name} · {TICKET_STATUS[current.status]}
            </p>
            <ul className="mt-4 space-y-3">
              {current.messages.map((message) => {
                const author = people.find((person) => person.id === message.authorId);
                return (
                  <li key={message.id} className="rounded-md bg-surface px-3 py-2">
                    <p className="text-xs font-semibold text-brand-deep">{author?.name}</p>
                    <p className="mt-1 text-sm">{message.text}</p>
                    <p className="mt-1 text-xs text-muted">{formatDateTime(message.createdAt)}</p>
                  </li>
                );
              })}
            </ul>
            {isAdminRole(user.role) ? (
              <form
                className="mt-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  const result = reply(current.id, answer);
                  if (!result.ok) toast.error(result.error);
                  else {
                    setAnswer("");
                    toast.success("Ответ отправлен");
                  }
                }}
              >
                <TextArea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Ответ сотруднику" />
                <Button type="submit" className="mt-2">
                  Ответить
                </Button>
              </form>
            ) : null}
          </Panel>
        ) : null}
      </div>
    </Shell>
  );
}
