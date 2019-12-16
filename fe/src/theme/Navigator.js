import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ListIcon from "@material-ui/icons/List";
import { Link } from "react-router-dom";

const categories = [
  { id: "Warehouse", icon: <DashboardIcon />, link: "/warehouse" },
  { id: "Sales Orders", icon: <ShoppingCartIcon />, link: "/sales" },
  { id: "Purchase Orders", icon: <MonetizationOnIcon />, link: "/purchases" },
  { id: "Picking Waves", icon: <ListIcon />, link: "/pickingWaves" }
];

const styles = theme => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white
  },
  item: {
    paddingTop: "1em",
    paddingBottom: "1em",
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover,&:focus": {
      backgroundColor: "rgba(255, 255, 255, 0.08)"
    }
  },
  itemCategory: {
    backgroundColor: "#232f3e",
    boxShadow: "0 -1px 0 #404854 inset",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white
  },
  itemActiveItem: {
    color: "#4fc3f7"
  },
  itemPrimary: {
    fontSize: "inherit"
  },
  itemIcon: {
    minWidth: "auto",
    marginRight: theme.spacing(2)
  },
  divider: {
    marginTop: theme.spacing(2)
  },

  link: {
    textDecoration: "none"
  }
});

class Navigator extends React.Component {
  render() {
    const { classes, ...other } = this.props;
    return (
      <Drawer variant="permanent" {...other}>
        <List disablePadding>
          <ListItem
            className={clsx(
              classes.firebase,
              classes.item,
              classes.itemCategory
            )}
          >
            SodaSinf
          </ListItem>
          {categories.map(({ id: childId, icon, link }) => (
            <Link key={childId} to={link} className={classes.link}>
              <ListItem
                key={childId}
                button
                className={clsx(
                  classes.item,
                  this.props.selecteditem === childId && classes.itemActiveItem
                )}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    );
  }
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navigator);
