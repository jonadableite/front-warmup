import { AnimatePresence, type Variants, motion } from "framer-motion";
import {
	Bell,
	Calendar,
	ChevronRight,
	Clock,
	CreditCard,
	Edit2,
	MessageSquare,
	Package,
	Save,
	Shield,
	User2,
	Users,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
// src/pages/AccountInfoPage.tsx
import axios from "../axiosConfig";
import { useDarkMode } from "../hooks/useDarkMode";

// Interfaces
interface User {
	id: number;
	name: string;
	email: string;
	plan: string;
	maxInstances: number;
	messagesPerDay: number;
	features: string[];
	support: string;
	stripeSubscriptionStatus?: string;
	stripeSubscriptionId?: string;
	nextBillingDate?: string;
	avatar?: string;
}

interface Subscription {
	status: string;
	plan: string;
	maxInstances: number;
	messagesPerDay: number;
	currentPeriodEnd?: string;
	cancelAtPeriodEnd?: boolean;
}

// Animações
const pageVariants: Variants = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -20 },
};

const cardVariants: Variants = {
	hover: { scale: 1.02, transition: { duration: 0.2 } },
	tap: { scale: 0.98 },
};

// Componentes
const ProfileField = ({
	label,
	value,
	editing,
	onChange,
	type = "text",
	error,
}: {
	label: string;
	value?: string;
	editing: boolean;
	onChange: (value: string) => void;
	type?: string;
	error?: string;
}) => (
	<motion.div
		variants={cardVariants}
		whileHover="hover"
		className="bg-whatsapp-cinza/30 p-4 rounded-xl border border-whatsapp-green/20 transition-all"
	>
		<label className="text-sm text-gray-400">{label}</label>
		<div className="mt-2">
			{editing ? (
				<div className="space-y-1">
					<input
						type={type}
						value={value || ""}
						onChange={(e) => onChange(e.target.value)}
						className="w-full bg-transparent border-b border-whatsapp-green/30 focus:border-whatsapp-green outline-none px-2 py-1 transition-all"
					/>
					{error && <p className="text-red-400 text-xs mt-1">{error}</p>}
				</div>
			) : (
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold text-white">
						{value || "Não informado"}
					</p>
				</div>
			)}
		</div>
	</motion.div>
);

