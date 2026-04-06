'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TicketPercent,
  Tags,
  FolderOpen,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/promocoes', label: 'Promoções', icon: TicketPercent },
  { href: '/admin/cupons', label: 'Cupons', icon: Tags },
  { href: '/admin/categorias', label: 'Categorias', icon: FolderOpen },
];

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-neutral-900 text-white">
      <div className="flex h-14 items-center border-b border-neutral-700 px-4">
        <Link
          href="/admin/dashboard"
          className="text-base font-extrabold"
          onClick={onClose}
        >
          Promo<span className="text-brand-500">Atletas</span>{' '}
          <span className="text-xs font-normal text-neutral-400">Admin</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto rounded p-1 hover:bg-neutral-700 lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-3" aria-label="Menu admin">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-500 text-white'
                  : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <Icon size={16} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-700 p-2">
        <Link
          href="/admin/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white"
        >
          <LogOut size={16} aria-hidden />
          Sair
        </Link>
      </div>
    </aside>
  );
}

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full min-h-screen bg-neutral-100">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex">
        <AdminSidebar />
      </div>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <div className="relative flex">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center border-b border-neutral-200 bg-white px-4 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-3 rounded p-1.5 text-neutral-500 hover:bg-neutral-100 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-neutral-700">
            Painel Administrativo
          </span>
          <div className="ml-auto text-sm text-neutral-500">
            <span className="hidden sm:inline">admin@promoatletas.com</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
