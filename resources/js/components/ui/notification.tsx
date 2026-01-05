import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const notificationVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        info: "border-sky-200/60 bg-sky-50 text-sky-950 dark:border-sky-500/30 dark:bg-sky-950/40 dark:text-sky-50",
        success:
          "border-emerald-200/60 bg-emerald-50 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-50",
        warning:
          "border-amber-200/70 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-50",
        danger:
          "border-rose-200/70 bg-rose-50 text-rose-950 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-50",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

type NotificationVariant = VariantProps<typeof notificationVariants>["variant"]

type NotificationOptions = {
  className?: string
  icon?: React.ReactNode
  titleClassName?: string
  descriptionClassName?: string
  duration?: number
}

function Notification({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof notificationVariants>) {
  return (
    <div
      data-slot="notification"
      role="alert"
      className={cn(notificationVariants({ variant }), className)}
      {...props}
    />
  )
}

function NotificationTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="notification-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function NotificationDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="notification-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-current/80 [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

type Toast = {
  id: string
  variant: NotificationVariant
  title: React.ReactNode
  description?: React.ReactNode
  options: NotificationOptions
}

const toastListeners: Array<(toasts: Toast[]) => void> = []
let toastQueue: Toast[] = []

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toastQueue]))
}

function removeToast(id: string) {
  toastQueue = toastQueue.filter((toast) => toast.id !== id)
  notifyListeners()
}

function addToast(
  variant: NotificationVariant,
  title: React.ReactNode,
  description?: React.ReactNode,
  options: NotificationOptions = {}
) {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  const duration = options.duration ?? 4000

  toastQueue = [
    ...toastQueue,
    {
      id,
      variant,
      title,
      description,
      options,
    },
  ]
  notifyListeners()

  if (duration > 0) {
    window.setTimeout(() => removeToast(id), duration)
  }

  return id
}

const notifications = {
  info: (
    title: React.ReactNode,
    description?: React.ReactNode,
    options?: NotificationOptions
  ) => addToast("info", title, description, options),
  success: (
    title: React.ReactNode,
    description?: React.ReactNode,
    options?: NotificationOptions
  ) => addToast("success", title, description, options),
  warning: (
    title: React.ReactNode,
    description?: React.ReactNode,
    options?: NotificationOptions
  ) => addToast("warning", title, description, options),
  danger: (
    title: React.ReactNode,
    description?: React.ReactNode,
    options?: NotificationOptions
  ) => addToast("danger", title, description, options),
}

function useToasts() {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  React.useEffect(() => {
    toastListeners.push(setToasts)
    setToasts([...toastQueue])

    return () => {
      const index = toastListeners.indexOf(setToasts)
      if (index !== -1) {
        toastListeners.splice(index, 1)
      }
    }
  }, [])

  return { toasts, removeToast }
}

function Toaster() {
  const { toasts, removeToast } = useToasts()

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <Notification
          key={toast.id}
          variant={toast.variant}
          className={cn(
            "pointer-events-auto shadow-lg",
            toast.options.className
          )}
        >
          {toast.options.icon}
          <div className="col-start-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <NotificationTitle className={toast.options.titleClassName}>
                {toast.title}
              </NotificationTitle>
              {toast.description ? (
                <NotificationDescription
                  className={toast.options.descriptionClassName}
                >
                  {toast.description}
                </NotificationDescription>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="rounded-sm text-current/70 transition-colors hover:text-current"
              aria-label="Dismiss notification"
            >
              <X className="size-4" />
            </button>
          </div>
        </Notification>
      ))}
    </div>
  )
}

export {
  Notification,
  NotificationTitle,
  NotificationDescription,
  notifications,
  Toaster,
  type NotificationVariant,
  type NotificationOptions,
}