// Componente Principal
const AccountInfoPage: React.FC = () => {
	const [isDarkMode, setIsDarkMode] = useDarkMode();
	const theme = isDarkMode ? "dark" : "light";
	const toggleTheme = () => setIsDarkMode(!isDarkMode);
	const [user, setUser] = useState<User | null>(null);
	const [subscription, setSubscription] = useState<Subscription | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeSection, setActiveSection] = useState("profile");
	const [editing, setEditing] = useState(false);
	const [editedUser, setEditedUser] = useState<Partial<User>>({});
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Efeitos
	useEffect(() => {
		const initializePage = async () => {
			await Promise.all([fetchUserData(), fetchSubscriptionData()]);
		};
		initializePage();
	}, []);

	// Funções de API
	const fetchUserData = async () => {
		try {
			const response = await axios.get("/api/users/plan-status");
			console.log("Resposta completa:", response.data);
			if (response.data.user) {
				setUser(response.data.user);
				console.log("Dados do usuário definidos:", response.data.user);
			} else {
				console.error("Resposta não contém dados do usuário");
			}
		} catch (error) {
			console.error("Erro ao carregar dados do usuário:", error);
			toast.error("Erro ao carregar dados do usuário");
		}
	};

	const fetchSubscriptionData = async () => {
		try {
			const response = await axios.get("/api/stripe/subscription/status");
			console.log("Dados da assinatura:", response.data);

			// Use os dados da subscription da resposta
			if (response.data && response.data.subscription) {
				setSubscription(response.data.subscription);
			} else {
				setSubscription({
					status: "no_subscription",
					plan: user?.plan || "free",
					maxInstances: user?.maxInstances || 0,
					messagesPerDay: user?.messagesPerDay || 0,
				});
			}
		} catch (error) {
			console.error("Erro ao carregar dados da assinatura:", error);
			// Fallback para dados do usuário em caso de erro
			setSubscription({
				status: "error",
				plan: user?.plan || "free",
				maxInstances: user?.maxInstances || 0,
				messagesPerDay: user?.messagesPerDay || 0,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateUser = async () => {
		try {
			const validationErrors = validateUserData(editedUser);
			if (Object.keys(validationErrors).length > 0) {
				setErrors(validationErrors);
				return;
			}

			const response = await axios.put(`/api/users/${user?.id}`, editedUser);
			setUser((prev) => ({ ...prev!, ...editedUser }));
			setEditing(false);
			setErrors({});
			toast.success("Dados atualizados com sucesso!");
		} catch (error) {
			toast.error("Erro ao atualizar dados");
			console.error(error);
		}
	};

	// Validação
	const validateUserData = (data: Partial<User>) => {
		const errors: Record<string, string> = {};
		if (data.name && data.name.length < 3) {
			errors.name = "Nome deve ter pelo menos 3 caracteres";
		}
		if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
			errors.email = "Email inválido";
		}
		return errors;
	};

	// Loading State
	if (loading) {
		return <LoadingState />;
	}

	return (
		<motion.div
			initial="initial"
			animate="animate"
			exit="exit"
			variants={pageVariants}
			className={`min-h-screen ${
				isDarkMode
					? "bg-gradient-to-br from-whatsapp-profundo to-black"
					: "bg-gray-50"
			} text-white p-8 transition-colors duration-300`}
		>
			{/* Conteúdo principal */}
			<div className="max-w-6xl mx-auto">
				<Header user={user} />
				<MainContent
					user={user}
					subscription={subscription}
					activeSection={activeSection}
					setActiveSection={setActiveSection}
					editing={editing}
					setEditing={setEditing}
					editedUser={editedUser}
					setEditedUser={setEditedUser}
					handleUpdateUser={handleUpdateUser}
					errors={errors}
				/>
			</div>
		</motion.div>
	);
};

// Componentes auxiliares
const LoadingState = () => (
	<div className="flex items-center justify-center h-screen">
		<motion.div
			animate={{ rotate: 360 }}
			transition={{
				duration: 1,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
			className="w-16 h-16 border-4 border-whatsapp-green border-t-transparent rounded-full"
		/>
	</div>
);

// Funções auxiliares
const formatDate = (dateString?: string) => {
	if (!dateString) return "Não disponível";
	try {
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return "Data inválida";
		return date.toLocaleDateString();
	} catch {
		return "Data inválida";
	}
};

const getStatusText = (status?: string) => {
	switch (status) {
		case "active":
			return "Ativo";
		case "canceled":
			return "Cancelado";
		case "past_due":
			return "Pagamento Pendente";
		case "unpaid":
			return "Não Pago";
		case "no_subscription":
			return "Sem Assinatura";
		default:
			return "Status Desconhecido";
	}
};

const Header = ({ user }: { user: User | null }) => (
	<div className="text-center mb-8">
		<motion.div
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			className="inline-block"
		>
			{user?.avatar ? (
				<img
					src={user.avatar}
					alt={user.name}
					className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-whatsapp-green"
				/>
			) : (
				<div className="w-24 h-24 rounded-full mx-auto mb-4 bg-whatsapp-green/20 flex items-center justify-center">
					<User2 size={40} className="text-whatsapp-green" />
				</div>
			)}
		</motion.div>
		<h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-whatsapp-green to-emerald-400">
			Informações da Conta
		</h1>
	</div>
);

interface MainContentProps {
	user: User | null;
	subscription: Subscription | null;
	activeSection: string;
	setActiveSection: (section: string) => void;
	editing: boolean;
	setEditing: (editing: boolean) => void;
	editedUser: Partial<User>;
	setEditedUser: (user: Partial<User>) => void;
	handleUpdateUser: () => Promise<void>;
	errors: Record<string, string>;
}

const MainContent: React.FC<MainContentProps> = ({
	user,
	subscription,
	activeSection,
	setActiveSection,
	editing,
	setEditing,
	editedUser,
	setEditedUser,
	handleUpdateUser,
	errors,
}) => {
	const sections = [
		{ id: "profile", title: "Perfil", icon: User2 },
		{ id: "subscription", title: "Assinatura", icon: CreditCard },
		{ id: "security", title: "Segurança", icon: Shield },
		{ id: "notifications", title: "Notificações", icon: Bell },
	];

	const renderContent = () => {
		switch (activeSection) {
			case "profile":
				return (
					<div className="space-y-6">
						<div className="flex justify-between items-center">
							<h2 className="text-2xl font-bold bg-gradient-to-r from-whatsapp-green to-emerald-400 bg-clip-text text-transparent">
								Informações Pessoais
							</h2>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setEditing(!editing)}
								className="px-4 py-2 rounded-lg bg-whatsapp-green/20 text-whatsapp-green hover:bg-whatsapp-green/30 transition-colors"
							>
								{editing ? (
									<div className="flex items-center">
										<X className="w-4 h-4 mr-2" />
										Cancelar
									</div>
								) : (
									<div className="flex items-center">
										<Edit2 className="w-4 h-4 mr-2" />
										Editar
									</div>
								)}
							</motion.button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<ProfileField
								label="Nome"
								value={user?.name}
								editing={editing}
								onChange={(value) =>
									setEditedUser({ ...editedUser, name: value })
								}
								error={errors.name}
							/>
							<ProfileField
								label="Email"
								value={user?.email}
								editing={editing}
								onChange={(value) =>
									setEditedUser({ ...editedUser, email: value })
								}
								error={errors.email}
							/>
						</div>

						{editing && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex justify-end"
							>
								<button
									onClick={handleUpdateUser}
									className="flex items-center px-6 py-2 bg-whatsapp-green text-white rounded-lg hover:bg-whatsapp-dark transition-colors"
								>
									<Save className="w-4 h-4 mr-2" />
									Salvar Alterações
								</button>
							</motion.div>
						)}
					</div>
				);

			case "subscription":
				return (
					<div className="space-y-6">
						<h2 className="text-2xl font-bold bg-gradient-to-r from-whatsapp-green to-emerald-400 bg-clip-text text-transparent">
							Detalhes da Assinatura
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="bg-whatsapp-green/10 p-6 rounded-xl border border-whatsapp-green/20">
								<div className="flex items-center mb-4">
									<Package className="w-6 h-6 text-whatsapp-green mr-3" />
									<h3 className="text-xl font-semibold">Plano Atual</h3>
								</div>
								<p className="text-2xl font-bold text-whatsapp-green capitalize">
									{user?.plan || "Free"}
								</p>
								<div className="mt-4 space-y-2">
									<SubscriptionFeature
										icon={Users}
										text={`${user?.maxInstances || 0} Instâncias`}
									/>
									<SubscriptionFeature
										icon={MessageSquare}
										text={`${user?.messagesPerDay || 0} mensagens/dia`}
									/>
									<SubscriptionFeature
										icon={CreditCard}
										text={
											subscription?.status === "active"
												? "Assinatura Ativa"
												: "Plano Gratuito"
										}
									/>
								</div>
							</div>

							<div className="bg-whatsapp-cinza/20 p-6 rounded-xl border border-whatsapp-green/20">
								<div className="flex items-center mb-4">
									<Clock className="w-6 h-6 text-whatsapp-green mr-3" />
									<h3 className="text-xl font-semibold">
										Status da Assinatura
									</h3>
								</div>
								<div className="space-y-4">
									{/* Status da Assinatura */}
									<SubscriptionStatus
										icon={CreditCard}
										label="Status"
										value={getStatusText(subscription?.status)}
										status={subscription?.status === "active"}
									/>

									{/* Próxima Cobrança */}
									{subscription?.status === "active" ? (
										<SubscriptionStatus
											icon={Calendar}
											label="Próxima Cobrança"
											value={formatDate(subscription?.currentPeriodEnd)}
											status={true}
										/>
									) : (
										<SubscriptionStatus
											icon={Calendar}
											label="Próxima Cobrança"
											value={
												subscription?.status === "no_subscription"
													? "Plano Gratuito"
													: "Não aplicável"
											}
											status={false}
										/>
									)}

									{/* Tipo de Plano */}
									<SubscriptionStatus
										icon={Package}
										label="Tipo de Plano"
										value={
											subscription?.status === "active" ? "Premium" : "Gratuito"
										}
										status={subscription?.status === "active"}
									/>
								</div>

								{/* Mensagem adicional para planos gratuitos */}
								{subscription?.status !== "active" && (
									<div className="mt-4 p-3 bg-whatsapp-green/10 rounded-lg border border-whatsapp-green/20">
										<p className="text-sm text-whatsapp-cinzaClaro">
											Faça upgrade para um plano premium e aproveite todos os
											recursos!
										</p>
									</div>
								)}
							</div>
						</div>

						<div className="flex justify-center mt-8">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => (window.location.href = "/pricing")}
								className="px-8 py-3 bg-gradient-to-r from-whatsapp-green to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
							>
								{subscription?.status === "active"
									? "Gerenciar Plano"
									: "Fazer Upgrade"}
							</motion.button>
						</div>
					</div>
				);

			default:
				return (
					<div className="text-center text-gray-500">
						<p>Em desenvolvimento...</p>
					</div>
				);
		}
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
			<motion.div
				className="bg-whatsapp-cinza/20 rounded-xl p-6 backdrop-blur-lg border border-whatsapp-green/20"
				initial={{ x: -50, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
			>
				<nav className="space-y-2">
					{sections.map((section) => (
						<motion.button
							key={section.id}
							onClick={() => setActiveSection(section.id)}
							className={`flex items-center w-full p-3 rounded-lg transition-colors ${
								activeSection === section.id
									? "bg-whatsapp-green text-white"
									: "text-gray-300 hover:bg-whatsapp-green/20"
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<section.icon className="mr-3" size={20} />
							<span>{section.title}</span>
							<ChevronRight className="ml-auto" size={16} />
						</motion.button>
					))}
				</nav>
			</motion.div>

			<motion.div
				className="md:col-span-3 bg-whatsapp-cinza/20 rounded-xl p-6 backdrop-blur-lg border border-whatsapp-green/20"
				initial={{ x: 50, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
			>
				<AnimatePresence mode="wait">
					<motion.div
						key={activeSection}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
					>
						{renderContent()}
					</motion.div>
				</AnimatePresence>
			</motion.div>
		</div>
	);
};

// Componentes auxiliares adicionais
const SubscriptionFeature = ({
	icon: Icon,
	text,
}: { icon: any; text: string }) => (
	<div className="flex items-center text-gray-300">
		<Icon className="w-4 h-4 mr-2 text-whatsapp-green" />
		<span>{text}</span>
	</div>
);

const SubscriptionStatus = ({
	icon: Icon,
	label,
	value,
	status,
}: {
	icon: any;
	label: string;
	value: string;
	status?: boolean;
}) => (
	<div className="flex items-center justify-between">
		<div className="flex items-center text-gray-300">
			<Icon className="w-4 h-4 mr-2 text-whatsapp-green" />
			<span>{label}</span>
		</div>
		<span className={status ? "text-green-400" : "text-gray-300"}>{value}</span>
	</div>
);

export default AccountInfoPage;
