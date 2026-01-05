import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  AlertTriangle,
  CheckCircle2,
  InfoIcon,
  X,
  XCircle,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 left-1/2 z-[100] flex max-h-screen w-full -translate-x-1/2 flex-col gap-2 p-4 md:max-w-[420px]',
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center gap-4 overflow-hidden rounded-lg border-l-4 bg-white p-4 pr-10 shadow-xl transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-top-full data-[state=open]:slide-in-from-top-full',
  {
    variants: {
      variant: {
        default:
          'border-l-gray-400 border-r border-t border-b border-gray-200',
        destructive:
          'border-l-red-500 border-r border-t border-b border-red-100',
        success:
          'border-l-green-500 border-r border-t border-b border-green-100',
        warning:
          'border-l-amber-500 border-r border-t border-b border-amber-100',
        info: 'border-l-blue-500 border-r border-t border-b border-blue-100',
        danger:
          'border-l-red-500 border-r border-t border-b border-red-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold text-gray-900', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm text-gray-600', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

type ToastOptions = {
  duration?: number;
  icon?: React.ReactNode;
};

type ToastData = {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastProps['variant'];
  duration?: number;
  icon?: React.ReactNode;
};

const toastListeners: Array<(toasts: ToastData[]) => void> = [];
let toastQueue: ToastData[] = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toastQueue]));
}

function removeToast(id: string) {
  toastQueue = toastQueue.filter((toast) => toast.id !== id);
  notifyListeners();
}

function addToast(
  variant: ToastProps['variant'],
  title: React.ReactNode,
  description?: React.ReactNode,
  options: ToastOptions = {},
) {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  toastQueue = [
    ...toastQueue,
    {
      id,
      title,
      description,
      variant,
      duration: options.duration,
      icon: options.icon,
    },
  ];
  notifyListeners();

  return id;
}

const notifications = {
  info: (
    title: React.ReactNode,
    description?: React.ReactNode,
    options?: ToastOptions,
  ) => addToast('info', title, description, options),
  success: (
    title: React.ReactNode,
    description?: React.ReactNode,
    options?: ToastOptions,
  ) => addToast('success', title, description, options),
  warning: (
    title: React.ReactNode,
    description?: React.ReactNode,
    options?: ToastOptions,
  ) => addToast('warning', title, description, options),
  danger: (
    title: React.ReactNode,
    description?: React.ReactNode,
    options?: ToastOptions,
  ) => addToast('danger', title, description, options),
};

function useToasts() {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  React.useEffect(() => {
    toastListeners.push(setToasts);
    setToasts([...toastQueue]);

    return () => {
      const index = toastListeners.indexOf(setToasts);
      if (index !== -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, []);

  return { toasts, removeToast };
}

export function getToastIcon(variant?: ToastProps['variant']) {
  switch (variant) {
    case 'success':
      return <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-6 w-6 shrink-0 text-amber-500" />;
    case 'info':
      return <InfoIcon className="h-6 w-6 shrink-0 text-blue-500" />;
    case 'danger':
    case 'destructive':
      return <XCircle className="h-6 w-6 shrink-0 text-red-500" />;
    default:
      return null;
  }
}

function Toaster() {
  const { toasts, removeToast } = useToasts();

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          duration={toast.duration}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              removeToast(toast.id);
            }
          }}
        >
          {toast.icon ?? getToastIcon(toast.variant)}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description ? (
              <ToastDescription>
                {toast.description}
              </ToastDescription>
            ) : null}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  notifications,
  Toaster,
  type ToastOptions,
};
