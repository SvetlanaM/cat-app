import Meta from './meta';

type ContainerProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: ContainerProps) => {
  return (
    <>
      <Meta />
      <div className="min-h-screen flex font-sans tracking-wide">
        {children}
      </div>
    </>
  );
};

export default Layout;
