import React from 'react';
import { Bot, Users, Bell } from 'lucide-react';

const AutomationCard = ({ title, trigger, action, active }) => (
    <div className="bg-azen-card border border-azen-border rounded-xl p-6 relative overflow-hidden group hover:border-azen-primary/50 transition-all">
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-azen-bg rounded-lg border border-azen-border group-hover:border-azen-primary/30 transition-colors">
                <Bot className="w-6 h-6 text-azen-primary" />
            </div>
            <div className={`w-10 h-6 px-1 rounded-full flex items-center transition-colors ${active ? 'bg-emerald-500/20' : 'bg-gray-700'}`}>
                <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${active ? 'bg-emerald-400 translate-x-4' : 'bg-gray-400 translate-x-0'}`} />
            </div>
        </div>

        <h4 className="text-lg font-semibold text-white mb-6">{title}</h4>

        <div className="space-y-2 relative">
            <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-azen-border/50 border-l border-dashed border-azen-muted/30"></div>

            <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-azen-bg border border-azen-border flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-azen-secondary" />
                </div>
                <div>
                    <span className="block text-xs font-mono text-azen-muted uppercase tracking-wider mb-0.5">Trigger</span>
                    <span className="text-sm text-white font-medium">{trigger}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 relative z-10 pt-4">
                <div className="w-10 h-10 rounded-full bg-azen-bg border border-azen-border flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 text-azen-primary" />
                </div>
                <div>
                    <span className="block text-xs font-mono text-azen-muted uppercase tracking-wider mb-0.5">Action</span>
                    <span className="text-sm text-white font-medium">{action}</span>
                </div>
            </div>
        </div>
    </div>
);

export default AutomationCard;
