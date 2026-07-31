import { ArrowRight, Briefcase, Search, Sparkles, Users } from 'lucide-react';
import { useState } from 'react';
import { JobCard } from '@/app/features/jobs/JobCard';
import { categories, mockJobs } from '@/app/data/mockData';
import type { Page } from '@/app/types';

interface MainPageProps {
  navigate: (page: Page, jobId?: string) => void;
  bookmarks: Set<string>;
  onBookmark: (id: string) => void;
}

export function MainPage({ navigate, bookmarks, onBookmark }: MainPageProps) {
  const [query, setQuery] = useState('');
  const featuredJobs = mockJobs.slice(0, 3);

  return (
    <div>
      <section className="bg-[#F5F8FF] border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border text-sm text-primary mb-5">
              <Sparkles size={14} />
              AI powered job matching
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-5">Find accessible jobs that match your profile</h1>
            <p className="text-lg text-muted-foreground mb-8">Browse jobs, compare workplace accessibility, and track applications from one place.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Search role or company"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-white outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button onClick={() => navigate('jobs')} className="px-5 py-3 rounded-xl bg-primary text-white font-medium inline-flex items-center justify-center gap-2">
                Search jobs <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { label: 'Registered users', value: '12,847', icon: Users },
            { label: 'Active jobs', value: '4,218', icon: Briefcase },
            { label: 'AI satisfaction', value: '89%', icon: Sparkles },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-white border border-border rounded-xl p-5">
                <Icon size={20} className="text-primary mb-3" />
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categories.map(category => (
              <button key={category.id} onClick={() => navigate('jobs')} className="bg-white border border-border rounded-xl p-4 text-left hover:border-primary">
                <p className="font-medium text-foreground">{category.label}</p>
                <p className="text-sm text-muted-foreground mt-1">{category.count} jobs</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Featured jobs</h2>
          <button onClick={() => navigate('jobs')} className="text-sm font-medium text-primary">View all</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {featuredJobs.map(job => (
            <JobCard key={job.id} job={job} navigate={navigate} bookmarked={bookmarks.has(job.id)} onBookmark={onBookmark} />
          ))}
        </div>
      </section>
    </div>
  );
}
