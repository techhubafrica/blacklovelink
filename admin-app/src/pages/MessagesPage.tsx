import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { Mail, CheckCircle, Clock, InboxIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function MessagesPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .from('support_tickets')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setTickets(data ?? []);
      } catch { toast.error('Failed to load messages'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const markResolved = async (id: string) => {
    const { error } = await supabase.from('support_tickets').update({ status: 'resolved' }).eq('id', id);
    if (error) { toast.error('Failed to resolve'); return; }
    toast.success('Marked as resolved');
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'resolved' } : t));
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-700 border-t-rose-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Messages</h1>
        <p className="text-slate-400 mt-1">Support tickets and contact inquiries.</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
          <InboxIcon className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">No messages yet</h3>
          <p className="text-slate-500 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg ${
                    ticket.status === 'resolved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {ticket.status}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{ticket.subject}</h3>
                <p className="text-sm text-slate-400 mb-4">
                  <Mail className="w-3.5 h-3.5 inline mr-1" />
                  {ticket.sender_name} · {ticket.sender_email}
                </p>

                <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                  {ticket.message}
                </div>
              </div>

              <div className="shrink-0 flex gap-3">
                <a
                  href={`mailto:${ticket.sender_email}?subject=RE: ${ticket.subject}`}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Reply
                </a>
                {ticket.status !== 'resolved' && (
                  <button
                    onClick={() => markResolved(ticket.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-bold hover:bg-emerald-500/20 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
