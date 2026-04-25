import { Red_Hat_Display } from 'next/font/google';  // Add this import
import './globals.css';
import Navbar from './components/Navbar';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });


const redHatDisplay = Red_Hat_Display({
  variable: '--font-red-hat',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata = {
  title: 'Appliance Inventory',
  description: 'Household Appliance Inventory — Assignment 2',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${redHatDisplay.variable}`}>
      <body>
        <Navbar />
        <main className="main">
          {children}
        </main>
      </body>
    </html>
  );
}