import { Link } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import StatCard from '../../components/StatCard';

function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-16 text-center text-white sm:py-20">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Course Discussion &amp; Resource Hub
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-brand-200 text-lg">
          Ask questions, share resources, and collaborate with your classmates in one place.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <SearchBar placeholder="Search threads, resources, meetups…" />
        </div>
      </section>

      {/* Quick stats */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Platform Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Discussions" value="—" icon="💬" />
          <StatCard label="Resources" value="—" icon="📂" />
          <StatCard label="Study Meetups" value="—" icon="📅" />
          <StatCard label="Members" value="—" icon="👥" />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Ready to get started?</h2>
        <p className="mt-2 text-gray-500">
          Create an account and join the conversation.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/register"
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-brand-700 transition-colors"
          >
            Create Account
          </Link>
          <Link
            to="/search"
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            Browse Threads
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
