import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";
import { useStore, type Person } from "@/lib/store";

export function UserAvatar({
  user,
  className,
  src = user.avatarUrl,
}: {
  user: Pick<Person, "name" | "avatarUrl">;
  className?: string;
  src?: string;
}) {
  const [failed, setFailed] = useState("");
  return (
    <span
      className={cn(
        "inline-grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-wash font-bold text-brand-deep",
        className,
      )}
    >
      {src && src !== failed ? (
        <img
          src={src}
          alt={user.name}
          className="size-full object-cover"
          onError={() => setFailed(src)}
        />
      ) : (
        initials(user.name)
      )}
    </span>
  );
}

export function AvatarEditor({ user, compact = false }: { user: Person; compact?: boolean }) {
  const upload = useStore((state) => state.uploadAvatar);
  const input = useRef<HTMLInputElement>(null);
  const generation = useRef(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>();
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(
    () => () => {
      generation.current++;
    },
    [],
  );
  return (
    <div className="flex flex-wrap items-center gap-3">
      <UserAvatar
        user={user}
        src={preview ?? user.avatarUrl}
        className={compact ? "size-12 text-sm" : "size-20 rounded-2xl text-xl"}
      />
      <div className="space-y-1">
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-label={`Выбрать фото: ${user.name}`}
          disabled={pending}
          onChange={async (event) => {
            const selected = event.target.files?.[0];
            event.target.value = "";
            const attempt = ++generation.current;
            if (!selected) return;
            if (selected.size > 2 * 1024 * 1024) {
              toast.error("Фото должно быть не больше 2 МБ");
              return;
            }
            if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
              toast.error("Выберите JPEG, PNG или WebP");
              return;
            }
            try {
              const bitmap = await createImageBitmap(selected);
              const valid = bitmap.width <= 8192 && bitmap.height <= 8192;
              bitmap.close();
              if (!valid) {
                toast.error("Размер фото — не более 8192 × 8192 пикселей");
                return;
              }
              if (attempt === generation.current) setFile(selected);
            } catch {
              toast.error("Не удалось открыть изображение. Выберите другое фото.");
            }
          }}
        />
        <div className="flex flex-wrap gap-1">
          <Button variant="line" disabled={pending} onClick={() => input.current?.click()}>
            Изменить фото
          </Button>
          {file ? (
            <>
              <Button
                disabled={pending}
                onClick={async () => {
                  setPending(true);
                  try {
                    const result = await upload(user.id, file);
                    if (!result.ok) toast.error(result.error);
                    else {
                      setFile(null);
                      toast.success("Фото сохранено");
                    }
                  } finally {
                    setPending(false);
                  }
                }}
              >
                {pending ? "Сохраняем…" : "Сохранить фото"}
              </Button>
              <Button
                variant="ghost"
                disabled={pending}
                onClick={() => {
                  generation.current++;
                  setFile(null);
                }}
              >
                Отмена
              </Button>
            </>
          ) : null}
        </div>
        {!compact ? (
          <p className="text-xs text-muted" aria-live="polite">
            {file ? "Предпросмотр. Нажмите «Сохранить фото»." : "JPEG, PNG или WebP, до 2 МБ"}
          </p>
        ) : null}
      </div>
    </div>
  );
}
