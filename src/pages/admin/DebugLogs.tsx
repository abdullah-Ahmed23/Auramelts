import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

const DebugLogs = () => {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const [insertStatus, setInsertStatus] = useState<string>('');

    useEffect(() => {
        checkAuth();
        fetchLogs();
    }, []);

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (error) setError('Profile fetch error: ' + error.message);
            else setProfile(data);
        }
    };

    const fetchLogs = async () => {
        const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(5);
        if (error) setError('Logs fetch error: ' + error.message);
        else setLogs(data || []);
    };

    const testInsert = async () => {
        setInsertStatus('Inserting...');
        const { error } = await supabase.from('activity_logs').insert([{
            action: 'Test Log',
            details: 'This is a debug log',
            action_type: 'other'
        }]);

        if (error) setInsertStatus('Insert Failed: ' + error.message);
        else {
            setInsertStatus('Insert Success!');
            fetchLogs();
        }
    };

    return (
        <div className="p-10 text-white bg-black min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Activity Logs Debugger</h1>

            <div className="mb-8 border p-4 rounded bg-white/5">
                <h2 className="text-xl font-semibold mb-2">1. Auth Status</h2>
                <p>User ID: {user?.id || 'Not Logged In'}</p>
                <p>Email: {user?.email}</p>
                <p className={profile?.role === 'admin' ? "text-green-400" : "text-red-400"}>
                    Profile Role: {profile?.role || 'No Profile Found / Not Admin'}
                </p>
                {!profile && <p className="text-yellow-400 text-sm mt-2">If Profile Role is missing, the RLS policy hides the logs from you.</p>}
            </div>

            <div className="mb-8 border p-4 rounded bg-white/5">
                <h2 className="text-xl font-semibold mb-2">2. Logs Fetch Test</h2>
                {error && <p className="text-red-400">{error}</p>}
                <p>Logs Found: {logs.length}</p>
                <ul className="list-disc pl-5 mt-2 text-sm text-white/70">
                    {logs.map(l => (
                        <li key={l.id}>{l.action} - {l.created_at}</li>
                    ))}
                </ul>
            </div>

            <div className="mb-8 border p-4 rounded bg-white/5">
                <h2 className="text-xl font-semibold mb-2">3. Insert Test</h2>
                <Button onClick={testInsert}>Test Insert Log</Button>
                <p className="mt-2 text-yellow-400">{insertStatus}</p>
            </div>
        </div>
    );
};

export default DebugLogs;
