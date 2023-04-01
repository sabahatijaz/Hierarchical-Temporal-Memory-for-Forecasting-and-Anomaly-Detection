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
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin/Admin.js";
import RTLLayout from "layouts/RTL/RTL.js";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";
import { Provider } from "react-redux";
import MainStore from "./store/index";
// export * from './spinner';

/* <div class="lds-facebook"><div></div><div></div><div></div></div> */

ReactDOM.render(
  <ThemeContextWrapper>
    <BackgroundColorWrapper>
      <Provider store={MainStore}>
        <BrowserRouter>
          <Switch>
            <Route
              path="/admin"
              render={(props) => <AdminLayout {...props} />}
            />
            <Route path="/rtl" render={(props) => <RTLLayout {...props} />} />
            <Redirect from="/" to="/admin/dashboard" />
          </Switch>
        </BrowserRouter>
      </Provider>
    </BackgroundColorWrapper>
  </ThemeContextWrapper>,
  document.getElementById("root")
);
// function GetData(){
//   <script>
//     var value1=document.getElementById("Input1").value;
//     var value2=document.getElementById("Input2").value;
//     var value3=document.getElementById("Input3").value;
//     var value4=document.getElementById("Swarming").value;
//     var value5=document.getElementById("Persistence").value;
//     var value6=document.getElementById("exampleSelect").value;
//     document.write(value1);
//     document.write(value2);
//     document.write(value3);
//     document.write(value4);
//     document.write(value5);
//     document.write(value6);
//   </script>
// }
// GetData()
