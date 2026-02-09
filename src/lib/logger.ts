import { supabase } from './supabase';

export type ActivityAction = 'create' | 'update' | 'delete' | 'login' | 'other';

export const logActivity = async (
    action: string,
    details: string,
    actionType: ActivityAction = 'other'
) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        let userName = 'Guest';

        if (user) {
            userName = user.email || 'Authenticated User';
            try {
                // Try to fetch profile details safely
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (profile) {
                    userName = profile.full_name || profile.username || profile.first_name || user.email || 'Authenticated User';
                }
            } catch (err) {
                console.warn('Could not fetch profile for logger:', err);
            }
        }

        // SECURITY UPDATE: Client-side logging is disabled to prevent spam/abuse.
        // Critical actions (Orders, Signups) are now logged automatically via Database Triggers.
        // See: secure_activity_logs.sql

        /* 
        const { error } = await supabase.from('activity_logs').insert([
            {
                action,
                details,
                action_type: actionType,
                user_id: user?.id,
                user_email: user?.email,
                user_name: userName
            }
        ]);

        if (error) {
            console.error('Error logging activity:', error.message || error);
        }
        */
        console.log(`[Activity Logged via Trigger]: ${action} - ${details}`);
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};
