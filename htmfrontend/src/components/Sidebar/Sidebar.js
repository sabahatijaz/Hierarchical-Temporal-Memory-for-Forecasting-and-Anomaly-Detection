/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
import { Button, FormGroup } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from "reactstrap";
// reactstrap components
import { Nav, NavLink as ReactstrapNavLink } from "reactstrap";
import {
  BackgroundColorContext,
  backgroundColors,
} from "contexts/BackgroundColorContext";
import { useDispatch, useSelector } from "react-redux";
import { setModalStatus } from "store/action/modalAction";
import Categories from "./Categories";
import "./categories.css";

function hideloader() {
  document.getElementById("loading").style.display = "none";
}
// Calling that async function
// const Catergories=getapi(api_url);
// const API_HOST = "http://localhost:3000";
const API_URL = `http://66.45.36.12:8000/api/getATL`;
// const Categories={
//   "data": [
//       "Antiques",
//       "Architectural & Garden",
//       "Balusters",
//       "Barn Doors & Barn Door Hardware",
//       "Beams",
//       "Ceiling Tins",
//       "Chandeliers, Sconces & Lighting Fixtures",
//       "Columns & Posts",
//       "Corbels",
//       "Doors"
//   ]
// }
var ps;
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
function Sidebar(props) {
  const [Input6, setInput6] = useState([]);
  const [data, setData] = useState([]);
  const handleChange = (event) => {
    setData(event.target.value);
  };
  const handleChange6 = (event) => {
    setInput6(event.target.value);
  };

  const classes = useStyles();
  const [age, setAge] = React.useState("");

  const handleChange7 = (event) => {
    setAge(event.target.value);
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const location = useLocation();
  const sidebarRef = React.useRef(null);
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.isOpen);
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  // GET request function to your Mock API
  // async function fetchApiData() {
  //   const response = await fetch(`${API_URL}`)
  //     .then((res) => res.json())
  //     .then((json) => setData(json));
  //   // if (response) {
  //   //       hideloader();
  //   //   }
  //   return response;
  // }

  // Calling the function on component mount
  useEffect(() => {
    // const response = fetchApiData();
    
      hideloader();
    
  }, []);

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebarRef.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });
  const linkOnClick = () => {
    document.documentElement.classList.remove("nav-open");
  };
  const { routes, rtlActive, logo } = props;
  let logoImg = null;
  let logoText = null;
  // if (logo !== undefined) {
  //   if (logo.outterLink !== undefined) {
  //     logoImg = (
  //       <a
  //         href={logo.outterLink}
  //         className="simple-text logo-mini"
  //         target="_blank"
  //         onClick={props.toggleSidebar}
  //       >
  //         <div className="logo-img">
  //           <img src={logo.imgSrc} alt="react-logo" />
  //         </div>
  //       </a>
  //     );
  //     logoText = (
  //       <a
  //         href={logo.outterLink}
  //         className="simple-text logo-normal"
  //         target="_blank"
  //         onClick={props.toggleSidebar}
  //       >
  //         {logo.text}
  //       </a>
  //     );
  //   } else {
  //     logoImg = (
  //       <Link
  //         to={logo.innerLink}
  //         className="simple-text logo-mini"
  //         onClick={props.toggleSidebar}
  //       >
  //         <div className="logo-img">
  //           <img src={logo.imgSrc} alt="react-logo" />
  //         </div>
  //       </Link>
  //     );
  //     logoText = (
  //       <Button
  //         className="simple-text logo-normal"
  //         onClick={props.toggleSidebar}
  //       >
  //         {logo.text}
  //       </Button>
  //     );
  //   }
  // }
  return (
    <BackgroundColorContext.Consumer>
      {({ color }) => (
        <div className="sidebar ml-1 sidebar-top">
          <div className="sidebar-wrapper side-bar" ref={sidebarRef}>
            {/* {logoImg !== null || logoText !== null ? (
              <div className="logo">
                {logoImg}
                {logoText}
              </div>
            ) : null} */}
            {/* <hr></hr> */}

            <Nav>
              {routes.map((prop, key) => {
                if (prop.redirect) return null;
                return (
                  <li
                    className={
                      activeRoute(prop.path) + (prop.pro ? " active-pro" : "")
                    }
                    key={key}
                  >
                    <NavLink
                      style={{ fontSize: "18px" }}
                      to={prop.layout + prop.path}
                      className="nav-link"
                      activeClassName="active"
                      onClick={() => {
                        dispatch(setModalStatus(true));
                      }}
                    >
                      <i className={prop.icon} />
                      <p>{rtlActive ? prop.rtlName : prop.name}</p>
                    </NavLink>
                  </li>
                );
              })}
            </Nav>
            <hr></hr>
            <div>
              <Categories />
            </div>
          </div>
        </div>
      )}
    </BackgroundColorContext.Consumer>
  );
}

// Sidebar.defaultProps = {
//   rtlActive: false,
//   routes: [{}],
// };

// Sidebar.propTypes = {
//   // if true, then instead of the routes[i].name, routes[i].rtlName will be rendered
//   // insde the links of this component
//   rtlActive: PropTypes.bool,
//   routes: PropTypes.arrayOf(PropTypes.object),
//   logo: PropTypes.shape({
//     // innerLink is for links that will direct the user within the app
//     // it will be rendered as <Link to="...">...</Link> tag
//     innerLink: PropTypes.string,
//     // outterLink is for links that will direct the user outside the app
//     // it will be rendered as simple <a href="...">...</a> tag
//     outterLink: PropTypes.string,
//     // the text of the logo
//     text: PropTypes.node,
//     // the image src of the logo
//     imgSrc: PropTypes.string,
//   }),
// };

export default Sidebar;
