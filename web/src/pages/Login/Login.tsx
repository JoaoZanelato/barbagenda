import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Scissors } from 'lucide-react';
import { api } from '../../lib/api';

import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card/Card';

import styles from './Login.module.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/login', { email, password });
      navigate('/dashboard');
    } catch (error) {
      alert('Erro ao entrar.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.cardWidth}>
        <CardHeader className={styles.headerContent}>
          <div className={styles.logoWrapper}>
            <Scissors className={styles.logoIcon} />
          </div>
          <div>
            <h1 className={styles.title}>Barber SaaS</h1>
            <p className={styles.subtitle}>Gestão profissional</p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className={styles.form}>
            <Input 
              label="E-mail" 
              type="email" 
              placeholder="admin@barber.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail />}
              required
            />
            
            <Input 
              label="Senha" 
              type="password" 
              placeholder="••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={<Lock />}
              required
            />

            <Button type="submit" isLoading={isLoading}>
              Acessar Painel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}