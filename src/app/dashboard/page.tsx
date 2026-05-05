'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MODULE_DEFINITIONS, MODULE_ORDER } from '@/lib/modules/definitions';
import { ProfileDimensions } from '@/types';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

interface StoredProfile {
  profile: ProfileDimensions;
  profileId: string | null;
  sessionId: string | null;
  reportId: string;
}

type ModuleStatus = 'locked' | 'generating' | 'done' | 'error';

export default function DashboardPage() {
  const router = useRouter();
  const [storedProfile, setStoredProfile] = useState<StoredProfile | null>(null);
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, ModuleStatus>>({});
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('current_profile');
    if (!raw) { setHasProfile(false); return; }
    try {
      const parsed = JSON.parse(raw);
      setStoredProfile(parsed);
      setHasProfile(true);

      const savedStatuses = localStorage.getItem('module_statuses');
      if (savedStatuses) {
        setModuleStatuses(JSON.parse(savedStatuses));
      }
    } catch {
      setHasProfile(false);
    }
  }, []);

  function updateStatus(moduleId: string, status: ModuleStatus) {
    setModuleStatuses(prev => {
      const next = { ...prev, [moduleId]: status };
      localStorage.setItem('module_statuses', JSON.stringify(next));
      return next;
    });
  }

  async function generateModule(moduleId: string) {
    if (!storedProfile) return;
    updateStatus(moduleId, 'generating');

    try {
      const res = await fetch(`/api/modules/${moduleId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: storedProfile.profile,
          openEnded: getOpenEnded(),
          profileId: storedProfile.profileId,
        }),
      });
      if (!res.ok) throw new Error('Generation failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No stream');

      const decoder = new TextDecoder();
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      const reportContent = fullText.replace(/\n\n<!--META:[\s\S]+?:META-->/, '');
      localStorage.setItem(`module_${moduleId}`, JSON.stringify({
        moduleId,
        content: reportContent,
        createdAt: new Date().toISOString(),
      }));
      updateStatus(moduleId, 'done');
      router.push(`/modules/${moduleId}`);
    } catch {
      updateStatus(moduleId, 'error');
    }
  }

  function getOpenEnded(): Record<string, string> {
    if (!storedProfile?.reportId) return {};
    const raw = localStorage.getItem(`report_${storedProfile.reportId}`);
    if (!raw) return {};
    try {
      const report = JSON.parse(raw);
      return {
        formativeChapter: '',
        othersPerception: '',
        growthGap: '',
        regrettedDecision: '',
        ...report.openEnded,
      };
    } catch { return {}; }
  }

  if (hasProfile === null) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!hasProfile || !storedProfile) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-bold text-stone-900 mb-3">No profile found.</h2>
        <p className="text-stone-500 mb-8 max-w-sm">
          Complete the intake analysis first to unlock your personalized modules.
        </p>
        <Link
          href="/intake"
          className="bg-amber-400 text-stone-950 px-6 py-3 rounded-full font-semibold hover:bg-amber-300 transition-colors"
        >
          Start Your Analysis
        </Link>
      </div>
    );
  }

  const completedCount = MODULE_ORDER.filter(id => moduleStatuses[id] === 'done').length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Header */}
      <div className="border-b border-stone-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href={`/report?id=${storedProfile.reportId}`} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm">
            <ArrowLeft size={16} /> Your Report
          </Link>
          <div className="text-xs text-stone-400 font-mono">
            {completedCount} / {MODULE_ORDER.length} modules unlocked
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 py-16 border-b border-stone-200">
        <div className="text-xs font-mono text-stone-400 mb-4 uppercase tracking-widest">Your Dashboard</div>
        <h1 className="text-4xl font-bold mb-4 text-stone-900">Twelve more lenses.</h1>
        <p className="text-stone-500 max-w-xl text-lg">
          Each module runs the same profile data through a different analytical frame. No new questions needed — just a new angle on who you are.
        </p>
      </div>

      {/* Module grid */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULE_ORDER.map(moduleId => {
            const def = MODULE_DEFINITIONS[moduleId];
            const status = moduleStatuses[moduleId] ?? 'locked';

            return (
              <ModuleCard
                key={moduleId}
                def={def}
                status={status}
                onGenerate={() => generateModule(moduleId)}
                onView={() => router.push(`/modules/${moduleId}`)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface ModuleCardProps {
  def: (typeof MODULE_DEFINITIONS)[string];
  status: ModuleStatus;
  onGenerate: () => void;
  onView: () => void;
}

function ModuleCard({ def, status, onGenerate, onView }: ModuleCardProps) {
  const isDone = status === 'done';
  const isGenerating = status === 'generating';
  const isError = status === 'error';

  return (
    <div className={`
      rounded-2xl border p-6 flex flex-col gap-4 transition-all bg-white
      ${isDone ? 'border-stone-300' : 'border-stone-200'}
    `}>
      <div className="flex items-start justify-between">
        <span className="text-2xl">{def.icon}</span>
        {isDone && <CheckCircle size={16} className="text-amber-500 mt-1" />}
      </div>

      <div>
        <h3 className="text-stone-900 font-semibold mb-1">{def.name}</h3>
        <p className="text-stone-400 text-sm leading-relaxed">{def.tagline}</p>
      </div>

      <div className="mt-auto">
        {isError && (
          <p className="text-red-500 text-xs mb-2">Generation failed — try again</p>
        )}
        {isDone ? (
          <button
            onClick={onView}
            className="w-full border border-stone-300 text-stone-600 hover:text-stone-900 hover:border-stone-500 rounded-xl py-2 text-sm transition-colors"
          >
            View Report
          </button>
        ) : isGenerating ? (
          <button disabled className="w-full bg-stone-100 text-stone-400 rounded-xl py-2 text-sm flex items-center justify-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Generating...
          </button>
        ) : (
          <button
            onClick={onGenerate}
            className="w-full bg-amber-400 text-stone-950 hover:bg-amber-300 rounded-xl py-2 text-sm font-semibold transition-colors"
          >
            Generate {def.estimatedTime}
          </button>
        )}
      </div>
    </div>
  );
}
