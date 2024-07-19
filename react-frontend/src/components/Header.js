import React, { Fragment, useState, useContext, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../services/UserContext";

const settings = ["Account", "Logout"];

function Header() {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
    fetchNotifications();
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  const fetchNotifications = () => {
    const username = userData.username;

    axios
      .post("/get_notifications", { username })
      .then((response) => {
        setNotifications(response.data.notifications);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };

  const markAsRead = (progress_id) => {
    axios
      .post("/respond_notification", { progress_id })
      .then((response) => {
        fetchNotifications(); // Refresh notifications after marking as read
      })
      .catch((error) => {
        console.error("Error marking notification as read:", error);
      });
  };

  const handleLogout = () => {
    setUserData(null);
    navigate("/Login");
  };

  const getBackgroundColor = (status) => {
    switch (status.toLowerCase()) {
      case "yellow":
        return "#FFF9C4"; // Light Yellow
      case "green":
        return "#C8E6C9"; // Light Green
      case "red":
        return "#FFCDD2"; // Light Red
      default:
        return "white";
    }
  };

  return (
    <Fragment>
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
              <IconButton
                className="nav-link nav-icon-hover"
                onClick={handleOpenNotificationsMenu}
              >
                <i className="ti ti-bell-ringing" />
                <div className="notification bg-primary rounded-circle" />
              </IconButton>
              <Menu
                id="notifications-menu"
                anchorEl={anchorElNotifications}
                open={Boolean(anchorElNotifications)}
                onClose={handleCloseNotificationsMenu}
                MenuListProps={{
                  "aria-labelledby": "notifications-button",
                }}
                PaperProps={{
                  style: {
                    width: "400px",
                  },
                }}
              >
                {notifications.length === 0 ? (
                  <MenuItem onClick={handleCloseNotificationsMenu}>
                    No new notifications
                  </MenuItem>
                ) : (
                  <List>
                    {notifications.map((notification) => (
                      <ListItem
                        key={notification.progress_id}
                        alignItems="flex-start"
                        style={{
                          backgroundColor: getBackgroundColor(
                            notification.progress_status
                          ),
                          marginBottom: "10px",
                          borderRadius: "8px",
                          padding: "16px",
                          border: "2px solid #ccc",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Typography
                            component="span"
                            variant="body1"
                            color="textPrimary"
                            style={{ display: "block", marginBottom: "5px" }}
                          >
                            {notification.update_details}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                          >
                            {notification.project_name}
                          </Typography>
                        </div>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<DoneIcon />}
                          onClick={() => markAsRead(notification.progress_id)}
                          style={{ marginLeft: "16px" }}
                        >
                          Respond
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Menu>
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
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        handleCloseUserMenu();
                        if (setting === "Logout") {
                          handleLogout();
                        }
                      }}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </li>
            </ul>
            <a target="_blank" className="btn btn-primary">
              {userData.firstName}
            </a>
          </div>
        </nav>
      </header>
    </Fragment>
  );
}

export default Header;
