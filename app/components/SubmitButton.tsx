import type { ButtonHTMLAttributes, FC } from "react";
import { useIsSubmitting } from "remix-validated-form";

export const SubmitButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => {
  const isSubmitting = useIsSubmitting();

  return (
    <button
      {...props}
      type="submit"
      disabled={isSubmitting}
      className="inline-block rounded border border-indigo-600 bg-indigo-600 w-32 h-10 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};
