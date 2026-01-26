import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { Plus, DollarSign, CalendarDays } from 'lucide-react';

import { Header } from '../../components/layout/Header';
import { Card, CardContent, CardHeader } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';

import styles from './Dashboard.module.css';

interface Metrics {
  todayCount: number;
  todayIncome: number;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

export function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ todayCount: 0, todayIncome: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/services').then(res => setServices(res.data)).catch(() => navigate('/'));
    api.get('/dashboard/metrics').then(res => setMetrics(res.data));
  }, [navigate]);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        
        {/* Topo */}
        <div className={styles.sectionHeader}>
          <div>
            <h1 className={styles.pageTitle}>Visão Geral</h1>
            <p className={styles.pageSubtitle}>Resumo do dia e gestão.</p>
          </div>
          <div className="w-auto">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Serviço
            </Button>
          </div>
        </div>

        {/* Cards Métricas */}
        <div className={styles.gridCards}>
            <Card className={styles.metricCard}>
                <CardHeader className={styles.metricHeader}>
                    <h3 className={styles.metricTitle}>Agendamentos Hoje</h3>
                    <CalendarDays className="h-4 w-4 text-gold-500" />
                </CardHeader>
                <CardContent>
                    <div className={styles.metricValue}>{metrics.todayCount}</div>
                    <p className={styles.metricFooter}>Clientes agendados para hoje</p>
                </CardContent>
            </Card>

            <Card className={styles.metricCard}>
                <CardHeader className={styles.metricHeader}>
                    <h3 className={styles.metricTitle}>Faturamento Diário</h3>
                    <DollarSign className="h-4 w-4 text-gold-500" />
                </CardHeader>
                <CardContent>
                    <div className={styles.metricValueGold}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.todayIncome)}
                    </div>
                    <p className={styles.metricFooter}>Baseado nos agendamentos confirmados</p>
                </CardContent>
            </Card>
        </div>

        {/* Tabela de Serviços */}
        <Card className={styles.tableContainer}>
          <CardHeader className="border-b border-zinc-800 pb-4">
            <h2 className="text-lg font-semibold text-white">Meus Serviços</h2>
          </CardHeader>
          <CardContent className="p-0">
            {services.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                Nenhum serviço cadastrado.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">Duração</th>
                    <th className="px-6 py-4 text-right">Preço</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {services.map((service) => (
                    <tr key={service.id} className={styles.tableRow}>
                      <td className={`${styles.tableCell} ${styles.cellName}`}>{service.name}</td>
                      <td className={`${styles.tableCell} ${styles.cellDuration}`}>{service.duration_minutes} min</td>
                      <td className={`${styles.tableCell} ${styles.cellPrice}`}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}