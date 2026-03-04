'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/shared';
import { Trash2, UserCog, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'CUSTOMER';
    isActive: boolean;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, action: 'toggleStatus', value: !currentStatus }),
            });
            if (res.ok) fetchUsers();
        } catch (error) {
            console.error('Failed to update status');
        }
    };

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
        if (!confirm(`Are you sure you want to change role to ${newRole}?`)) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, action: 'toggleRole', value: newRole }),
            });
            if (res.ok) {
                toast.success('Role updated successfully');
                fetchUsers();
            }
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    const deleteUser = async (userId: string, userName: string) => {
        if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('User deleted successfully');
                fetchUsers();
            } else {
                toast.error(data.message || 'Failed to delete user');
            }
        } catch (error) {
            toast.error('An error occurred during deletion');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">User Management</h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">Orders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500   tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500   tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                                </tr>
                            ) : (
                                users.map((user: any) => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-700">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-700">{user.orderCount || 0}</div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-1 text-[10px] text-blue-600 hover:text-blue-700 underline"
                                                onClick={() => window.location.href = `/admin/orders?userId=${user._id}`}
                                            >
                                                View all
                                            </Button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => toggleRole(user._id, user.role)}
                                            >
                                                Change Role
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={user.isActive ? "destructive" : "default"}
                                                onClick={() => toggleStatus(user._id, user.isActive)}
                                            >
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 h-9 w-9 p-0"
                                                onClick={() => deleteUser(user._id, user.name)}
                                                title="Delete User"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
