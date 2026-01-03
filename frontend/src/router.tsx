import { QueryClient } from '@tanstack/react-query';
import { createRootRoute, Link, Outlet, createRoute, createRouter, useRouter, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import * as React from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Badge } from './components/ui';
import { fetcher } from './lib/api';
import { LayoutDashboard, LogIn, UserPlus, Home, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';

interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
}

export const rootRoute = createRootRoute({
    component: () => (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group transition-all duration-300">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">E</div>
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                                Ebre Modern
                            </span>
                        </Link>
                        <div className="hidden md:flex gap-1">
                            <Link to="/" className="px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors [&.active]:bg-indigo-50 [&.active]:text-indigo-600 [&.active]:font-semibold dark:[&.active]:bg-indigo-950/30">
                                <span className="flex items-center gap-2 text-sm"><Home size={16} /> Home</span>
                            </Link>
                            <Link to="/dashboard" className="px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors [&.active]:bg-indigo-50 [&.active]:text-indigo-600 [&.active]:font-semibold dark:[&.active]:bg-indigo-950/30">
                                <span className="flex items-center gap-2 text-sm"><LayoutDashboard size={16} /> Dashboard</span>
                            </Link>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/login" className="flex items-center gap-2"><LogIn size={16} /> Login</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link to="/register" className="flex items-center gap-2"><UserPlus size={16} /> Join Now</Link>
                        </Button>
                    </div>
                </div>
            </nav>
            <main className="container mx-auto px-4 py-12 flex-1">
                <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
                    <Outlet />
                </div>
            </main>
            <TanStackRouterDevtools />
        </div>
    ),
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 max-w-2xl mx-auto">
            <div className="space-y-4">
                <Badge variant="default" className="px-4 py-1.5 text-sm animate-pulse">Alpha Release 1.0</Badge>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter lg:leading-[1.1]">
                    The Secure Base For <span className="text-indigo-600 italic">Everything</span>.
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed">
                    Powered by NestJS, TanStack Start, and Bun. A modern approach to session-based RBAC authentication with MongoDB persistence.
                </p>
            </div>
            <div className="flex gap-4">
                <Button size="lg" asChild>
                    <Link to="/register">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link to="/login">Sign In</Link>
                </Button>
            </div>
            <div className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="font-bold text-xl">NestJS</div>
                <div className="font-bold text-xl">TanStack</div>
                <div className="font-bold text-xl">Bun.sh</div>
            </div>
        </div>
    ),
});

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: function LoginPage() {
        const navigate = useNavigate();
        const [email, setEmail] = React.useState('');
        const [password, setPassword] = React.useState('');
        const [error, setError] = React.useState('');
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setError('');
            try {
                await fetcher('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
                navigate({ to: '/dashboard' });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="flex justify-center flex-col items-center gap-8 py-10 max-w-md mx-auto">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                    <p className="text-slate-500">Enter your credentials to access your account</p>
                </div>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl">Sign In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Work Email</label>
                                <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Password</label>
                                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-red-600 dark:text-red-400 text-sm">{error}</div>}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Signing in..." : "Continue with Email"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <p className="text-sm text-slate-500">
                    Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Sign up</Link>
                </p>
            </div>
        );
    },
});

const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: function RegisterPage() {
        const navigate = useNavigate();
        const [email, setEmail] = React.useState('');
        const [password, setPassword] = React.useState('');
        const [error, setError] = React.useState('');
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setError('');
            try {
                await fetcher('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
                navigate({ to: '/dashboard' });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="flex justify-center flex-col items-center gap-8 py-10 max-w-md mx-auto">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
                    <p className="text-slate-500 text-sm">Join our platform and start managing your workspace</p>
                </div>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl">Join the Platform</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Work Email</label>
                                <Input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Password</label>
                                <Input type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg text-red-600 dark:text-red-400 text-sm">{error}</div>}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating account..." : "Create Free Account"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <p className="text-sm text-slate-500">
                    Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
                </p>
            </div>
        );
    },
});

const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    loader: async () => {
        try {
            return await fetcher('/users/me');
        } catch {
            return null;
        }
    },
    component: function DashboardPage() {
        const user = dashboardRoute.useLoaderData() as User | null;
        const navigate = useNavigate();
        const [users, setUsers] = React.useState<User[]>([]);
        const [loadingUsers, setLoadingUsers] = React.useState(false);

        React.useEffect(() => {
            if (user?.role === 'admin') {
                loadUsers();
            }
        }, [user]);

        const loadUsers = async () => {
            setLoadingUsers(true);
            try {
                const data = await fetcher('/admin/users');
                setUsers(data);
            } catch (err) {
                console.error('Failed to load users', err);
            } finally {
                setLoadingUsers(false);
            }
        };

        const handleUpdateRole = async (targetUserId: string, newRole: string) => {
            try {
                await fetcher(`/admin/users/${targetUserId}/role`, {
                    method: 'PATCH',
                    body: JSON.stringify({ role: newRole }),
                });
                loadUsers();
            } catch (err) {
                alert('Failed to update role');
            }
        };

        if (!user) {
            return (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400">
                        <ShieldCheck size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Access Unauthorized</h2>
                        <p className="text-slate-500">Please sign in to your account to access the dashboard</p>
                    </div>
                    <Button asChild>
                        <Link to="/login">Sign In to Continue</Link>
                    </Button>
                </div>
            );
        }

        const handleLogout = async () => {
            await fetcher('/auth/logout', { method: 'POST' });
            navigate({ to: '/login' });
        };

        return (
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tight">Workspace Dashboard</h1>
                        <p className="text-slate-500 flex items-center gap-2">
                            Welcome back, {user.email} <Badge className="capitalize">{user.role}</Badge>
                        </p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
                        <LogOut size={16} /> Sign Out
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-400">Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600">
                                    <UserIcon size={24} />
                                </div>
                                <div>
                                    <p className="font-bold">{user.email.split('@')[0]}</p>
                                    <p className="text-xs text-slate-500 uppercase font-black">{user.role} member</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div className="text-center">
                                    <p className="text-2xl font-bold">12</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Projects</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold">48</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Reports</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-400">Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                            <p className="text-sm font-medium">Updated project settings</p>
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">{i}h ago</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {user.role === 'admin' && (
                    <div className="space-y-4 pt-8">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={28} className="text-indigo-600" />
                            <h2 className="text-2xl font-bold">Admin Management</h2>
                        </div>
                        <Card>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 dark:bg-slate-900 border-b">
                                            <tr>
                                                <th className="p-4 text-left font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest text-[10px]">User Account</th>
                                                <th className="p-4 text-left font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest text-[10px]">Current Role</th>
                                                <th className="p-4 text-right font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest text-[10px]">Admin Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {loadingUsers ? (
                                                <tr>
                                                    <td colSpan={3} className="p-20 text-center animate-pulse text-slate-400 font-medium">Synchronizing user directory...</td>
                                                </tr>
                                            ) : users.map((u) => (
                                                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs uppercase">
                                                                {u.email[0]}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-slate-900 dark:text-slate-100">{u.email}</span>
                                                                <span className="text-[10px] text-slate-400">ID: {u.id}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge variant={u.role === 'admin' ? 'success' : 'outline'} className="capitalize">
                                                            {u.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        {u.id !== user.id ? (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleUpdateRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                                                            >
                                                                Change to {u.role === 'admin' ? 'Member' : 'Administrator'}
                                                            </Button>
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-400 italic px-2">Primary Admin</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        );
    },
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, registerRoute, dashboardRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
