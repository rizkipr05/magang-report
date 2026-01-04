"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

type MenuItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
    desc?: string;
};

type UserProfile = {
    name: string;
    role: string;
    avatarInitial: string;
};

interface SidebarProps {
    menuItems: MenuItem[];
    user: UserProfile;
}

export default function Sidebar({ menuItems, user }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-50">
            {/* Logo Area */}
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l9-5-9-5-9 5 9 5z" /></svg>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">SIMNAS</h1>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Sistem Magang</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${isActive
                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                                }`}
                        >
                            <div className={`mt-0.5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-blue-600"}`}>
                                {item.icon}
                            </div>
                            <div>
                                <span className="font-medium block text-sm">{item.label}</span>
                                {item.desc && (
                                    <span className={`text-[10px] block mt-0.5 ${isActive ? "text-blue-100" : "text-gray-400"}`}>
                                        {item.desc}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 font-bold shadow-sm">
                        {user.avatarInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.role}</p>
                    </div>
                </div>
                <LogoutButton />
            </div>
        </aside>
    );
}
