import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Layers, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoggingIn, loginError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      // Error handled by TanStack mutation / displayed in UI
    }
  };

  // Quick helper to fill demo credentials
  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  const errorMessage =
    (loginError as any)?.response?.data?.error?.message ||
    (loginError ? 'Invalid email or password' : '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-indigo-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-600/30">
            <Layers className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">
          Velozity ProjectHub
        </h2>
        <p className="mt-1 text-center text-xs text-indigo-300 font-medium">
          Real-Time Agency Project Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="p-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@velozity.dev"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button type="submit" className="w-full" isLoading={isLoggingIn}>
              <span>Sign In</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-3 text-center">
              Quick Demo Logins (Click to autofill)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@velozity.dev', 'Admin123!')}
                className="p-2 border border-gray-200 hover:border-indigo-500 rounded-lg text-left transition-colors bg-gray-50/50 hover:bg-indigo-50/30"
              >
                <span className="block text-[11px] font-bold text-gray-800">Admin</span>
                <span className="block text-[10px] text-gray-500">Alex Chen</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('pm1@velozity.dev', 'Manager123!')}
                className="p-2 border border-gray-200 hover:border-indigo-500 rounded-lg text-left transition-colors bg-gray-50/50 hover:bg-indigo-50/30"
              >
                <span className="block text-[11px] font-bold text-gray-800">Project Mgr</span>
                <span className="block text-[10px] text-gray-500">Sarah M.</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('dev1@velozity.dev', 'Dev123!')}
                className="p-2 border border-gray-200 hover:border-indigo-500 rounded-lg text-left transition-colors bg-gray-50/50 hover:bg-indigo-50/30"
              >
                <span className="block text-[11px] font-bold text-gray-800">Developer</span>
                <span className="block text-[10px] text-gray-500">Ravi Patel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
