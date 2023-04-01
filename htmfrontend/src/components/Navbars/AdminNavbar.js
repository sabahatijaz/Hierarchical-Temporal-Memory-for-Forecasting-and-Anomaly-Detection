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
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
  NavbarToggler,
  ModalHeader,
  Label,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { setSwarmingStatus } from "store/action/swarmingPersistanceAction";
import axios from "axios";
import { setPredictionStatus } from "store/action/stopPrediction";
import { removeCategoryValue } from "store/action/categoriesAction";

import { updateAction } from "store/action/updateAction";
import { toast } from "react-toastify";

function AdminNavbar(props) {
  const [collapseOpen, setcollapseOpen] = React.useState(false);
  const [modalSearch, setmodalSearch] = React.useState(false);
  const [color, setcolor] = React.useState("navbar-transparent");

  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener("resize", updateColor);
    };
  });
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setcolor("bg-white");
    } else {
      setcolor("navbar-transparent");
    }
  };
  // this function opens and closes the collapse on small devices
  const toggleCollapse = () => {
    if (collapseOpen) {
      setcolor("navbar-transparent");
    } else {
      setcolor("bg-white");
    }
    setcollapseOpen(!collapseOpen);
  };
  // this function is to open the Search modal
  const toggleModalSearch = () => {
    setmodalSearch(!modalSearch);
  };

  const { swarming } = useSelector((state) => state.swarming);
  const { category } = useSelector((state) => state.category);
  const { token } = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const updateBtnHandler = async () => {
    if (category) {
      const todo = {
        CategoryID: category.name,
        
        IsSwaming: swarming.toString(),
      };
      await axios
        .post("http://0.0.0.0:5000/HTMConfUpdate", todo)
        .then((res) => {
          console.log(res.data);
          dispatch(updateAction(res.data));
        })
        .catch((err) => console.log(err));
      // console.log(todo);
    } else {
      toast.warn("No Category is Selected", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const predictionHandler = async () => {
    if (category) {
      dispatch(setPredictionStatus(true));
      dispatch(removeCategoryValue(category.name, category.name));
      token.forEach((element) => {
        clearInterval(element);
      });
      const CategoryID = "" + category.value;
      await axios
        .post("http://0.0.0.0:5000/HTMStop", {
          CategoryID: category.name,
        })
        .then((res) => console.log(res.data))
        .catch((error) => console.log(error));
    } else {
      
        toast.warn("No Category is Selected", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
    }
  };

  return (
    <>
      <Navbar className={classNames("navbar-absolute", color)} expand="lg">
        <Container fluid>
          <div className="navbar-wrapper">
            <div
              className={classNames("navbar-toggle d-inline", {
                toggled: props.sidebarOpened,
              })}
            >
              <NavbarToggler onClick={props.toggleSidebar}>
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </NavbarToggler>
            </div>
            <NavbarBrand
              style={{ fontSize: "20px", marginLeft: "-2px" }}
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              XYZ forecaster
            </NavbarBrand>
          </div>
          <NavbarToggler onClick={toggleCollapse}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
          <Collapse navbar isOpen={collapseOpen}>
            <Nav className="ml-auto" navbar>
              <InputGroup className="search-bar">
                <div className="d-flex align-items-center">
                  <Label
                    style={{
                      color: "#FFFFFF",
                      marginLeft: "2rem",
                      marginRight: "1rem",
                    }}
                    check
                    variant="danger"
                    id="Swarming"
                  >
                    <Input
                      type="checkbox"
                      value={swarming}
                      checked={swarming}
                      onChange={() => dispatch(setSwarmingStatus(!swarming))}
                    />{" "}
                    Swarming
                  </Label>
                  <Button onClick={updateBtnHandler}>Update</Button>
                  {/* <Label 
           style={{ color: "#FFFFFF",marginLeft:"1rem",marginRight:"2rem"  }} 
           check 
           variant="danger" 
           id="Persistence">
            <Input 
            type="checkbox" 
            value={persistence} 
            checked={persistence} 
            onChange={()=>dispatch(setPersistenceStatus(!persistence))}/>
            {' '}Regular Persistence
          </Label>
          <Label 
            style={{ color: "#FFFFFF",marginLeft:"1rem",marginRight:"2rem"  }} 
            check 
            variant="danger" 
            id="Persistence">
            <Input 
              type="checkbox" 
              value={persistenceDayEnd} 
              checked={persistenceDayEnd} 
              onChange={()=>dispatch(setPersistanceAtDayEnd(!persistenceDayEnd))} />
              {' '}Persist at day End
          </Label> */}
                </div>
                <Button color="link" onClick={toggleModalSearch}>
                  <i className="tim-icons icon-zoom-split" />
                  <span className="d-lg-none d-md-block">Search</span>
                </Button>
              </InputGroup>

              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  nav
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="photo">
                    <img
                      alt="..."
                      src={require("assets/img/anime3.png").default}
                    />
                  </div>
                  <b className="caret d-none d-lg-block d-xl-block" />
                  <p className="d-lg-none">Log out</p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">Profile</DropdownItem>
                  </NavLink>
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">Settings</DropdownItem>
                  </NavLink>
                  <NavLink tag="li">
                    <DropdownItem
                      onClick={predictionHandler}
                      className="nav-item"
                    >
                      Stop Prediction
                    </DropdownItem>
                  </NavLink>
                  <DropdownItem divider tag="li" />
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">Log out</DropdownItem>
                  </NavLink>
                </DropdownMenu>
              </UncontrolledDropdown>
              <li className="separator d-lg-none" />
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
      <Modal
        modalClassName="modal-search"
        isOpen={modalSearch}
        toggle={toggleModalSearch}
      >
        <ModalHeader>
          <Input placeholder="SEARCH" type="text" />
          <button
            aria-label="Close"
            className="close"
            onClick={toggleModalSearch}
          >
            <i className="tim-icons icon-simple-remove" />
          </button>
        </ModalHeader>
      </Modal>
    </>
  );
}

export default AdminNavbar;
