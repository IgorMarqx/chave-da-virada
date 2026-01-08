import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Check,
    CheckCircle2,
    Facebook,
    FileText,
    FolderPlus,
    FolderTree,
    Instagram,
    Mail,
    Phone,
    Play,
    Quote,
    RefreshCw,
    Star,
    Timer,
    Upload,
    UserPlus,
    Youtube,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const features = [
    {
        icon: FolderTree,
        title: 'Gestão de Disciplinas',
        description:
            'Cadastre todas as suas disciplinas e organize-as por concurso. Tenha controle total do que precisa estudar.',
    },
    {
        icon: BookOpen,
        title: 'Tópicos Detalhados',
        description:
            'Adicione tópicos dentro de cada disciplina. Organize o conteúdo de forma hierárquica e visual.',
    },
    {
        icon: Timer,
        title: 'Cronômetro de Estudo',
        description:
            'Controle seu tempo de estudo com cronômetro integrado. Registre quanto tempo dedica a cada matéria.',
    },
    {
        icon: FileText,
        title: 'Anotações Rich Text',
        description:
            'Editor completo com formatação avançada. Crie anotações organizadas com títulos, listas, destaques e muito mais.',
    },
    {
        icon: Upload,
        title: 'Upload de Anexos',
        description:
            'Faça upload de PDFs, imagens e outros arquivos. Mantenha todo seu material de estudo centralizado.',
    },
    {
        icon: RefreshCw,
        title: 'Painel de Revisões',
        description:
            'Gerencie suas revisões de forma inteligente. Não deixe passar nenhum conteúdo importante.',
    },
];

const steps = [
    {
        icon: UserPlus,
        step: '01',
        title: 'Crie sua conta',
        description:
            'Cadastre-se gratuitamente e acesse a plataforma em menos de 1 minuto.',
    },
    {
        icon: FolderPlus,
        step: '02',
        title: 'Cadastre suas disciplinas',
        description:
            'Adicione as matérias do seu concurso e os tópicos de cada uma delas.',
    },
    {
        icon: Timer,
        step: '03',
        title: 'Estude com controle',
        description:
            'Use o cronômetro, faça anotações e anexe seus materiais de estudo.',
    },
    {
        icon: CheckCircle2,
        step: '04',
        title: 'Revise e conquiste',
        description:
            'Gerencie suas revisões no painel e mantenha o conteúdo sempre fresco na memória.',
    },
];

const plans = [
    {
        name: 'Básico',
        price: '49',
        description: 'Para quem está começando',
        features: [
            'Acesso ao banco de questões',
            'Plano de estudos básico',
            'Relatórios de desempenho',
            'Suporte por e-mail',
        ],
        popular: false,
    },
    {
        name: 'Pro',
        price: '89',
        description: 'Mais popular entre aprovados',
        features: [
            'Tudo do plano Básico',
            'Simulados ilimitados',
            'Revisão espaçada avançada',
            'Comunidade exclusiva',
            'Suporte prioritário',
            'Cronograma personalizado',
        ],
        popular: true,
    },
    {
        name: 'Premium',
        price: '149',
        description: 'Para quem quer o máximo',
        features: [
            'Tudo do plano Pro',
            'Mentoria individual',
            'Análise de redação',
            'Acesso vitalício',
            'Bônus exclusivos',
            'Garantia de aprovação',
        ],
        popular: false,
    },
];

const testimonials = [
    {
        name: 'Maria Silva',
        role: 'Aprovada - Analista do TRF',
        image: '/professional-woman-smiling.png',
        content:
            'O sistema de organização de disciplinas e tópicos foi fundamental. Consegui ter uma visão clara do que precisava estudar e não perdi tempo.',
        rating: 5,
    },
    {
        name: 'João Santos',
        role: 'Aprovado - Auditor Fiscal',
        image: '/professional-man-smiling.png',
        content:
            'O cronômetro de estudo me ajudou a entender onde eu estava gastando mais tempo. As anotações em rich text são incríveis para revisar depois.',
        rating: 5,
    },
    {
        name: 'Ana Oliveira',
        role: 'Aprovada - Técnico do INSS',
        image: '/professional-woman-portrait.png',
        content:
            'O painel de revisões mudou minha forma de estudar. Não esquecia mais o que tinha visto e o upload de anexos deixou tudo centralizado.',
        rating: 5,
    },
];

type WelcomeProps = {
    canRegister?: boolean;
};

