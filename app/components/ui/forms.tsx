import clsx from "clsx";
import { forwardRef } from "react";
import { Input, Label, TextArea, TextField, TextFieldProps } from "react-aria-components";

// This time round, I should stick to the react-aria api as much as possible
// and construct the ui from more atomic components.

interface FormInputProps extends TextFieldProps {
  className?: string;
  label?: string;
  placeholder?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, placeholder, ...props }, ref) => {
    return (
      <TextField ref={ref} {...props} className={clsx("flex flex-col gap-1", className)}>
        <Label className="text-sm text-mauve11">{label}</Label>
        <Input
          placeholder={placeholder}
          className="w-full rounded-md border border-mauve6 bg-mauve1 p-1 ring-offset-mauve2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan7 focus-visible:ring-offset-2 disabled:pointer-events-none"
        />
      </TextField>
    );
  },
);
FormInput.displayName = "FormInput";

interface CleanInputProps extends TextFieldProps {
  className?: string;
  placeholder?: string;
}

const CleanInput = forwardRef<HTMLInputElement, CleanInputProps>(
  ({ className, placeholder, ...props }, ref) => {
    return (
      <TextField ref={ref} {...props} className={clsx("flex flex-col gap-1", className)}>
        <Input
          placeholder={placeholder}
          className="w-full rounded-md p-1 ring-offset-mauve2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan7 focus-visible:ring-offset-2 disabled:pointer-events-none"
        />
      </TextField>
    );
  },
);
CleanInput.displayName = "CleanInput";

const CleanTextArea = forwardRef<HTMLInputElement, CleanInputProps>(
  ({ className, placeholder, ...props }, ref) => {
    return (
      <TextField ref={ref} {...props} className={clsx("flex flex-col gap-1", className)}>
        <TextArea
          placeholder={placeholder}
          className="w-full h-32 rounded-md p-1 ring-offset-mauve2 resize-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan7 focus-visible:ring-offset-2 disabled:pointer-events-none"
        />
      </TextField>
    );
  },
);
CleanTextArea.displayName = "CleanTextArea";

export { FormInput, CleanInput, CleanTextArea };
