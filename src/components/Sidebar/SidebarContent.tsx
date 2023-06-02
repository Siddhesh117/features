import CustomScrollbars from "../../util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";
import React, { Dispatch, SetStateAction } from "react";
import { Menu } from "antd";
import { THEME_TYPE_LITE } from "../../constants/ThemeSetting";
import { useSelector } from "react-redux";
import type { RootState } from "../../appRedux/store";

type SidebarContentProps = {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
};

const SidebarContent = ({ sidebarCollapsed, setSidebarCollapsed }: SidebarContentProps) => {
  const { themeType } = useSelector(({ settings }: RootState) => settings);
  const pathname = useSelector(({ common }: RootState) => common.pathname);
  const selectedKeys = pathname?.substr(1)?.split("/")?.at(0);
  const defaultOpenKeys = selectedKeys?.split("/")[1];

  return (
    <>
      <SidebarLogo sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
      <div className="gx-sidebar-content" style={{ backgroundColor: "#ECEDF1" }}>
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu defaultOpenKeys={[defaultOpenKeys!]} defaultSelectedKeys={[selectedKeys!]} theme={themeType === THEME_TYPE_LITE ? "light" : "dark"} mode="inline" style={{ backgroundColor: "#ECEDF1", paddingTop: "10px" }}></Menu>
        </CustomScrollbars>
      </div>
    </>
  );
};

export default React.memo(SidebarContent);