export default function Welcome({ canRegister = true }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Chave da Virada" />
            <div className="min-h-screen bg-white text-gray-900">
                <Header isAuthenticated={Boolean(auth.user)} canRegister={canRegister} />
                <main>
                    <Hero />
                    <Features />
                    <HowItWorks />
                    <Testimonials />
                    <Pricing />
                    <CTA />
                </main>
                <Footer />
            </div>
        </>
    );
}

type HeaderProps = {
    isAuthenticated: boolean;
    canRegister: boolean;
};

function Header({ isAuthenticated, canRegister }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-red-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <a href="/" className="flex items-center gap-2">
                    <img
                        src="/images/chave-virada-sem-fundo-4.png"
                        alt="Chave da Virada"
                        width={180}
                        height={50}
                        className="h-10 w-auto"
                    />
                </a>
                <nav className="hidden items-center gap-6 md:flex">
                    <a
                        href="#recursos"
                        className="text-sm font-medium text-gray-600 transition-colors hover:text-red-500"
                    >
                        Recursos
                    </a>
                    <a
                        href="#como-funciona"
                        className="text-sm font-medium text-gray-600 transition-colors hover:text-red-500"
                    >
                        Como Funciona
                    </a>
                    <a
                        href="#depoimentos"
                        className="text-sm font-medium text-gray-600 transition-colors hover:text-red-500"
                    >
                        Depoimentos
                    </a>
                    <a
                        href="#planos"
                        className="text-sm font-medium text-gray-600 transition-colors hover:text-red-500"
                    >
                        Planos
                    </a>
                </nav>
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <Button asChild variant="ghost" className="text-gray-600 hover:text-red-500">
                            <Link href={dashboard()}>Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button asChild variant="ghost" className="text-gray-600 hover:text-red-500">
                                <Link href={login()}>Entrar</Link>
                            </Button>
                            {canRegister && (
                                <Button asChild className="bg-red-500 text-white hover:bg-red-600">
                                    <Link href={register()}>Começar Agora</Link>
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-red-500 via-red-500 to-red-600 py-20 lg:py-32">
            <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-5" />
            <div className="container relative mx-auto px-4">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div className="text-center lg:text-left">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                            <span className="flex h-2 w-2 rounded-full bg-green-400" />
                            Sistema de Autogerenciamento
                        </div>
                        <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                            A chave que destrava sua{' '}
                            <span className="underline decoration-yellow-300 decoration-4 underline-offset-4">
                                aprovação
                            </span>
                        </h1>
                        <p className="mb-8 text-pretty text-lg text-red-100 md:text-xl">
                            Sistema completo de autogerenciamento para seus estudos. Organize disciplinas, controle seu
                            tempo, faça anotações avançadas e gerencie suas revisões em um só lugar.
                        </p>
                        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                            <Button size="lg" className="w-full bg-white text-red-500 hover:bg-red-50 sm:w-auto">
                                Começar Grátis por 7 Dias
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                            >
                                <Play className="mr-2 h-4 w-4" />
                                Ver Demonstração
                            </Button>
                        </div>
                        <div className="flex flex-col items-center gap-4 text-sm text-red-100 sm:flex-row lg:justify-start">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                Sem cartão de crédito
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                Cancele quando quiser
                            </div>
                        </div>
                    </div>
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-3xl bg-white/10 blur-2xl" />
                            <img
                                src="/assets/img/chave_virada_fundo_vermelho.png"
                                alt="Chave da Virada"
                                width={500}
                                height={400}
                                className="relative rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Features() {
    return (
        <section id="recursos" className="bg-gray-50 py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <span className="mb-4 inline-block rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-500">
                        Recursos
                    </span>
                    <h2 className="mb-4 text-balance text-3xl font-bold text-gray-900 md:text-4xl">
                        Tudo que você precisa para se organizar
                    </h2>
                    <p className="text-pretty text-lg text-gray-600">
                        Ferramentas completas de autogerenciamento para você assumir o controle dos seus estudos.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Card
                            key={feature.title}
                            className="border-0 bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                                    <feature.icon className="h-6 w-6 text-red-500" />
                                </div>
                                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base text-gray-600">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    return (
        <section id="como-funciona" className="bg-white py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <span className="mb-4 inline-block rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-500">
                        Como Funciona
                    </span>
                    <h2 className="mb-4 text-balance text-3xl font-bold text-gray-900 md:text-4xl">
                        Simples de usar, poderoso nos resultados
                    </h2>
                    <p className="text-pretty text-lg text-gray-600">
                        Um fluxo intuitivo para você organizar seus estudos e alcançar a aprovação.
                    </p>
                </div>
                <div className="relative">
                    <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-red-200 lg:block" />
                    <div className="grid gap-8 lg:grid-cols-4">
                        {steps.map((step) => (
                            <div key={step.step} className="relative text-center">
                                <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/30">
                                    <step.icon className="h-8 w-8 text-white" />
                                </div>
                                <span className="mb-2 block text-sm font-bold text-red-500">{step.step}</span>
                                <h3 className="mb-2 text-xl font-bold text-gray-900">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Testimonials() {
    return (
        <section id="depoimentos" className="bg-gray-50 py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <span className="mb-4 inline-block rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-500">
                        Depoimentos
                    </span>
                    <h2 className="mb-4 text-balance text-3xl font-bold text-gray-900 md:text-4xl">
                        Histórias de sucesso
                    </h2>
                    <p className="text-pretty text-lg text-gray-600">
                        Veja o que nossos alunos aprovados têm a dizer sobre a Chave da Virada.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.name} className="border-0 bg-white shadow-lg">
                            <CardContent className="p-6">
                                <Quote className="mb-4 h-8 w-8 text-red-200" />
                                <p className="mb-6 text-gray-600">{testimonial.content}</p>
                                <div className="mb-4 flex gap-1">
                                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                                        <Star key={`${testimonial.name}-${index}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.image || '/placeholder.svg'}
                                        alt={testimonial.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-red-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Pricing() {
    return (
        <section id="planos" className="bg-white py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <span className="mb-4 inline-block rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-500">
                        Planos
                    </span>
                    <h2 className="mb-4 text-balance text-3xl font-bold text-gray-900 md:text-4xl">
                        Invista no seu futuro
                    </h2>
                    <p className="text-pretty text-lg text-gray-600">
                        Escolha o plano ideal para sua preparação. Todos incluem 7 dias grátis.
                    </p>
                </div>
                <div className="grid gap-8 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`relative border-2 ${plan.popular ? 'border-red-500 shadow-xl shadow-red-500/10' : 'border-gray-200'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-4 py-1 text-sm font-semibold text-white">
                                    Mais Popular
                                </div>
                            )}
                            <CardHeader className="text-center">
                                <CardTitle className="text-xl text-gray-900">{plan.name}</CardTitle>
                                <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-gray-900">R${plan.price}</span>
                                    <span className="text-gray-500">/mês</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="mb-6 space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-gray-600">
                                            <Check className="h-5 w-5 shrink-0 text-green-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className={`w-full ${plan.popular
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    Começar Agora
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTA() {
    return (
        <section className="bg-red-500 py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <img
                        src="/assets/img/chave_virada_icon-2.png"
                        alt="Chave da Virada"
                        width={120}
                        height={60}
                        className="mx-auto mb-8 brightness-0 invert"
                    />
                    <h2 className="mb-6 text-balance text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                        Pronto para destravar sua aprovação?
                    </h2>
                    <p className="mb-8 text-pretty text-lg text-red-100">
                        Junte-se a mais de 10.000 concurseiros que já transformaram seus estudos com a Chave da Virada.
                        Comece hoje e dê o primeiro passo rumo à sua aprovação.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" className="w-full bg-white text-red-500 hover:bg-red-50 sm:w-auto">
                            Começar Grátis por 7 Dias
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                        >
                            Falar com Especialista
                        </Button>
                    </div>
                    <p className="mt-6 text-sm text-red-200">
                        Sem compromisso • Cancele quando quiser • Suporte 24/7
                    </p>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="bg-gray-900 py-16">
            <div className="container mx-auto px-4">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <img
                            src="/images/chave-virada-sem-fundo-4.png"
                            alt="Chave da Virada"
                            width={150}
                            height={40}
                            className="mb-4 brightness-0 invert"
                        />
                        <p className="mb-6 text-gray-400">
                            A chave que destrava sua aprovação. Sistema completo de estudos para concursos públicos.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                                <Youtube className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-4 font-semibold text-white">Plataforma</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                                    Recursos
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                                    Planos e Preços
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                                    Banco de Questões
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                                    Simulados
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 font-semibold text-white">Suporte</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                                    Central de Ajuda
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                                    Termos de Uso
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                                    Política de Privacidade
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 transition-colors hover:text-red-500">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 font-semibold text-white">Contato</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail className="h-4 w-4 text-red-500" />
                                contato@chavedavirada.com.br
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone className="h-4 w-4 text-red-500" />
                                (11) 99999-9999
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    <p>© 2025 Chave da Virada. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
