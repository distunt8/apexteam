import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button, Panel, TextArea, TextInput } from "@/components/ui";
import type { SurveyQuestionView } from "@/lib/apex";
import { formatPoints } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/surveys/$surveyId")({ component: SurveyPage });

function SurveyPage() {
  const { surveyId } = Route.useParams();
  const survey = useStore((state) => state.activitiesCatalog.surveys.find((item) => item.id === surveyId));
  const submit = useStore((state) => state.submitSurvey);
  const navigate = useNavigate();
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);

  if (!survey) {
    return (
      <Shell>
        <h1 className="text-3xl font-bold">Опрос не найден</h1>
        <Link to="/activities" search={{ kind: "survey" }} className="mt-4 inline-block text-sm font-semibold text-brand">
          Ко всем активностям
        </Link>
      </Shell>
    );
  }

  const locked = !survey.canRespond;

  async function send() {
    if (!survey) return;
    const missing = survey.questions.find((question) => question.required && empty(values[question.id]));
    if (missing) {
      toast.error("Заполните обязательные вопросы");
      return;
    }
    setBusy(true);
    const result = await submit(
      survey.id,
      survey.questions
        .filter((question) => !empty(values[question.id]))
        .map((question) => ({ questionId: question.id, value: values[question.id] })),
    );
    setBusy(false);
    if (!result.ok) toast.error(result.error);
    else {
      toast.success("Ответы отправлены");
      void navigate({ to: "/activities", search: { kind: "survey" } });
    }
  }

  return (
    <Shell>
      <p className="text-xs font-semibold text-brand">Опрос</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{survey.title}</h1>
      {survey.description ? <p className="mt-2 max-w-2xl text-sm text-muted">{survey.description}</p> : null}
      <p className="mt-2 text-sm text-muted">{survey.reward > 0 ? `Награда ${formatPoints(survey.reward)}` : "Без награды"}</p>
      <Panel className="mt-5 max-w-2xl">
        {survey.questions.length === 0 ? <p className="text-sm text-muted">Вопросов пока нет.</p> : null}
        {locked ? <p className="text-sm text-muted">Ответ уже отправлен.</p> : null}
        {!locked ? (
          <div className="space-y-5">
            {survey.questions.map((question) => (
              <Question key={question.id} question={question} value={values[question.id]} onChange={(value) => setValues((current) => ({ ...current, [question.id]: value }))} />
            ))}
            {survey.questions.length > 0 ? (
              <Button disabled={busy} onClick={() => void send()}>
                {busy ? "Отправляем…" : "Отправить ответы"}
              </Button>
            ) : null}
          </div>
        ) : null}
      </Panel>
    </Shell>
  );
}

function empty(value: unknown) {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

function Question({ question, value, onChange }: { question: SurveyQuestionView; value: unknown; onChange: (value: unknown) => void }) {
  const selected = Array.isArray(value) ? value.map(String) : [];
  return (
    <fieldset>
      <legend className="text-sm font-semibold">
        {question.text}
        {question.required ? "" : " · необязательно"}
      </legend>
      {question.type === "text" ? (
        <TextArea className="mt-2 min-h-16" value={typeof value === "string" ? value : ""} onChange={(event) => onChange(event.target.value)} />
      ) : null}
      {question.type === "number" ? (
        <TextInput className="mt-2 max-w-40" inputMode="numeric" value={value == null ? "" : String(value)} onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))} />
      ) : null}
      {question.type === "boolean" ? (
        <div className="mt-2 flex gap-4 text-sm">
          {[true, false].map((option) => (
            <label key={String(option)} className="flex min-h-10 items-center gap-2">
              <input type="radio" checked={value === option} onChange={() => onChange(option)} />
              {option ? "Да" : "Нет"}
            </label>
          ))}
        </div>
      ) : null}
      {question.type === "rating" ? (
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <button key={score} type="button" onClick={() => onChange(score)} className={`grid size-11 place-items-center rounded-md text-sm font-bold ${value === score ? "bg-brand text-white" : "bg-card"}`}>
              {score}
            </button>
          ))}
        </div>
      ) : null}
      {question.type === "single_choice" || question.type === "multiple_choice" ? (
        <div className="mt-2 flex flex-col gap-1">
          {question.options.map((option) => (
            <label key={option} className="flex min-h-10 items-center gap-2 text-sm">
              <input
                type={question.type === "single_choice" ? "radio" : "checkbox"}
                checked={question.type === "single_choice" ? value === option : selected.includes(option)}
                onChange={() => {
                  if (question.type === "single_choice") onChange(option);
                  else onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]);
                }}
              />
              {option}
            </label>
          ))}
        </div>
      ) : null}
    </fieldset>
  );
}
