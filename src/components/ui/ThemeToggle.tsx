import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="inline-flex items-center justify-center p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="Toggle Theme"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
