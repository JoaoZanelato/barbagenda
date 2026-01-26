import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import styles from "./Input.module.css";
import { cn } from "../../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, ...props }, ref) => {
    return (
      <div className={styles.container}>
        {label && <label className={styles.label}>{label}</label>}

        <div className={styles.wrapper}>
          {icon && <div className={styles.icon}>{icon}</div>}

          <input
            ref={ref}
            className={cn(styles.input, icon && styles.hasIcon, className)}
            {...props}
          />
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";
export { Input };
