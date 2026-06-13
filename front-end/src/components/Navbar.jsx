import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { name: 'Features', path: '/features' },
  { name: 'Spotlight', path: '/spotlight' },
  {
    name: 'Fossil Fuel',
    path: '/fossil-fuel',
    dropdown: [
      { name: 'Coal', path: '/fossil-fuel/coal' },
      { name: 'Oil and Gas', path: '/fossil-fuel/oil-gas' },
      { name: 'Petroleum', path: '/fossil-fuel/petroleum' },
      { name: 'Natural Gas', path: '/fossil-fuel/natural-gas' },
    ],
  },
  {
    name: 'Regions',
    path: '/regions',
    dropdown: [
      {
        category: 'Southeast Asia',
        items: [
          { name: 'Cambodia', path: '/regions/cambodia' },
          { name: 'India', path: '/regions/india' },
          { name: 'Singapore', path: '/regions/singapore' },
        ],
      },
      {
        category: 'East Asia',
        items: [
          { name: 'Japan', path: '/regions/japan' },
          { name: 'South Korea', path: '/regions/south-korea' },
        ],
      },
      { name: 'Other Regions', path: '/regions/others' },
    ],
  },
  {
    name: 'Renewable Energy',
    path: '/renewable-energy',
    dropdown: [
      { name: 'Solar', path: '/renewable-energy/solar' },
      { name: 'Wind', path: '/renewable-energy/wind' },
      { name: 'Clean Energy Financing', path: '/renewable-energy/financing' },
      { name: 'Fair & Just Transition', path: '/renewable-energy/transition' },
    ],
  },
  {
    name: 'Media',
    path: '/media',
    dropdown: [
      { name: 'Videos', path: '/media/videos' },
      { name: 'Podcasts', path: '/media/podcasts' },
    ],
  },
  {
    name: 'Blog',
    path: '/blog',
    dropdown: [
      { name: 'Case Studies', path: '/blog/case-studies' },
      { name: 'Energy Transition Inspiration', path: '/blog/transition' },
      { name: 'Opinion Pieces', path: '/blog/opinion' },
    ],
  },
  { name: 'Publications', path: '/publications' },
  { name: 'About Us', path: '/about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const renderDropdown = (dropdown) =>
    dropdown.map((sub, i) => (
      <div key={i} className="mb-6 last:mb-0">
        {sub.category ? (
          <div>
            <p className="text-emerald-600 font-semibold text-xs uppercase tracking-widest mb-3">
              {sub.category}
            </p>
            <div className="space-y-2">
              {sub.items.map((country) => (
                <Link
                  key={country.path}
                  to={country.path}
                  className="block py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg hover:text-emerald-600 transition"
                  onClick={() => setActiveDropdown(null)}
                >
                  {country.name}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Link
            to={sub.path}
            className="block py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg hover:text-emerald-600 transition"
            onClick={() => setActiveDropdown(null)}
          >
            {sub.name}
          </Link>
        )}
      </div>
    ));

  return (
    <nav className="bg-white dark:bg-gray-950 shadow-md fixed w-full z-50 border-b border-transparent dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <Sun className="w-8 h-8 text-yellow-500" />
            <div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Energy</span>
              <span className="text-2xl font-bold text-emerald-600">Tracker</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-800 dark:text-gray-100">
            {navItems.map((item, index) => (
              <div
                key={item.path}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <Link
                    to={item.path}
                    className="flex items-center gap-1 hover:text-emerald-600 transition py-4"
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition" />
                  </Link>
                ) : (
                  <Link to={item.path} className="hover:text-emerald-600 transition py-4">
                    {item.name}
                  </Link>
                )}

                {item.dropdown && activeDropdown === index && (
                  <div className="absolute top-full left-0 bg-white dark:bg-gray-900 shadow-xl rounded-lg py-6 px-8 w-72 z-50 border border-gray-100 dark:border-gray-800">
                    {renderDropdown(item.dropdown)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDark((current) => !current)}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-100 hover:text-emerald-600 transition"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-800 dark:text-gray-100"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 py-6 bg-white dark:bg-gray-950">
            {navItems.map((item) => (
              <div key={item.path} className="px-4 py-1">
                <Link
                  to={item.path}
                  className="block py-3 font-semibold text-gray-800 dark:text-gray-100 hover:text-emerald-600"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>

                {item.dropdown && (
                  <div className="pl-6 border-l-2 border-gray-100 dark:border-gray-800 space-y-4 py-2">
                    {renderDropdown(item.dropdown)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
