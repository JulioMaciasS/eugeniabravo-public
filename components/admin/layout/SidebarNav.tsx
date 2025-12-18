// app/components/AdminDashboard/SidebarNav.tsx
"use client"
import { LayoutDashboard, FileText, PlusCircle, LogOut, Tag, Users, Shield } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'

interface NavItem {
  path: string
  icon: React.ReactNode
  label: string
}

const navItems: NavItem[] = [
  { path: '/admin', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Panel Principal' },
  { path: '/admin/posts', icon: <FileText className="h-5 w-5" />, label: 'Artículos' },
  { path: '/admin/categories', icon: <Tag className="h-5 w-5" />, label: 'Categorías' },
  { path: '/admin/authors', icon: <Users className="h-5 w-5" />, label: 'Gestionar Autores' },
  { path: '/admin/security', icon: <Shield className="h-5 w-5" />, label: 'Seguridad' },
  { path: '/admin/posts/new', icon: <PlusCircle className="h-5 w-5" />, label: 'Nuevo Artículo' }
]

const SidebarNav = () => {
  const pathname = usePathname()
  const { signOut, user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <aside className="
      fixed left-0 h-[calc(100vh-80px)] bg-white shadow-lg z-40 
      transition-all duration-300 ease-in-out border-r border-gray-200
      w-16 hover:w-64 group
    ">
      <nav className="pt-6">
        <ul className="space-y-1 px-2 group-hover:px-4 transition-all duration-300">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`
                  flex items-center rounded-lg transition-all duration-200 relative
                  p-3 w-full
                  ${pathname === item.path 
                    ? 'bg-[#009483] text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#009483]'
                  }
                `}
              >
                {/* Icon container - always centered when collapsed */}
                <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <span className={`transition-transform duration-200 ${pathname === item.path ? 'scale-110' : ''}`}>
                    {item.icon}
                  </span>
                </div>
                
                {/* Label - slides in on hover */}
                <span className="
                  ml-3 font-medium whitespace-nowrap overflow-hidden
                  opacity-0 group-hover:opacity-100 
                  transform translate-x-[-10px] group-hover:translate-x-0
                  transition-all duration-300
                ">
                  {item.label}
                </span>
                
                {/* Tooltip for non-hover state */}
                <div className="
                  absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg 
                  opacity-0 group-hover:opacity-0 hover:opacity-100 
                  transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg pointer-events-none
                  group-hover:pointer-events-none
                ">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="absolute bottom-4 left-2 right-2 group-hover:left-4 group-hover:right-4 transition-all duration-300">
          <button
            onClick={handleSignOut}
            className="
              flex items-center w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 
              transition-all duration-200 relative p-3
            "
          >
            {/* Icon container - always centered when collapsed */}
            <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
              <LogOut className="h-5 w-5" />
            </div>
            
            {/* Label - slides in on hover */}
            <span className="
              ml-3 font-medium whitespace-nowrap overflow-hidden
              opacity-0 group-hover:opacity-100 
              transform translate-x-[-10px] group-hover:translate-x-0
              transition-all duration-300
            ">
              Cerrar Sesión
            </span>
            
            {/* Tooltip for non-hover state */}
            <div className="
              absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg 
              opacity-0 group-hover:opacity-0 hover:opacity-100 
              transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg pointer-events-none
              group-hover:pointer-events-none
            ">
              Cerrar Sesión
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </button>
        </div>
      </nav>
    </aside>
  )
}

export default SidebarNav
