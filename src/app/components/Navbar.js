import Link from 'next/link';

const links = [
    { label: 'Home', href: '/' },
    { label: 'Add', href: '/add' },
    { label: 'Search', href: '/search' },
    { label: 'Update', href: '/update' },
    { label: 'Delete', href: '/delete' },
];
export default function Navbar() {
    return (
        <nav className="navbar">
            <span className="navbar-name">Appliance inventory</span>
            <ul className="navbar-links">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link href={link.href}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}