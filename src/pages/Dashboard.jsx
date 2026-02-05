import React from 'react';
import AutomationCard from '../components/AutomationCard';

import {
    LayoutDashboard,
    BarChart3,
    Users,
    Settings,
    Bell,
    Search,
    Bot,
    Zap,
    Clock,
    CheckCircle2,
    TrendingUp,

    BookOpen,
    CreditCard,
    Database,
    X
} from 'lucide-react';

const Dashboard = () => {
    const [activeTab, setActiveTab] = React.useState('Overview');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalConfig, setModalConfig] = React.useState({ type: '', title: '', url: '' });
    const [submitStatus, setSubmitStatus] = React.useState('idle'); // idle, submitting, success, error
    const [notifications, setNotifications] = React.useState([]);
    const [dbSignups, setDbSignups] = React.useState([]);
    const [loadingDb, setLoadingDb] = React.useState(false);

    const addNotification = (title, type = 'success') => {
        const newNotification = {
            id: Date.now(),
            title,
            time: 'Just now',
            type
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const [payments, setPayments] = React.useState([]);
    const [loadingPayments, setLoadingPayments] = React.useState(true);

    React.useEffect(() => {
        const fetchPayments = async () => {
            setLoadingPayments(true);
            const today = new Date();
            const currentYear = today.getFullYear();
            const futureMonths = [];

            // Generate future payments for the rest of the year (assuming Monthly 1st)
            // Start from the next month relative to "now" or specifically March if requested
            // User requested "start from first of march" and "rest of the year"

            // Let's generate Mar - Dec 2026 fixed as per request context
            for (let i = 2; i < 12; i++) { // Month 2 is March (0-indexed)
                const date = new Date(2026, i, 1);
                futureMonths.push({
                    id: `future_${i}`,
                    date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                    description: 'Monthly Retainer',
                    amount: '350.00',
                    currency: 'GBP',
                    status: 'upcoming',
                    pdfUrl: null
                });
            }

            try {
                const res = await fetch('/api/payments', {
                    headers: { 'x-portal-auth': 'pass' }
                });
                if (!res.ok) throw new Error('API Unavailable');
                const data = await res.json();

                // Merge Real Invoices with Projected Future ones
                // In a real app, we'd dedup based on dates, but here we just append logic
                setPayments([...data.invoices, ...futureMonths]);
            } catch (error) {
                console.warn('Stripe API unavailable (expected in local dev), using mock data.');
                // Mock Data Fallback - Use the generated future list
                setPayments(futureMonths);
            } finally {
                setLoadingPayments(false);
            }
        };

        const fetchSignups = async () => {
            setLoadingDb(true);
            try {
                const res = await fetch('/api/signups');
                if (res.ok) {
                    const data = await res.json();
                    setDbSignups(data);
                }
            } catch (err) {
                console.error("Failed to load signups", err);
            } finally {
                setLoadingDb(false);
            }
        }

        fetchPayments();
        if (activeTab === 'Database') {
            fetchSignups();
        }
    }, [activeTab]);

    const handleOpenModal = (type, title) => {
        const url = type === 'islamic'
            ? 'https://script.google.com/macros/s/AKfycbwFGlfedmnjYKA4n9QIRkGmTE-a_53itfg1lv6MRbZnrOeE3yhQpLnu5dBfcrxOPMR8/exec'
            : 'https://script.google.com/macros/s/AKfycbzlCEN01Het3AANcCAJnIza8klI25YALcfVZrYo8cXvqzcuHbjlimtmG9jCb2EF0CAl/exec'; // Assuming first URL was for volunteers, second explicitly for Islamic. Use explicit one for Islamic.
        // Wait, user gave two URLs. 
        // 1st: ...EF0CAl/exec (User said "here is the web app url" first, then "here is the web app url for the islamic activites class sign up" second).
        // So 2nd URL (...xOPMR8/exec) is DEFINITELY Islamic Activities.
        // 1st URL (...EF0CAl/exec) is likely Volunteers.

        setModalConfig({ type, title, url: type === 'islamic' ? 'https://script.google.com/macros/s/AKfycbwFGlfedmnjYKA4n9QIRkGmTE-a_53itfg1lv6MRbZnrOeE3yhQpLnu5dBfcrxOPMR8/exec' : 'https://script.google.com/macros/s/AKfycbzlCEN01Het3AANcCAJnIza8klI25YALcfVZrYo8cXvqzcuHbjlimtmG9jCb2EF0CAl/exec' });
        setIsModalOpen(true);
        setSubmitStatus('idle');
    };

    return (
        <div className="min-h-screen bg-azen-bg text-azen-text font-sans selection:bg-azen-primary/30">

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-20 lg:w-64 bg-azen-card border-r border-azen-border z-50 flex flex-col hidden md:flex">
                <div className="p-6 flex items-center justify-center">
                    <span className="font-display font-bold text-4xl tracking-tighter text-white">azen</span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <NavItem
                        icon={<LayoutDashboard />}
                        label="Overview"
                        active={activeTab === 'Overview'}
                        onClick={() => setActiveTab('Overview')}
                    />
                    <NavItem
                        icon={<Zap />}
                        label="Automations"
                        active={activeTab === 'Automations'}
                        onClick={() => setActiveTab('Automations')}
                    />

                    <NavItem
                        icon={<Users />}
                        label="Sign Ups"
                        active={activeTab === 'Sign Ups'}
                        onClick={() => setActiveTab('Sign Ups')}
                    />
                    <NavItem
                        icon={<Database />}
                        label="Database"
                        active={activeTab === 'Database'}
                        onClick={() => setActiveTab('Database')}
                    />
                    <NavItem
                        icon={<Settings />}
                        label="Settings"
                        active={activeTab === 'Settings'}
                        onClick={() => setActiveTab('Settings')}
                    />
                </nav>

                <div className="p-4 border-t border-azen-border">
                    <div className="p-4 rounded-xl bg-azen-bg border border-azen-border flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                        <div className="hidden lg:block">
                            <div className="text-sm font-medium text-white">Mohsan Rabbani</div>
                            <div className="text-xs text-azen-muted">mnr0141@hotmail.com</div>
                        </div>
                    </div>
                </div>
            </aside>



            {/* Main Content */}
            <main className="md:ml-20 lg:ml-64 min-h-screen p-4 lg:p-8 relative">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white">Zia-Ul-Quran Portal</h1>
                        <p className="text-azen-muted text-sm mt-1">Welcome back, here's what's happening today.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-azen-muted" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-azen-card border border-azen-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-azen-primary text-white w-64"
                            />
                        </div>
                        <button className="p-2 rounded-lg bg-azen-card border border-azen-border text-azen-muted hover:text-white transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-azen-primary rounded-full"></span>
                        </button>
                    </div>
                </header>



                {/* Main Dashboard Widgets - Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {activeTab === 'Overview' && (
                        <>
                            {/* Left Column: Active Services & Payments */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Active Services */}
                                <div className="bg-azen-card border border-azen-border rounded-2xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-semibold text-white">Active Services</h3>
                                        <button className="text-sm text-azen-primary hover:text-azen-secondary transition-colors">
                                            View All
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <ServiceCard
                                            title="Website Development"
                                            status="Active"
                                            icon={<LayoutDashboard className="w-5 h-5 text-azen-primary" />}
                                        />
                                        <ServiceCard
                                            title="CRM Development"
                                            status="Active"
                                            icon={<TrendingUp className="w-5 h-5 text-azen-secondary" />}
                                        />
                                        <ServiceCard
                                            title="Ongoing Service Maintenance"
                                            status="Active"
                                            icon={<Zap className="w-5 h-5 text-yellow-400" />}
                                        />
                                        <ServiceCard
                                            title="Automation Development"
                                            status="Active"
                                            icon={<Bot className="w-5 h-5 text-purple-400" />}
                                        />
                                    </div>
                                </div>

                                {/* Payment Schedule */}
                                <div className="bg-azen-card border border-azen-border rounded-2xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-semibold text-white">Payment Schedule</h3>
                                        <button className="text-sm text-azen-primary hover:text-azen-secondary transition-colors">
                                            View History
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-xs text-azen-muted border-b border-azen-border/50">
                                                    <th className="py-3 px-4 font-medium">Date</th>
                                                    <th className="py-3 px-4 font-medium">Description</th>
                                                    <th className="py-3 px-4 font-medium">Amount</th>
                                                    <th className="py-3 px-4 font-medium">Status</th>
                                                    <th className="py-3 px-4 font-medium text-right">Invoice</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {loadingPayments ? (
                                                    <tr>
                                                        <td colSpan="5" className="py-6 text-center text-azen-muted">
                                                            Loading payment history...
                                                        </td>
                                                    </tr>
                                                ) : payments.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="py-6 text-center text-azen-muted">
                                                            No payment history found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    payments.map((invoice) => (
                                                        <tr key={invoice.id} className="border-b border-azen-border/30 hover:bg-azen-bg/30 transition-colors">
                                                            <td className="py-4 px-4 text-white">{invoice.date}</td>
                                                            <td className="py-4 px-4 text-azen-muted">{invoice.description}</td>
                                                            <td className="py-4 px-4 text-white">£{invoice.amount}</td>
                                                            <td className="py-4 px-4">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${invoice.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                                    invoice.status === 'open' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                                        'bg-azen-bg text-azen-muted border-azen-border'
                                                                    }`}>
                                                                    {invoice.status === 'open' ? 'Due Now' :
                                                                        invoice.status === 'paid' ? 'Paid' :
                                                                            invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4 text-right">
                                                                {invoice.status !== 'upcoming' && invoice.pdfUrl ? (
                                                                    invoice.status === 'open' ? (
                                                                        <a href={invoice.hostedUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-azen-primary hover:text-white transition-colors text-xs">
                                                                            Pay Now
                                                                        </a>
                                                                    ) : (
                                                                        <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-azen-primary hover:text-white transition-colors text-xs">
                                                                            Download
                                                                        </a>
                                                                    )
                                                                ) : (
                                                                    <span className="text-azen-muted text-xs">-</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>



                            {/* Side Widgets (Right Column) */}
                            <div className="space-y-6">
                                {/* Notifications Box */}
                                <div className="bg-azen-card border border-azen-border rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-semibold text-white">Notifications</h3>
                                        <button className="p-1 hover:bg-azen-bg rounded-lg transition-colors">
                                            <Bell className="w-4 h-4 text-azen-muted hover:text-white" />
                                        </button>
                                    </div>
                                    <div className="space-y-1 -mx-2">
                                        {notifications.map((notif) => (
                                            <NotificationItem key={notif.id} title={notif.title} time={notif.time} type={notif.type} />
                                        ))}
                                    </div>
                                    <button className="w-full mt-6 py-2 text-sm text-azen-muted hover:text-white border border-azen-border rounded-lg hover:bg-azen-border/30 transition-all">
                                        Mark all as read
                                    </button>
                                </div>

                                {/* Project Timeline (Moved Here) */}
                                <div className="bg-azen-card border border-azen-border rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-semibold text-white mb-6">Project Timeline</h3>
                                    <div className="space-y-8 relative pl-4 border-l border-azen-border/50 ml-2">
                                        {[
                                            { title: "Project Kickoff", date: "Jan 12, 2026", status: "completed", desc: "Initial requirements gathering." },
                                            { title: "Design Phase", date: "Jan 28, 2026", status: "completed", desc: "UI/UX wireframes approved." },
                                            { title: "Building Website", date: "Feb 05, 2026", status: "completed", desc: "Frontend development and styling." },
                                            { title: "Building CRM", date: "Feb 20, 2026", status: "current", desc: "Backend integration and database setup." },
                                            { title: "Testing Phase", date: "Mar 05, 2026", status: "upcoming", desc: "Rigorous testing and audits." },
                                            { title: "Deployment", date: "Mar 15, 2026", status: "upcoming", desc: "Final launch and handover." },
                                        ].map((item, i) => (
                                            <div key={i} className="relative pl-6 group">
                                                <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 transition-all duration-300 ${item.status === 'completed' ? 'bg-azen-secondary border-azen-secondary shadow-[0_0_10px_rgba(52,211,153,0.5)]' : item.status === 'current' ? 'bg-azen-primary border-azen-primary animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.6)]' : 'bg-azen-bg border-azen-border'}`}></div>
                                                <div className="flex flex-col mb-1">
                                                    <h4 className={`text-base font-medium transition-colors ${item.status === 'upcoming' ? 'text-azen-muted' : 'text-white'}`}>{item.title}</h4>
                                                    <span className="text-xs font-mono text-azen-primary/80">{item.date}</span>
                                                </div>
                                                <p className="text-xs text-azen-muted group-hover:text-gray-400 transition-colors">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>


                        </>
                    )}

                    {activeTab === 'Sign Ups' && (
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Islamic Activities Class Sign Ups */}
                            <div className="bg-azen-card border border-azen-border rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-azen-bg rounded-lg border border-azen-border">
                                        <BookOpen className="w-5 h-5 text-azen-primary" />
                                    </div>
                                    <h3 className="font-semibold text-white text-lg">Islamic Activities Class</h3>
                                </div>
                                <div className="text-center py-8 text-azen-muted text-sm border border-dashed border-azen-border rounded-xl bg-azen-bg/30">
                                    No active classes available for registration at the moment.
                                </div>
                            </div>

                            {/* Volunteers Sign Up */}
                            <div className="bg-azen-card border border-azen-border rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-azen-bg rounded-lg border border-azen-border">
                                        <Users className="w-5 h-5 text-azen-secondary" />
                                    </div>
                                    <h3 className="font-semibold text-white text-lg">Volunteer Opportunities</h3>
                                </div>
                                <div className="text-center py-8 text-azen-muted text-sm border border-dashed border-azen-border rounded-xl bg-azen-bg/30">
                                    No volunteer opportunities available at the moment.
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Automations' && (
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <AutomationCard
                                title="Class Registration Flow"
                                trigger="New Sign Up (Islamic Class)"
                                action="Send Email Notification"
                                active={true}
                            />
                            <AutomationCard
                                title="Volunteer Onboarding"
                                trigger="New Volunteer App"
                                action="Send Admin Alert"
                                active={true}
                            />
                        </div>
                    )}

                    {activeTab === 'Database' && (
                        <div className="lg:col-span-3 bg-azen-card border border-azen-border rounded-2xl p-6 shadow-sm overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                                    <Database className="w-5 h-5 text-azen-primary" />
                                    Signup Database
                                </h3>
                                <button className="text-xs bg-azen-primary/10 text-azen-primary px-3 py-1.5 rounded-lg border border-azen-primary/20 hover:bg-azen-primary/20 transition-colors">
                                    Export CSV
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-azen-border/50 text-azen-muted text-xs uppercase tracking-wider">
                                            <th className="p-4 font-medium">Date</th>
                                            <th className="p-4 font-medium">Name</th>
                                            <th className="p-4 font-medium">Type</th>
                                            <th className="p-4 font-medium">Details</th>
                                            <th className="p-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-azen-border/30 text-sm">
                                        {loadingDb ? (
                                            <tr><td colSpan="5" className="p-8 text-center text-azen-muted">Loading data...</td></tr>
                                        ) : dbSignups.length === 0 ? (
                                            <tr><td colSpan="5" className="p-8 text-center text-azen-muted">No signups recorded yet.</td></tr>
                                        ) : (
                                            dbSignups.map((signup) => (
                                                <tr key={signup.id} className="hover:bg-azen-bg/30 transition-colors">
                                                    <td className="p-4 text-gray-300 font-mono text-xs">{new Date(signup.date).toLocaleDateString()}</td>
                                                    <td className="p-4 text-white font-medium">
                                                        {signup.studentName || signup.Name || "Unknown"}
                                                        <div className="text-xs text-azen-muted">{signup.email || signup.Phone}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs border ${signup.activityName ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                                            {signup.activityName ? 'Class' : 'Volunteer'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-400 text-xs max-w-xs truncate">
                                                        {signup.activityName || signup.Interest}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="px-2 py-1 rounded-full text-xs bg-gray-500/10 text-gray-400 border border-gray-500/20">Pending</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>

                {/* Registration Modal */}
                {
                    isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <RegistrationModal
                                config={modalConfig}
                                onClose={() => setIsModalOpen(false)}
                                status={submitStatus}
                                setStatus={setSubmitStatus}
                                addNotification={addNotification}
                            />
                        </div>
                    )
                }

            </main >
        </div >
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-azen-primary/10 text-azen-primary border border-azen-primary/10' : 'text-azen-muted hover:text-white hover:bg-azen-bg'}`}
    >
        {React.cloneElement(icon, { size: 20 })}
        <span className="font-medium hidden lg:block">{label}</span>
    </button>
);

const StatCard = ({ title, value, change, icon }) => (
    <div className="bg-azen-card border border-azen-border p-5 rounded-2xl hover:border-azen-border/80 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-azen-bg rounded-lg border border-azen-border">
                {icon}
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{change}</span>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-azen-muted">{title}</div>
    </div>
);

const StatusItem = ({ label, status, color = "text-emerald-400" }) => (
    <div className="flex justify-between items-center p-3 bg-azen-bg/50 rounded-lg border border-azen-border/50">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'Operational' ? 'bg-emerald-400' : 'bg-yellow-400'} animate-pulse`}></div>
            <span className="text-sm text-gray-300">{label}</span>
        </div>
        <span className={`text-xs font-medium ${color}`}>{status}</span>
    </div>
);

const ArrowRightIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
)

const ServiceCard = ({ title, status, nextBilling, icon, alert }) => (
    <div className="bg-azen-bg/50 border border-azen-border rounded-xl p-4 hover:border-azen-primary/30 transition-all group">
        <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-azen-card rounded-lg border border-azen-border group-hover:border-azen-primary/20 transition-colors">
                {icon}
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${alert ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                {status}
            </span>
        </div>
        <h4 className="font-medium text-white mb-1">{title}</h4>
        <p className="text-xs text-azen-muted">{nextBilling}</p>
    </div>
);

const NotificationItem = ({ title, time, type }) => (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-azen-bg/50 transition-colors cursor-pointer border-b border-azen-border/50 last:border-0 items-start">
        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${type === 'alert' ? 'bg-red-400' : type === 'success' ? 'bg-azen-secondary' : 'bg-azen-primary'}`} />
        <div>
            <p className="text-sm text-white font-medium leading-tight mb-1">{title}</p>
            <p className="text-xs text-azen-muted">{time}</p>
        </div>
    </div>
)

const SignUpCard = ({ title, schedule, instructor, spots, isVolunteer, onRegister }) => (
    <div className="bg-azen-bg/30 border border-azen-border rounded-xl p-4 hover:border-azen-primary/30 transition-all flex justify-between items-center group">
        <div>
            <h4 className="font-medium text-white mb-1 group-hover:text-azen-primary transition-colors">{title}</h4>
            <div className="flex items-center gap-3 text-xs text-azen-muted">
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {schedule}
                </span>
                <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {instructor}
                </span>
            </div>
        </div>
        <div className="text-right">
            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${isVolunteer ? 'bg-azen-secondary/10 text-azen-secondary border-azen-secondary/20' : 'bg-azen-primary/10 text-azen-primary border-azen-primary/20'}`}>
                {spots}
            </span>
            <button
                onClick={onRegister}
                className={`block mt-2 text-xs font-medium ${isVolunteer ? 'text-azen-secondary hover:text-white' : 'text-azen-primary hover:text-white'} transition-colors`}
            >
                Register →
            </button>
        </div>
    </div>
);

const RegistrationModal = ({ config, onClose, status, setStatus, addNotification }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        const formData = new FormData(e.target);

        try {
            // Save to Local Database (Parallel to external scripts)
            // Preparing payload for local DB
            let localPayload = {};
            if (config.type === 'volunteer') {
                localPayload = {
                    date: new Date().toISOString(),
                    Name: formData.get('Name'),
                    Phone: formData.get('Phone'),
                    Interest: config.title,
                    Availability: formData.get('Availability'),
                    Skills: formData.get('Skills'),
                    type: 'volunteer'
                };
            } else {
                localPayload = Object.fromEntries(formData.entries());
                localPayload.activityName = config.title;
                localPayload.type = 'class';
            }

            // Fire and forget local save
            fetch('/api/signups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(localPayload)
            }).then(res => console.log('Saved to local DB', res.status)).catch(err => console.error('DB Save Error', err));


            if (config.type === 'volunteer') {
                // Keep existing external script logic if needed, or just rely on local db for now
                // Volunteer Script expects form parameters (e.parameter)
                const params = new URLSearchParams();
                params.append('Name', formData.get('Name'));
                params.append('Phone', formData.get('Phone'));
                params.append('Interest', config.title);
                params.append('Availability', formData.get('Availability'));
                params.append('Skills', formData.get('Skills'));

                await fetch(config.url, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString()
                });
            } else {
                // Islamic Activities Script expects JSON body
                const data = Object.fromEntries(formData.entries());
                data.activityName = config.title;

                await fetch(config.url, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
            }

            // Assume success with no-cors
            setStatus('success');
            addNotification(`Successfully registered for ${config.title}`, 'success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
            }, 2000);
        } catch (error) {
            console.error('Submission Error:', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-azen-card border border-azen-border rounded-2xl p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Registration Successful!</h3>
                <p className="text-azen-muted text-sm">You have successfully signed up for {config.title}.</p>
            </div>
        );
    }

    return (
        <div className="bg-azen-card border border-azen-border rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-azen-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Register Now</h3>
            <p className="text-azen-muted text-sm mb-6">Sign up for <span className="text-azen-primary">{config.title}</span></p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                    {config.type === 'islamic' ? (
                        <>
                            <input name="studentName" required placeholder="Full Name" className="w-full bg-azen-bg border border-azen-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-azen-primary" />
                            <input name="ageGroup" required placeholder="Age Group" className="w-full bg-azen-bg border border-azen-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-azen-primary" />
                            <input name="parentName" placeholder="Parent Name (if under 18)" className="w-full bg-azen-bg border border-azen-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-azen-primary" />
                            <input name="contactNumber" required placeholder="Contact Number" className="w-full bg-azen-bg border border-azen-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-azen-primary" />
                            <input type="email" name="email" required placeholder="Email Address" className="w-full bg-azen-bg border border-azen-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-azen-primary" />
                            <textarea name="medicalInfo" placeholder="Medical Info / Notes (Optional)" rows="2" className="w-full bg-azen-bg border border-azen-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-azen-primary resize-none"></textarea>
                        </>
                    ) : (
                        <>
                            <input name="Name" required placeholder="Full Name" className="w-full bg-azen-bg border border-azen-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-azen-primary" />
                            <input name="Phone" required placeholder="Phone Number" className="w-full bg-azen-bg border border-azen-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-azen-primary" />
                            <input name="Availability" required placeholder="Availability (e.g., Weekends, Mon-Fri)" className="w-full bg-azen-bg border border-azen-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-azen-primary" />
                            <textarea name="Skills" placeholder="Skills / Experience (Optional)" rows="3" className="w-full bg-azen-bg border border-azen-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-azen-primary resize-none"></textarea>
                        </>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-azen-primary hover:bg-azen-primary/90 text-azen-bg font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                    {status === 'submitting' ? (
                        <>
                            <div className="w-4 h-4 border-2 border-azen-bg/30 border-t-azen-bg rounded-full animate-spin"></div>
                            Submitting...
                        </>
                    ) : (
                        'Confirm Registration'
                    )}
                </button>
            </form>
        </div>
    );
};

export default Dashboard;
