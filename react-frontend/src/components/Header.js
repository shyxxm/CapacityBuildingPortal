import React, { Fragment, useState, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import UserContext from "../services/UserContext";

const settings = ["Account", "Logout"];

function Header() {
  const { userData } = useContext(UserContext);

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNotificationClick = () => {
    // Add your functionality here
    console.log("Notification bell clicked!");
    // You can perform additional actions or navigate to another page, etc.
  };

  return (
    <Fragment>
      {/*  Header Start */}
      <header className="app-header">
        <nav className="navbar navbar-expand-lg navbar-light">
          <ul className="navbar-nav">
            <li className="nav-item d-block d-xl-none">
              <a
                className="nav-link sidebartoggler nav-icon-hover"
                id="headerCollapse"
                href="javascript:void(0)"
              >
                <i className="ti ti-menu-2" />
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link nav-icon-hover"
                href="javascript:void(0)"
                onClick={handleNotificationClick}
              >
                <i className="ti ti-bell-ringing" />
                <div className="notification bg-primary rounded-circle" />
              </a>
            </li>
          </ul>
          <div
            className="navbar-collapse justify-content-end px-0"
            id="navbarNav"
          >
            <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
              <li className="nav-item">
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu}>
                    <Avatar
                      alt="Remy Sharp"
                      src="../assets/images/profile/user-1.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </li>
            </ul>
            <a target="_blank" className="btn btn-primary">
              {/* {userData.firstName}            */}
            </a>
          </div>
        </nav>
      </header>
      {/*  Header End */}
    </Fragment>
  );
}

export default Header;
