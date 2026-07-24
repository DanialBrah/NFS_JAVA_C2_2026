import AppHeader from './AppHeader';

export default function Layout({ children }) {
  return (
    <div className="layout">
      <AppHeader />
      <main>{children}</main>
    </div>
  );
}
