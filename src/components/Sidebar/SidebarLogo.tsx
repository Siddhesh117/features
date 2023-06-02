import { useSelector } from "react-redux";
import { NAV_STYLE_FIXED, NAV_STYLE_MINI_SIDEBAR, THEME_TYPE_LITE } from "../../constants/ThemeSetting";
import type { RootState } from "../../appRedux/store";

const SidebarLogo = ({ sidebarCollapsed, setSidebarCollapsed }: any) => {
  const { themeType, navStyle } = useSelector(({ settings }: RootState) => settings);

  return (
    <div className="gx-layout-sider-header">
      {navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR ? (
        <div className="gx-linebar">
          <i
            className={`gx-icon-btn icon icon-${!sidebarCollapsed ? "menu-unfold" : "menu-fold"} ${themeType !== THEME_TYPE_LITE ? "gx-text-white" : ""}`}
            onClick={() => {
              setSidebarCollapsed(!sidebarCollapsed);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default SidebarLogo;
