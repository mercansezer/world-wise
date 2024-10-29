import styles from "./Sidebar.module.css";
import Logo from "./Logo";
import Footer from "./Footer";
import AppNav from "./AppNav";

import { Outlet } from "react-router-dom";

function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />{" "}
      {/* <Outlet />, React Router'da bir bileşen içinde tanımlanan alt rotaların yerleştirileceği bir yer tutucudur; ana rota eşleştiğinde, ilgili alt rota bileşeni burada render edilir. Bu, hiyerarşik yapıdaki sayfa bileşenlerinin dinamik olarak yüklenmesini sağlar.*/}
      <Footer />
    </div>
  );
}

export default SideBar;
