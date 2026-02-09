import React, { useState, useEffect, useCallback } from 'react';
import logo from '@/assets/logo.jpeg';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Tags,
    MessageSquare,
    ShoppingBag,
    Star,
    LogOut,
    Users,
    Search,
    Bell,
    Activity,
    X,
    CheckCircle2,
    Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (profile) {
                    setUserName(profile.full_name || profile.username || profile.first_name || user.email?.split('@')[0] || 'Admin');
                } else {
                    setUserName(user.email?.split('@')[0] || 'Admin');
                }
            }
        };
        fetchUser();
    }, []);

    const handleLogout = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error('Logout failed');
        } else {
            toast.success('Logged out successfully');
            navigate('/admin/login');
        }
    }, [navigate]);

    // Auto-logout on inactivity
    useEffect(() => {
        const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes
        let timeoutId: NodeJS.Timeout;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                toast.info('Session expired due to inactivity');
                handleLogout();
            }, INACTIVITY_LIMIT);
        };

        // Events to listen for
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetTimer));

        resetTimer(); // Start timer

        return () => {
            clearTimeout(timeoutId);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [handleLogout]);

    // Fetch Recent Activity Logs
    const { data: logs = [], refetch } = useQuery({
        queryKey: ['activity_logs_notifications'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('activity_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) console.error('Error fetching logs:', error);
            return data || [];
        },
    });

    // Realtime Subscription for Notifications
    useEffect(() => {
        const channel = supabase
            .channel('admin-notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'activity_logs'
                },
                (payload) => {
                    const newLog = payload.new as any;
                    toast.info(newLog.action || 'New Activity Logged', {
                        description: newLog.details,
                        action: {
                            label: 'View',
                            onClick: () => navigate('/admin/activity')
                        }
                    });
                    setHasUnread(true);
                    refetch(); // Update the bell list immediately
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [refetch, navigate]);

    // Check for unread notifications
    useEffect(() => {
        const lastRead = localStorage.getItem('admin_last_read_timestamp');
        if (logs.length > 0) {
            if (!lastRead || new Date(logs[0].created_at) > new Date(lastRead)) {
                setHasUnread(true);
            } else {
                setHasUnread(false);
            }
        }
    }, [logs]);

    const handleOpenNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        if (!isNotificationsOpen) {
            // Mark as read when opening
            setHasUnread(false);
            localStorage.setItem('admin_last_read_timestamp', new Date().toISOString());
        }
    };

    const menuItems = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { title: 'Products', icon: Package, path: '/admin/products' },
        { title: 'Categories', icon: Tags, path: '/admin/categories' },
        { title: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
        { title: 'Messages', icon: MessageSquare, path: '/admin/messages' },
        { title: 'Feedback', icon: Star, path: '/admin/feedback' },
        { title: 'Activity', icon: Activity, path: '/admin/activity' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Aura Melts" className="w-8 h-8 rounded-full object-cover" />
                    <h1 className="text-xl font-bold tracking-tight">Aura Melts</h1>
                </div>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                            isActive
                                ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                : "text-white/50 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-purple-400" : "group-hover:text-purple-300")} />
                                <span className="font-medium">{item.title}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1 h-6 bg-purple-500 rounded-r-full"
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white flex overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl flex-col z-20 sticky top-0 h-screen">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(circle_at_top_right,_rgba(120,50,150,0.05),_transparent_40%)]">
                {/* Top Header */}
                <header className="h-20 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Mobile Menu Trigger */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-white/70 hover:text-white hover:bg-white/10">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] p-0 bg-[#0A0A0B] border-r border-white/10 text-white">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>

                        <div className="flex items-center gap-4 max-w-xl w-full">
                            <div className="relative w-full group hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search everything..."
                                    className="w-full bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm backdrop-blur-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {userName && (
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-white/70">
                                    {userName}
                                </p>
                            </div>
                        )}                        <div className="h-8 w-[1px] bg-white/10" />

                        {/* Notifications Bell */}
                        <div className="relative">
                            <button
                                onClick={handleOpenNotifications}
                                className={cn(
                                    "relative p-2 transition-colors rounded-full hover:bg-white/5",
                                    isNotificationsOpen ? "text-white" : "text-white/50 hover:text-white"
                                )}
                            >
                                <Bell className="w-5 h-5" />
                                {hasUnread && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#0A0A0B] animate-pulse" />
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotificationsOpen && (
                                    <>
                                        {/* Backdrop to close */}
                                        <div
                                            className="fixed inset-0 z-40 bg-transparent"
                                            onClick={() => setIsNotificationsOpen(false)}
                                        />

                                        {/* Dropdown */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0A0A0B] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                                                <h3 className="font-semibold text-sm">Notifications</h3>
                                                <button
                                                    onClick={() => setIsNotificationsOpen(false)}
                                                    className="text-white/40 hover:text-white transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="max-h-[400px] overflow-y-auto py-2">
                                                {logs.length === 0 ? (
                                                    <div className="py-8 text-center text-white/30 text-sm">
                                                        No recent activity
                                                    </div>
                                                ) : (
                                                    logs.map((log: any) => (
                                                        <div key={log.id} className="px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors">
                                                            <div className="flex items-start gap-3">
                                                                <div className={cn(
                                                                    "mt-1 w-2 h-2 rounded-full flex-shrink-0",
                                                                    log.action_type === 'create' ? "bg-green-500" :
                                                                        log.action_type === 'update' ? "bg-blue-500" :
                                                                            log.action_type === 'delete' ? "bg-red-500" : "bg-purple-500"
                                                                )} />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-white/90 truncate">
                                                                        {log.action}
                                                                    </p>
                                                                    <p className="text-xs text-white/50 mt-0.5 truncate">
                                                                        {log.details || 'No details provided'}
                                                                    </p>
                                                                    <p className="text-[10px] text-white/30 mt-1.5 flex items-center gap-1">
                                                                        <Activity className="w-3 h-3" />
                                                                        {new Date(log.created_at).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>

                                            <div className="p-3 bg-white/5 border-t border-white/5 text-center">
                                                <NavLink
                                                    to="/admin/activity"
                                                    onClick={() => setIsNotificationsOpen(false)}
                                                    className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors block"
                                                >
                                                    View All Activity
                                                </NavLink>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
