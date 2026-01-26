import { ReactNode } from "react";
import { X } from "lucide-react";
import styles from "./Modal.module.css";
import { cn } from "../../../lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Fundo Escuro */}
      <div className={styles.overlay} onClick={onClose} />

      {/* Conteúdo da Janela */}
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Onde vai o formulário */}
        <div className="mt-4">{children}</div>
      </div>
    </>
  );
}
