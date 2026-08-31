import { toast } from "sonner";

export interface SwiftAlertOptions {
  title: string;
  description?: string;
  duration?: number;
}

/**
 * Swift Alert Utility powered by Swiss typography styling
 */
export const swiftAlert = {
  success: ({ title, description, duration = 4000 }: SwiftAlertOptions) => {
    toast.success(title, {
      description,
      duration,
      className: "font-sans tracking-tight rounded-xl border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 dark:bg-blue-950 text-[#01265D] dark:text-blue-300",
    });
  },

  error: ({ title, description, duration = 4000 }: SwiftAlertOptions) => {
    toast.error(title, {
      description,
      duration,
      className: "font-sans tracking-tight rounded-xl border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950 text-rose-950 dark:text-rose-50",
    });
  },

  info: ({ title, description, duration = 4000 }: SwiftAlertOptions) => {
    toast.info(title, {
      description,
      duration,
      className: "font-sans tracking-tight rounded-xl border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950 text-sky-950 dark:text-sky-50",
    });
  },

  warning: ({ title, description, duration = 4000 }: SwiftAlertOptions) => {
    toast.warning(title, {
      description,
      duration,
      className: "font-sans tracking-tight rounded-xl border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 text-amber-950 dark:text-amber-50",
    });
  },
};
