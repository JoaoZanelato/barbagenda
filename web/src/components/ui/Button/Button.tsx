import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import styles from "./Button.module.css"; // <--- Importando o CSS Módulo
import { cn } from "../../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        // Usamos styles.button (base) + styles[variant] (dinâmico)
        className={cn(styles.button, styles[variant], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className={styles.spinner} />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
export { Button };
