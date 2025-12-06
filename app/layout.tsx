import type { ReactNode } from 'react';
import Header from '../components/Header';

export const metadata = {
  title: 'Nexbuzzer',
  description: 'Appels experts à la minute',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
