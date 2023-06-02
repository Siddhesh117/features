import { useState } from "react";
import { Avatar, Popover } from "antd";

const UserProfile = () => {
  const [open, setOpen] = useState<boolean>(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li>My Account</li>
      <li
        onClick={() => {
          hide();
        }}
      >
        Update Password
      </li>
      <li>Logout</li>
    </ul>
  );

  return (
    <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row">
      <Popover placement="bottomRight" content={userMenuOptions} trigger="click" open={open} onOpenChange={handleOpenChange}>
        <Avatar src={"https://via.placeholder.com/150"} className="gx-size-40 gx-pointer gx-mr-3" alt="" />
        <span className="gx-avatar-name">
          <i className="icon icon-chevron-down gx-fs-xxs gx-ml-2" />
        </span>
      </Popover>
    </div>
  );
};

export default UserProfile;
