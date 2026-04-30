import type { ReactNode } from 'react';

type AppLayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export const AppLayout = ({ sidebar, children }: AppLayoutProps) => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">Avantos Journey Builder</p>
          <h1>Journey Builder Prefill</h1>
        </div>
      </header>
      <main className="app-main">
        <aside className="app-sidebar">{sidebar}</aside>
        <section className="app-content">{children}</section>
      </main>
    </div>
  );
};
