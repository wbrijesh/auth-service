import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import type { Application, APIResponse } from '../../types/auth';

export function ApplicationDetails() {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [application, setApplication] = useState<Application | null>(null);
    const [error, setError] = useState('');
    const [copyPublicState, setCopyPublicState] = useState('Copy');
    const [copySecretState, setCopySecretState] = useState('Copy');

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await fetch(`${API_URL}/api/applications/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data: APIResponse<Application> = await res.json();

                if (!data.success || !data.data) {
                    throw new Error(data.error || 'Failed to fetch application');
                }

                setApplication(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load application');
            }
        };

        fetchApplication();
    }, [id, token]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this application?')) return;

        try {
            const res = await fetch(`${API_URL}/api/applications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data: APIResponse<null> = await res.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to delete application');
            }

            navigate('/app/applications');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete application');
        }
    };

    const handleCopyPublicKey = () => {
        navigator.clipboard.writeText(application!.publicKey);
        setCopyPublicState('Copied');
        setTimeout(() => setCopyPublicState('Copy'), 1000);
    };

    const handleCopySecretKey = () => {
        navigator.clipboard.writeText(application!.secretKey || '');
        setCopySecretState('Copied');
        setTimeout(() => setCopySecretState('Copy'), 1000);
    };

    if (!application) {
        return (
            <div className="bg-neutral-800 p-6 rounded-lg">
                {error ? (
                    <p className="text-red-400">{error}</p>
                ) : (
                    <p className="text-gray-400">Loading...</p>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{application.name}</h1>
                <div className="flex space-x-3">
                    <Link
                        to={`/app/applications/${id}/users`}
                        className="bg-neutral-700 text-white px-4 py-2 rounded-md hover:bg-neutral-600"
                    >
                        View Users
                    </Link>
                    <Link
                        to={`/app/applications/${id}/edit`}
                        className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="bg-neutral-800 p-6 rounded-lg space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">Domain</h2>
                    <p className="text-gray-400">{application.domain}</p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">API Keys</h2>
                    <div className="mt-2 space-y-4">
                        <div className="p-4 bg-neutral-900 rounded-md">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-mono text-gray-400">Public Key: {application.publicKey}</p>
                                <button
                                    onClick={handleCopyPublicKey}
                                    className="text-sky-500 hover:text-sky-400 text-sm"
                                >
                                    {copyPublicState}
                                </button>
                            </div>
                        </div>
                        {application.secretKey && (
                            <div className="p-4 bg-neutral-900 rounded-md">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-mono text-gray-400">Secret Key: {application.secretKey}</p>
                                    <button
                                        onClick={handleCopySecretKey}
                                        className="text-sky-500 hover:text-sky-400 text-sm"
                                    >
                                        {copySecretState}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold">Created At</h2>
                    <p className="text-gray-400">
                        {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
