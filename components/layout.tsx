import Meta from './meta';

const Layout = ({ children }) => {
  return (
    <>
      <Meta />
      <div className="flex font-sans tracking-wide min-h-screen">
        {children}
      </div>
    </>
  );
};

export default Layout;
