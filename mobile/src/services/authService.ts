import api from "./API";

export interface BarberLoginDTO {
  email: string;
  password: string;
}

export interface ClientLoginDTO {
  phone: string;
  pin: string;
}

export interface ClientRegisterDTO {
  name: string;
  phone: string;
  pin: string;
}

export const authService = {
  /**
   * Login do Barbeiro (Acesso ao Painel Administrativo)
   * Rota: POST /login
   */
  loginBarber: async (data: BarberLoginDTO) => {
    const response = await api.post("/login", data);
    return response.data;
  },

  /**
   * Login do Cliente (Acesso ao Agendamento)
   * Rota: POST /mobile/login
   */
  loginClient: async (data: ClientLoginDTO) => {
    const response = await api.post("/mobile/login", data);
    return response.data;
  },

  /**
   * Cadastro de Novo Cliente
   * Rota: POST /mobile/register
   */
  registerClient: async (data: ClientRegisterDTO) => {
    const response = await api.post("/mobile/register", data);
    return response.data;
  },
};
