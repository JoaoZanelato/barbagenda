import { LogOut, Scissors } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button/Button";

export function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    // Aqui poderíamos chamar uma rota de logout no back,
    // mas por enquanto só limpamos a navegação (cookies somem sozinhos ou tratamos depois)
    navigate("/");
  }

  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="flex h-16 items-center justify-between px-6 max-w-5xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-orange-600 flex items-center justify-center">
            <Scissors className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-zinc-100">Barber SaaS</span>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400 hidden sm:inline">
            Painel Admin
          </span>
          <Button
            variant="ghost"
            size="sm" // Se quiser implementar tamanhos depois no Button.tsx
            className="w-auto h-8 px-3 text-zinc-400 hover:text-red-400 hover:bg-zinc-900"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
