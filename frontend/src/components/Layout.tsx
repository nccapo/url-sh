import { Component, JSX } from "solid-js";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: JSX.Element;
}

const Layout: Component<LayoutProps> = (props) => {
  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        "min-height": "100vh",
      }}
    >
      <Header />
      <main style={{ flex: 1 }}>{props.children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
