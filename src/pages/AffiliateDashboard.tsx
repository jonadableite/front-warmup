// src/pages/AffiliateDashboard.tsx
import { format, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Calendar, DollarSign, User } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { BarChart, LineChart } from "../components/charts/index";
import { Skeleton } from "../components/ui/Skeleton";
import { Table, Tbody, Td, Th, Thead, Tr } from "../components/ui/table.jsx";
import { useToast } from "../components/ui/use-toast";
import type { AffiliateDashboardData, ReferredUser } from "../interface/index";
import { getToken } from "../utils/auth";

// Constants
const API_URL =
  import.meta.env.VITE_API_URL || "https://aquecerapi.whatlead.com.br";

// Animation variants
const animations = {
  container: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
};

// Components
const StatCard = ({ icon: Icon, title, value }: any) => (
  <motion.div
    variants={animations.item}
    className="bg-whatsapp-cinza p-6 rounded-xl border border-whatsapp-green shadow-lg hover:shadow-whatsapp-green transition-all duration-300"
  >
    <div className="flex items-center mb-4">
      <div className="p-2 bg-whatsapp-green/10 rounded-lg">
        <Icon className="text-whatsapp-green w-6 h-6" />
      </div>
      <span className="text-2xl font-bold text-white ml-3">{value}</span>
    </div>
    <h3 className="text-lg text-white">{title}</h3>
  </motion.div>
);

// Função auxiliar para formatar valores monetários
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function AffiliateDashboard() {
  const [data, setData] = useState<AffiliateDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("Token não encontrado");

        const response = await axios.get<AffiliateDashboardData>(
          `${API_URL}/api/affiliates/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do painel de afiliados:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do painel de afiliados",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinza to-neon-purple/10 p-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 bg-cinza/80 mb-4" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinza to-neon-purple/10 p-8 text-white">
        Erro ao carregar dados
      </div>
    );
  }

  const referralsByMonth = data.referredUsers.reduce(
    (acc, user) => {
      const month = format(new Date(user.createdAt), "MMMM", { locale: ptBR });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = Object.entries(referralsByMonth).map(([month, count]) => ({
    month,
    count,
  }));

  // Preparar dados para o gráfico de faturamento
  const revenueData = data.referredUsers.reduce(
    (acc, user) => {
      const payment = user.payments[0];
      if (payment) {
        const date = format(new Date(payment.dueDate), "yyyy-MM-dd");
        const amount = payment.amount / 2; // Assumindo que o afiliado ganha 50%
        if (!acc[date]) {
          acc[date] = { completed: 0, pending: 0, overdue: 0 };
        }
        if (payment.status === "completed") {
          acc[date].completed += amount;
        } else if (payment.status === "pending") {
          acc[date].pending += amount;
        } else if (payment.status === "overdue") {
          acc[date].overdue += amount;
        }
      }
      return acc;
    },
    {} as Record<
      string,
      { completed: number; pending: number; overdue: number }
    >,
  );

  const revenueChartData = Object.entries(revenueData).map(
    ([date, amounts]) => ({
      date,
      ...amounts,
    }),
  );

  // Ordenar usuários referidos por status de pagamento e data de vencimento
  const sortedReferredUsers = [...data.referredUsers].sort((a, b) => {
    const paymentA = a.payments[0];
    const paymentB = b.payments[0];
    if (!paymentA && !paymentB) return 0;
    if (!paymentA) return 1;
    if (!paymentB) return -1;

    const dateA = new Date(paymentA.dueDate);
    const dateB = new Date(paymentB.dueDate);
    const now = new Date();

    if (paymentA.status === "overdue" && paymentB.status !== "overdue")
      return -1;
    if (paymentB.status === "overdue" && paymentA.status !== "overdue")
      return 1;

    if (isBefore(dateA, now) && isAfter(dateB, now)) return -1;
    if (isBefore(dateB, now) && isAfter(dateA, now)) return 1;

    return dateA.getTime() - dateB.getTime();
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animations.container}
      className="min-h-screen bg-gradient-to-br from-whatsapp-profundo via-whatsapp-profundo to-whatsapp-profundo p-8"
    >
      <h1 className="text-3xl font-bold text-white mb-8">Painel de Parceiro</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={User}
          title="Total de Referidos"
          value={data.totalReferrals}
        />
        <StatCard
          icon={DollarSign}
          title="Ganhos Totais"
          value={formatCurrency(data.totalEarnings)}
        />
        <StatCard
          icon={Calendar}
          title="Pagamentos Pendentes"
          value={formatCurrency(data.pendingPayments)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          variants={animations.item}
          className="bg-whatsapp-cinza p-6 rounded-xl border border-whatsapp-green"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Referidos por Mês
          </h2>
          <BarChart data={chartData} xKey="month" yKey="count" fill="#7c3aed" />
        </motion.div>

        <motion.div
          variants={animations.item}
          className="bg-whatsapp-cinza p-6 rounded-xl border border-whatsapp-green"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Faturamento por Dia
          </h2>
          <LineChart
            data={revenueChartData}
            xKey="date"
            yKeys={["completed", "pending", "overdue"]}
            colors={["#19eb4e", "#fbbf24", "#ef4444"]}
          />
        </motion.div>
      </div>

      <motion.div
        variants={animations.item}
        className="bg-whatsapp-cinza rounded-2xl border border-whatsapp-green/40 overflow-hidden shadow-2xl"
      >
        <Table>
          <Thead>
            <Tr className="bg-whatsapp-green/20">
              <Th className="text-whatsapp-green font-bold">Nome</Th>
              <Th className="text-whatsapp-green font-bold">Email</Th>
              <Th className="text-whatsapp-green font-bold">Plano</Th>
              <Th className="text-whatsapp-green font-bold">
                Data de Cadastro
              </Th>
              <Th className="text-whatsapp-green font-bold">
                Próximo Pagamento
              </Th>
              <Th className="text-whatsapp-green font-bold">Valor</Th>
              <Th className="text-whatsapp-green font-bold">Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedReferredUsers.map((user) => (
              <Tr key={user.id} className="hover:bg-whatsapp-green/10">
                <Td className="font-medium">{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.plan}</Td>
                <Td>
                  {format(new Date(user.createdAt), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </Td>
                <Td>
                  {user.payments[0]
                    ? format(new Date(user.payments[0].dueDate), "dd/MM/yyyy", {
                        locale: ptBR,
                      })
                    : "N/A"}
                </Td>
                <Td>
                  {user.payments[0]
                    ? formatCurrency(user.payments[0].amount / 2)
                    : "N/A"}
                </Td>
                <Td>
                  <PaymentStatus payment={user.payments[0]} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </motion.div>
    </motion.div>
  );
}

const PaymentStatus = ({
  payment,
}: { payment: ReferredUser["payments"][0] }) => {
  if (!payment) return <span className="text-gray-500">Sem pagamento</span>;

  const now = new Date();
  const dueDate = new Date(payment.dueDate);
  const isOverdue = isBefore(dueDate, now) && payment.status !== "completed";

  let statusClass = "";
  let statusText = "";

  if (isOverdue) {
    statusClass = "bg-red-200 text-red-800";
    statusText = "Vencido";
  } else if (payment.status === "completed") {
    statusClass = "bg-green-200 text-green-800";
    statusText = "Pago";
  } else {
    statusClass = "bg-yellow-200 text-yellow-800";
    statusText = "Pendente";
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}
    >
      {statusText}
    </span>
  );
};
