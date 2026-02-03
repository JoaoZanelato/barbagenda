export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  start_time: string;
  status: AppointmentStatus;
  tenants: { name: string };
  services: { name: string; price: string };
  users: { name: string };
}
