import { QueryClient } from '@tanstack/react-query';
import { createRootRoute, Link, Outlet, createRoute, createRouter, useRouter, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import * as React from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from './components/ui';
import { fetcher } from './lib/api';

interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
}

export const rootRoute = createRootRoute({
    component: () => (
        <div className="min-h-screen bg-background">
            <nav className="p-4 border-b flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex gap-4">
                    <Link to="/" className="hover:underline [&.active]:font-bold">Home</Link>
                    <Link to="/dashboard" className="hover:underline [&.active]:font-bold">Dashboard</Link>
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="hover:underline [&.active]:font-bold">Login</Link>
                    <Link to="/register" className="hover:underline [&.active]:font-bold">Register</Link>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto p-4">
                <Outlet />
            </main>
            <TanStackRouterDevtools />
        </div>
    ),
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => (
        <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Modern Auth Demo</h1>
            <p className="text-xl text-muted-foreground">NestJS + TanStack Start + Bun</p>
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

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                await fetcher('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
                navigate({ to: '/dashboard' });
            } catch (err: any) {
                setError(err.message);
            }
        };

        return (
            <div className="flex justify-center py-10">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            {error && <p className="text-destructive text-sm">{error}</p>}
                            <Button type="submit" className="w-full">Sign In</Button>
                        </form>
                    </CardContent>
                </Card>
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

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                await fetcher('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
                navigate({ to: '/dashboard' });
            } catch (err: any) {
                setError(err.message);
            }
        };

        return (
            <div className="flex justify-center py-10">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle>Create Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            {error && <p className="text-destructive text-sm">{error}</p>}
                            <Button type="submit" className="w-full">Register</Button>
                        </form>
                    </CardContent>
                </Card>
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
            return <div className="p-10 text-center">Unauthorized. Please <Link to="/login" className="underline">Login</Link></div>;
        }

        const handleLogout = async () => {
            await fetcher('/auth/logout', { method: 'POST' });
            navigate({ to: '/login' });
        };

        return (
            <div className="py-10 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
                        <Button variant="outline" onClick={handleLogout}>Logout</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Logged in as</p>
                                <p className="text-lg font-semibold">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Role</p>
                                <p className="text-lg font-semibold capitalize">{user.role}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {user.role === 'admin' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Panel - User Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingUsers ? (
                                <p>Loading users...</p>
                            ) : (
                                <div className="border rounded-md overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="p-2 text-left">Email</th>
                                                <th className="p-2 text-left">Role</th>
                                                <th className="p-2 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {users.map((u) => (
                                                <tr key={u.id}>
                                                    <td className="p-2">{u.email}</td>
                                                    <td className="p-2 capitalize">{u.role}</td>
                                                    <td className="p-2 text-right space-x-2">
                                                        {u.id !== user.id && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleUpdateRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                                                            >
                                                                Make {u.role === 'admin' ? 'User' : 'Admin'}
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
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
