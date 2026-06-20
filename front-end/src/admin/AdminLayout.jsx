import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  FileText,
  Flame,
  FolderOpen,
  Globe,
  Image,
  LayoutDashboard,
  Leaf,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Newspaper,
  Package,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navSections = [
  {
    title: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
      { to: '/admin/products', label: 'Shop Products', icon: Package },
      { to: '/admin/users', label: 'Users', icon: Users },
    ],
  },
  {
    title: 'Content',
    items: [
      { to: '/admin/manage/categories', label: 'Categories', icon: Tag },
      { to: '/admin/manage/articles', label: 'Articles', icon: Newspaper },
      { to: '/admin/manage/features', label: 'Features', icon: Star },
      { to: '/admin/manage/blogs', label: 'Blogs', icon: FileText },
      { to: '/admin/manage/renewableEnergy', label: 'Renewable Energy', icon: Leaf },
      { to: '/admin/manage/fossilFuel', label: 'Fossil Fuel', icon: Flame },
      { to: '/admin/manage/comments', label: 'Comments', icon: MessageSquare },
    ],
  },
  {
    title: 'Media & Library',
    items: [
      { to: '/admin/manage/media', label: 'Media', icon: Image },
      { to: '/admin/manage/publications', label: 'Publications', icon: FileText },
      { to: '/admin/manage/bookmarks', label: 'Bookmarks', icon: Bookmark },
    ],
  },
  {
    title: 'Locations',
    items: [
      { to: '/admin/manage/regions', label: 'Regions', icon: Globe },
      { to: '/admin/manage/countries', label: 'Countries', icon: MapPin },
      { to: '/admin/manage/spotlights', label: 'Spotlights', icon: Sparkles },
    ],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const sidebarWidth = collapsed ? 'lg:w-20' : 'lg:w-72';
  const closeMobileSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 -translate-x-full flex-col border-r border-slate-800 bg-slate-950 text-white shadow-2xl transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${sidebarOpen ? 'translate-x-0' : ''} ${sidebarWidth}`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20">
              <BarChart3 className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-base font-semibold tracking-wide">SolarOps</p>
                <p className="truncate text-xs text-slate-400">Admin Dashboard</p>
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            onClick={closeMobileSidebar}
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:block"
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {navSections.map((section) => (
            <div key={section.title} className="mb-6 last:mb-0">
              {!collapsed ? (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {section.title}
                </p>
              ) : (
                <div className="mx-auto mb-3 h-px w-8 bg-white/10" aria-hidden="true" />
              )}

              <div className="space-y-1">
                {section.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    title={collapsed ? label : undefined}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        collapsed ? 'justify-center' : ''
                      } ${
                        isActive
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950/30'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          {!collapsed && (
            <div className="mb-2 rounded-lg bg-white/[0.04] px-3 py-3 ring-1 ring-white/10">
              <p className="truncate text-sm font-medium">{user?.name || 'Admin'}</p>
              <p className="truncate text-xs text-slate-400">{user?.email || 'Authenticated user'}</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-200 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            aria-label="Open sidebar"
            className="rounded-lg border border-slate-200 p-2 text-slate-700"
            onClick={() => {
              setCollapsed(false);
              setSidebarOpen(true);
            }}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <FolderOpen className="h-4 w-4 text-emerald-600" />
            Admin
          </div>
          <span className="h-9 w-9" aria-hidden="true" />
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
