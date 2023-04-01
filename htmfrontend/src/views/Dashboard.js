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
// import Sidebar from "components/Sidebar/Sidebar";
import React, { useEffect, useState, useCallback } from "react";
import { Fragment } from "react";
// nodejs library that concatenates classes
// react plugin used to create charts
// import { Line, Bar } from "react-chartjs-2";
import { InputGroupAddon, Input } from "reactstrap";
// import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
// import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Label,
  Row,
  Col,
} from "reactstrap";

import "./Dashboard.css";

import { CircularProgress, Modal } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCaretDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal as Modal2 } from "react-bootstrap";
// // core components
// import {
//   chartExample1,
//   chartExample2,
//   chartExample3,
//   chartExample4,
// } from "variables/charts.js";
import axios from "axios";
// import { Chart } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { setModalStatus } from "store/action/modalAction";
import { Dropdown } from "react-bootstrap";
import { setSwarmingStatus } from "store/action/swarmingPersistanceAction";
import { setPersistenceStatus } from "store/action/swarmingPersistanceAction";
import { setPersistanceAtDayEnd } from "store/action/swarmingPersistanceAction";
import Categories from "./categories";
import { addCategory } from "store/action/categoriesAction";
import { addCategoryValue } from "store/action/categoriesAction";
import { addToken } from "store/action/tokenAction";
import AreaGraph from "./AreaGraph";
import BarGraph from "./BarGraph";
import { setData } from "store/action/data";
import { emptyData } from "store/action/data";
import { swarmingStatusAction } from "store/action/swarmingStatusAction";
import LineGraph from "./LineGraph";
import { spikeAction } from "store/action/spikeAction";
import { AnomalyScoreAction } from "store/action/oneStepAction";
import { nthStepAction } from "store/action/oneStepAction";
import { oneStepAction } from "store/action/oneStepAction";
import { inValueAction } from "store/action/oneStepAction";
import { addSpike } from "store/action/spikeNotificationAction";
import { showingAction } from "store/action/showingAction";
import TablePagination from '@material-ui/core/TablePagination';
import { addCommerror } from "store/action/commerrorAction";
import { Chart } from "chart.js";
import io from "socket.io-client";
import { TableSimple } from 'react-pagination-table';

const socket = io.connect("http://localhost:5000");

const path = require('path');
//Table header
const chartRef1 = React.createRef();
const chartRef2=React.createRef();
const chartRef3=React.createRef();
const chartRef4=React.createRef();
const chartData1 = {
  type: 'line',
  data: {
      labels: [],
      datasets: [
          {
              label: "Actual Value",
              // backgroundColor: 'rgba(0, 153, 51,0.5)',
              borderColor: "rgba(0, 153, 51,0.5)",
              pointBackgroundColor: "rgba(26,179,148,1)",
              pointBorderColor: "#fff",
              data: []
          },
           {
              label: "Predicted Value",
              // backgroundColor: 'rgba(0, 204, 255, 0.5)',
              borderColor: "rgba(0, 204, 255, 0.5)",
              pointBackgroundColor: "rgba(26,179,148,1)",
              pointBorderColor: "#fff",
              data: []
          },
      ]
  },
  options: {
    maintainAspectRatio: false,
    legend: {
      display: true,
    },
    tooltips: {
      backgroundColor: "#f5f5f5",
      titleFontColor: "#333",
      bodyFontColor: "#666",
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest",
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: "rgba(225,78,202,0.1)",
            zeroLineColor: "transparent",
          },
          ticks: {
            // suggestedMin: 60,
            // suggestedMax: 120,
            // min:30000,
            // max:40000,
            padding: 20,
            fontColor: "#9e9e9e",
            beginAtZero:false,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: "rgba(225,78,202,0.1)",
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e",
          },
        },
      ],
    },
  },
}

const chartData2 = {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: "Predicted",
        fill: true,
        backgroundColor: "#263655",
        borderColor: "#1f8ef1",
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: "#1f8ef1",
        pointBorderColor: "rgba(255,255,255,0)",
        pointHoverBackgroundColor: "#1f8ef1",
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: [],
      },
    ],
  },
  options: {
    animationEnabled: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
    },
    tooltips: {
      backgroundColor: "#f5f5f5",
      titleFontColor: "#333",
      bodyFontColor: "#666",
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest",
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: "rgba(225,78,202,0.1)",
            zeroLineColor: "transparent",
          },
          ticks: {
            // suggestedMin: 60,
            // suggestedMax: 120,
            padding: 20,
            fontColor: "#9e9e9e",
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: "rgba(225,78,202,0.1)",
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e",
            beginAtZero:false,
          },
        },
      ],
    },
  }
}
const chartData3 =  {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Actual",
        fill: true,
        backgroundColor: "#292A42",
        hoverBackgroundColor: "#292A42",
        borderColor: "#d048b6",
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        data: [],
      },
    ],
  },
  options: {
    animationEnabled: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
    },
    tooltips: {
      backgroundColor: "#f5f5f5",
      titleFontColor: "#333",
      bodyFontColor: "#666",
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest",
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: "rgba(225,78,202,0.1)",
            zeroLineColor: "transparent",
          },
          ticks: {
            // suggestedMin: 60,
            // suggestedMax: 120,
            padding: 20,
            fontColor: "#9e9e9e",
            beginAtZero:false,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: "rgba(225,78,202,0.1)",
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e",
          },
        },
      ],
    },
  },
};
const chartData4 =  {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: "Anomaly",
        fill: true,
        backgroundColor: "#2A3243",
        borderColor: "#00d6b4",
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: "#00d6b4",
        pointBorderColor: "rgba(255,255,255,0)",
        pointHoverBackgroundColor: "#00d6b4",
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: [],
      },
    ],
  },
  options: {
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true
      }
    },
    maintainAspectRatio: false,
    legend: {
      display: true,
      color:"green"
    },

    tooltips: {
      backgroundColor: "#f5f5f5",
      titleFontColor: "#333",
      bodyFontColor: "#666",
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest",
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: "rgba(29,140,248,0.0)",
            zeroLineColor: "transparent",
          },
          ticks: {
            // suggestedMin: 50,
            // suggestedMax: 125,
            // min:0,
            // max:1,
            padding: 20,
            fontColor: "#9e9e9e",
          },
        },
      ],

      xAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: "rgba(0,242,195,0.1)",
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e",
          },
        },
      ],
    },
  },
};
//Modal Funtion start

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStylesModal = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "400",
    backgroundColor: "#27293D",
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: "50px",
  },
}));

// modal funtion end

const columns = [
  { id: "TimeStamp", label: "TimeStamp", minWidth: 170 },
  { id: "CurrentValue", label: "ActualValue", minWidth: 100 },
  {
    id: "NextValue",
    label: "PredictedValue",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "nthStepValue",
    label: "nthStepValue",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {id:"err",
    label:"Accuracy %",
    minWidth:170,
    align:"right",
    format: (value) => value.toLocaleString("en-US"),
    },
];
const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  tableBody: {
    color: "white",
  },
  container: {
    maxHeight: "auto",
  },
});

const Dashboard = (props) => {
  const [initalState, setinitalState] = useState(0)
  const [talbeRows, setRows] = useState([]);
  const [tempRows,settempRows]=useState([])
  function addData11(chart, label, data,data2,data3) {
    // console.log("addData11")
    // chart.preventDefault()
    // console.log("addData1")
    chart.data.labels.push(label);
    chart.data.labels.push(label);
    
    // let arr=chart.data.labels
    // arr=[label,...arr]
    // chart.data.labels=arr
    // chart.data.datasets[0].data.push(data)
    // let arr2=chart.data.datasets[0].data
    // arr2=[data,...arr2]
    // chart.data.datasets[0].data=arr2
    // let arr3=chart.data.datasets[1].data
    // arr3=[data2,...arr3]
    // chart.data.datasets[1].data=arr3
    chart.data.datasets[0].data.push(data)
    // let arr=chart.data.datasets[0].data
    // let arr2=chart.data.datasets[1].data
    // chart.data.datasets[0].data=
    chart.data.datasets[1].data.push(data2)
    chart.data.datasets[1].data.push(data3)
    
    chart.update();
    // console.log("addData1")
    var min1 = Math.min.apply(null, chart.data.datasets[0].data.filter(Boolean));
    // let min1 = chart.data.datasets[0].data[1]
    var min2 = Math.min.apply(null, chart.data.datasets[1].data.filter(Boolean));
    // let min2 = chart.data.datasets[1].data[1]
    var max1 = chart.data.datasets[1].data[1]
    var max2 = chart.data.datasets[0].data[1]
    min1 = parseInt(min1) - 500;
    min2 = parseInt(min2) - 500;
    max1 = parseInt(max1) + 500;
    max2 = parseInt(max2) + 500;
    const min=Math.min(min1,min2)
    const max=Math.max(max1,max2)
    
    // chart.options.scales.yAxes.ticks.suggestedMin=min
    // chart.options.scales.yAxes.ticks.suggestedMax=max
    chart.options.scales.yAxes.ticks= {
      // suggestedMin: min,
      // suggestedMax: max,
      min:min,
      max:max,
      padding: 20,
      fontColor: "#9e9e9e",
      beginAtZero:false,
    }
    // chart.data.datasets.forEach((dataset) => {
    //   dataset.data.push(data);
    // });
    // chart.data.datasets[1].forEach((dataset) => {
    //   dataset.data.push(data2);
    // });
    chart.update();
    if (chart.data.labels.length === 15) {
      // chart.data.labels.pop();
      // chart.data.datasets.forEach((dataset) => {
        // dataset.data.pop();
      // });
      chart.data.labels.shift()
      chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
      });
      chart.update();
    }
  }
  function addData(chart, label, data) {
    // console.log("addData")
    // chart.preventDefault()
    
    chart.data.labels.push(label);
    // let arr=chart.data.labels
    // arr=[label,...arr]
    // chart.data.labels=arr
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
      // let arr2=dataset.data
      // arr2=[data,...arr2]
      // dataset.data=arr2
      
    });
    chart.update();
    var min1 = Math.min.apply(null, chart.data.datasets[0].data.filter(Boolean));

    // let min1 = chart.data.datasets[0].data[1]
    
    var max1 = chart.data.datasets[0].data[1]
    if(parseInt(max1)<1 && parseInt(min1)>0){
      min1 = 0;
    max1 = 1;
    }
    else{
    min1 = parseInt(min1) - 1000;
    max1 = parseInt(max1) + 1000;
    }
    // console.log(min1)
    // console.log(max1)
    
    chart.options.scales.yAxes.ticks= {
      // suggestedMin: min,
      // suggestedMax: max,
      min:min1,
      max:max1,
      padding: 20,
      fontColor: "#9e9e9e",
      beginAtZero:false,
    }
    chart.update();
    if (chart.data.labels.length === 15) {
      // chart.data.labels.pop();
      chart.data.labels.shift()
      chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
      });
      // chart.data.datasets[0].data.pop();
      chart.update();
    }

  }
  function addData1(chart, label, data,data2) {
    // console.log("addData1")
    // chart.preventDefault()
    // console.log("addData1")
    chart.data.labels.push(label);
    // chart.data.labels.push(label);
    // let arr=chart.data.labels
    // arr=[label,...arr]
    // chart.data.labels=arr
    // chart.data.datasets[0].data.push(data)
    // let arr2=chart.data.datasets[0].data
    // arr2=[data,...arr2]
    // chart.data.datasets[0].data=arr2
    // let arr3=chart.data.datasets[1].data
    // arr3=[data2,...arr3]
    // chart.data.datasets[1].data=arr3
    chart.data.datasets[0].data.push(data)
    // let arr=chart.data.datasets[0].data
    // let arr2=chart.data.datasets[1].data
    // chart.data.datasets[0].data=
    chart.data.datasets[1].data.push(data2)
    
    chart.update();
    // console.log("addData1")
    let min1 = Math.min.apply(null, chart.data.datasets[1].data.filter(Boolean));
    // let min1 = chart.data.datasets[0].data[1]
    // let min2 = Math.min.apply(null, chart.data.datasets[1].data.filter(Boolean));
    // let min2 = chart.data.datasets[1].data[1]
    // let max1 = chart.data.datasets[1].data[1]
    let max2 = chart.data.datasets[1].data[1]
    min1 = parseInt(min1) - 500;
    // min2 = parseInt(min2) - 500;
    // max1 = parseInt(max1) + 500;
    max2 = parseInt(max2) + 500;
    // const min=Math.min(min1,min2)
    // const max=Math.max(max1,max2)
    // console.log(min1,max2)
    
    // chart.options.scales.yAxes.ticks.suggestedMin=min
    // chart.options.scales.yAxes.ticks.suggestedMax=max
    chart.options.scales.yAxes.ticks= {
      // suggestedMin: min,
      // suggestedMax: max,
      min:min1,
      max:max2,
      padding: 20,
      fontColor: "#9e9e9e",
      beginAtZero:false,
    }
    // chart.data.datasets.forEach((dataset) => {
    //   dataset.data.push(data);
    // });
    // chart.data.datasets[1].forEach((dataset) => {
    //   dataset.data.push(data2);
    // });
    chart.update();
    if (chart.data.labels.length >= 15) {
      // chart.data.labels.pop();
      // chart.data.datasets.forEach((dataset) => {
        // dataset.data.pop();
      // });
      chart.data.labels.shift()
      chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
      });
      chart.update();
    }

  }
  function createData(TimeStamp, CurrentValue, NextValue, nthStepValue,err) {
    // const density = population / size;
    return { TimeStamp, CurrentValue, NextValue, nthStepValue ,err};
  }
   function AddRow(TimeStamp, CurrentValue, NextValue, nthStepValue,err) {
    //  console.log("AddRow")
    const row = createData(TimeStamp, CurrentValue, NextValue, nthStepValue,err)
    // const values = [...talbeRows]
    // values.push(row)
    
    // setRows(talbeRows=>talbeRows.concat(row))
    // setRows([row])
    setRows([row,...talbeRows]);
    // console.log(talbeRows)
    // settempRows([...talbeRows]);
    // console.log(talbeRows.length)
    // setRows((talbeRows)=>talbeRows.shift(row));
  } 
  function removeRows(){
    // console.log("removing data")
    setRows([])
  }
  function removeData(chart) {
    
    chart.data.labels=[]
    chart.data.datasets.forEach((dataset) => {
      dataset.data=[]
    });
    chart.update();
  }
  
  const [Chart1, setChart1] = useState();
  const [Chart2, setChart2] = useState();
  const [Chart3, setChart3] = useState();
  const [Chart4, setChart4] = useState();
  useEffect(() => {
    // console.log("creatingCharts")
    const myChartRef1 = chartRef1.current.getContext("2d");
    const ChartOne=new Chart(myChartRef1, {
        type: chartData1.type,
        data: chartData1.data,
        options: chartData1.options,
        // plugins:chartData.plugins
    })
    setChart1(ChartOne)
    const myChartRef2 = chartRef2.current.getContext("2d");
    const ChartTwo=new Chart(myChartRef2, {
        type: chartData2.type,
        data: chartData2.data,
        options: chartData2.options,
        // plugins:chartData.plugins
    })
    setChart2(ChartTwo)
    const myChartRef3 = chartRef3.current.getContext("2d");
    const ChartThree=new Chart(myChartRef3, {
        type: chartData3.type,
        data: chartData3.data,
        options: chartData3.options,
        // plugins:chartData.plugins
    })
    setChart3(ChartThree)
    const myChartRef4 = chartRef4.current.getContext("2d");
    const ChartFour=new Chart(myChartRef4, {
        type: chartData4.type,
        data: chartData4.data,
        options: chartData4.options,
        // plugins:chartData.plugins
    })
    setChart4(ChartFour)
    // RepeatedCalls
  }, [])
  const { category } = useSelector((state) => state.category);
  const { reload } = useSelector((state) => state.reload);
  // const { category } = useSelector((state) => console.log(state));

  // const [category, setcategory] = useState("");
  const { spike2 } = useSelector((state) => state.spike2);
  const { payload } = useSelector((state) => state.update);
  const { oneStep, anomalyScore, nthStep, inValue } = useSelector(
    (state) => state.oneStep
  );
  const {commerror}=useSelector((state)=>state.commerror)
  const { spikes } = useSelector((state) => state.spikesNotification);
  const { isLoading } = useSelector((state) => state.loading);
  const { isShowing } = useSelector((state) => state.showing);

  const dispatch = useDispatch();

  const [day, setDay] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const {update}=useSelector((state)=>state.update)

  
  useEffect(() => {
    
    if (spike2 === true && isShowing===false) {
      dispatch(showingAction(true))
      console.log("spiking!!!!!!!!!!!!!!!!")
      const newDate = new Date().toLocaleString();
      dispatch(addSpike(category.name, newDate));
      toast.info(category.name+" is in Spike", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        dispatch(showingAction(false))
        dispatch(spikeAction(false));
      }, 4500);
      
    }
    

  }, [spike2]);

  useEffect(() => {
    if (payload) {
      toast.info(`${payload}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [payload]);

  const { isLoad } = useSelector((state) => state.swarmingStatus);

  // const [ActiveValue, setActiveValue] = useState(0);
  // const [SoldValue, setSoldValue] = useState(0);
  // const [TrendValue, setTrendValue] = useState(0);
  // const [AnomalyValue, setAnomalyValue] = useState(0);
  // const [talbeRows, setRows] = useState([]);

  //Spike
  const [spike, setSpike] = useState("");
  const [FtVal, setFtVal] = useState("");
  const [inputFile, setinputFile]=useState("");
  //Spike end

  //SwarmingPersistance

  const { swarming } = useSelector((state) => state.swarming);
  const { persistence, persistenceDayEnd } = useSelector(
    (state) => state.persistance
  );
  //SwarmingPersistance End
  const { token } = useSelector((state) => state.token);

  // useEffect(() => {
  //   const clearLocalStorage = () => {
  //     localStorage.clear();
  //   };
  //   clearLocalStorage();
  // }, []);

  const Day = day * 24 * 60 * 60;
  const Hours = hours * 60 * 60;
  const Minutes = minutes * 60;
  const sum =
    parseInt(Day) + parseInt(Hours) + parseInt(Minutes) + parseInt(seconds) + 5;
  const duration = sum * 1000;
  // const counter=0;
  const RepeatedCalls = () => {
    token.forEach((element) => {
      clearInterval(element);
    });
    dispatch(setModalStatus(false));
    // console.log(category.name)
    dispatch(addCommerror(0))
    dispatch(addCategory(category.name, category.value));
    // dispatch(addCategoryValue(category.name, category.value));
    start_predication();
    dispatch(emptyData());
    dispatch(addCommerror(0));
    dispatch(oneStepAction(0));
    dispatch(AnomalyScoreAction(0));
    dispatch(nthStepAction(0));
    dispatch(inValueAction(0));
    removeData(Chart1);
    removeData(Chart2);
    removeData(Chart3);
    removeData(Chart4);
    removeRows();
    if (!persistence) {
      var stopGetLast = setInterval(() => {
        // get_last();
        // console.log(stopGetLast);
        dispatch(addToken(stopGetLast));
        localStorage.setItem(category.value, JSON.stringify(duration));
        // console.log(duration);
      }, parseInt(duration));
    } else if (persistence && parseInt(duration) < 600000) {
      toast.warn("Persistance is Selected this takes some time", {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 1,
      });
      const d2 = 600000 + 5000;
      localStorage.setItem(category.value, JSON.stringify(d2));
      var token2 = setInterval(() => {
        // console.log(token2);
        // get_last();
        dispatch(addToken(token2));
      }, parseInt(d2));
      dispatch(setPersistenceStatus(false));
    }
  };

  // const update_predication = async (e) => {
  //   let value1 = Input1;
  //   let value3 = Input3;
  //   let value4 = swarming;
  //   let value5 = persistence;
  //   let value6 = persistenceDayEnd;
  //   let value7 = "";

  //   if (spike === "MV") {
  //     value7 = spike;
  //   } else {
  //     value7 = FtVal;
  //   }
  //   // let value6 = persistenceDayEnd;
  //   // var value6=Sidebar.Input6.value;

  //   const todo = {
  //     Steps: value1.toString(),
  //     CategoryID: value3.toString(),
  //     IsSwaming: value4.toString(),
  //     day: parseInt(day),
  //     hours: parseInt(hours),
  //     minutes: parseInt(minutes),
  //     seconds: parseInt(seconds),
  //     IsPersistence: value5.toString(),
  //     IsDayPersistence: value6.toString(),
  //     Spike: value7.toString(),
  //   };

  //   console.log("todo", todo);

  //   await axios
  //     .post("http://192.168.1.111:5000/HTMConfUpdate", todo)
  //     .then((response) => {
  //       console.log("responses", response.data);
  //       // const newDate = moment(response.data.timeStmp).format("ddd, hA");
  //       // console.log(newDate);
  //       // // dispatch(setData(response.data));
  //     })
  //     .catch((error) => {
  //       console.log(error.response);
  //     });
  // };

  // function RepeatedCalls2() {
  //   token.forEach((element) => {
  //     clearInterval(element);
  //   });
  //   update_predication();
  // }

  const [Input1, setInput1] = useState(0);
  const [Input3, setInput3] = useState(0);

  const handleChange1 = (event) => {
    setInput1(event.target.value);
  };
    function handlefileChange(event) {
        // console.log(`Selected file - ${event.target.files[0].name}`);
        setinputFile(event.target.files[0].name)
        setInput3(event.target.files[0].name);
        // setcategory(event.target.files[0].name)
        // console.log(`Selected file - ${Input3}`);
        // console.log(`Selected file - ${inputFile.value}`);
      }
  // function handlefileChange(event) {
  //   console.log(`Selected file - ${event.target.files[0].name}`);
  //   setinputFile(event.target.files[0].name)
  //   setInput3(event.target.files[0].name);
  //   // setcategory(event.target.files[0].name)
  //   console.log(`Selected file - ${Input3}`);
  //   console.log(`Selected file - ${inputFile.value}`);
  // }
  // const handleChange8 = (event) => {
  //   setSwarmingStatusResult(event.target.value);
  // };
  // const handleChange9 = (event) => {
  //   setActiveValue(event.target.value);
  // };
  // const handleChange10 = (event) => {
  //   setSoldValue(event.target.value);
  // };
  // const handleChange11 = (event) => {
  //   setTrendValue(event.target.value);
  // };
  // const handleChange12 = (event) => {
  //   setAnomalyValue(event.target.value);
  // };
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const start_predication = async (e) => {
    let value1 = Input1;
    let value3 = Input3;
    let value4 = swarming;
    let value5 = persistence;
    let value6 = persistenceDayEnd;
    let value7 = "";

    if (spike === "MV") {
      value7 = spike;
    } else {
      value7 = FtVal;
    }

    const todo = {
      Steps: value1.toString(),
      CategoryID: value3.toString(),
      IsSwaming: value4.toString(),
      day: parseInt(day),
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: parseInt(seconds),
      IsPersistence: value5.toString(),
      IsDayPersistence: value6.toString(),
      Spike: value7.toString(),
    };
    // console.log("todo", todo);

    await axios
      .post("http://0.0.0.0:5000/HtmEbayStart", todo)
      .then((response) => console.log("responses", response.data))
      .catch((error) => console.log(error.response));
  };

  const get_last = async () => {
    
    if (category) {
      const CategoryID = "" + category.value;
      await axios
        .post("http://0.0.0.0:5000/HTMGetLast", {
          CategoryID: CategoryID,
        })
        .then((response) => {
          // console.log("responses", response.data);
          // AddRow(response.data.timeStamp, response.data.InValue, response.data.OneStep, response.data.nthStep)
          // addData1(Chart1, response.data.timeStamp, response.data.InValue,response.data.OneStep)
          // addData(Chart2,response.data.timeStamp,response.data.nthStep)
          // addData(Chart3, response.data.timeStamp, response.data.InValue)
          // addData(Chart4, response.data.timeStamp, response.data.AnomalyScore)
          // dispatch(AnomalyScoreAction(response.data.AnomalyScore));
          // dispatch(nthStepAction(response.data.nthStep));
          // dispatch(oneStepAction(response.data.OneStep));
          // dispatch(inValueAction(response.data.InValue));

          // let timeStamp = moment(response.data.timeStmp).format("ddd, hA");
          // dispatch(setData(response.data, timeStamp));
          // dispatch(swarmingStatusAction(response.data.SwarmingStatus));
          // dispatch(spikeAction(response.data.Spike));
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };

  //

  const { graphData } = useSelector((state) => state.data);

  //Modal
  const classes2 = useStylesModal();
  const [modalStyle] = React.useState(getModalStyle);
  const isOpen = useSelector((state) => state.modalOpen.isOpen);

  // modal end

  // Categories Dropdown
  const [search, setSearch] = useState("");
  const [searchCategories, setSearchCategories] = useState([]);
  function addDataToAll(timeStamp, InValue, OneStep, nthStep,SwarmingStatus,Spike,AnomalyScore){
    AddRow(timeStamp, InValue, OneStep, nthStep)
        addData1(Chart1, timeStamp, InValue,OneStep)
        addData(Chart2,timeStamp,nthStep)
        addData(Chart3, timeStamp, InValue)
        addData(Chart4, timeStamp, AnomalyScore)
        

        dispatch(AnomalyScoreAction(AnomalyScore));
          dispatch(nthStepAction(nthStep));
          dispatch(oneStepAction(OneStep));
          dispatch(inValueAction(InValue));
          // dispatch(setData(response, timeStamp));
          dispatch(swarmingStatusAction(SwarmingStatus));
          dispatch(spikeAction(Spike));
  }
  useEffect(() => {
    if (search.length === 0) {
      setSearchCategories(Categories);
    } else {
      let cat = Categories.filter((c) =>
        c.CategoryName.toString()
          .toLowerCase()
          .includes(search.toString().toLowerCase())
      );
      setSearchCategories(cat);
    }
  }, [search]);
  
//   useEffect(()=>{
//     if(category){
//       socket.removeAllListeners();
//       console.log(category.name)
      
//       socket.on("data", (response) => {
//         console.log(response)
      
//         if(response.Category===category.name){
//           console.log(category)
//           if(response.counter==1){
//             addData11(Chart1, response.timeStamp, response.InValue,response.OneStep,response.NextOneStep)
//           }
//           else{
//               // addDataToAll(response.timeStamp, response.InValue, response.OneStep, response.nthStep,response.SwarmingStatus,response.Spike,response.AnomalyScore)
//               // console.log("err",response.err)
//               AddRow(response.timeStamp, response.InValue, response.OneStep, response.nthStep,response.err)
//               addData1(Chart1, response.timeStamp, response.InValue,response.NextOneStep)
//               addData(Chart2,response.timeStamp,response.OneStep)
//               addData(Chart3, response.timeStamp, response.InValue)
//               addData(Chart4, response.timeStamp, response.AnomalyScore)
//               dispatch(addCommerror(response.CommError))
              

//               dispatch(AnomalyScoreAction(response.AnomalyScore));
//                 dispatch(nthStepAction(response.NextNthStep));
//                 console.log(response.NextNthStep)
//                 dispatch(oneStepAction(response.NextOneStep));
//                 dispatch(inValueAction(response.InValue));
//                 dispatch(setData(response, response.timeStamp));
//                 dispatch(swarmingStatusAction(response.SwarmingStatus));
//                 dispatch(spikeAction(response.Spike));
//                 console.log(response.InValue)
//                 console.log(response.Spike)
//                 console.log("showing",isShowing)
//                 console.log("update",payload)
//           }
//             }
//     })}
// },[category,Chart1,Chart2,Chart3,Chart4,talbeRows])
  // Categories Dropdown End
  useEffect(async () => {
    if(reload){
     dispatch(oneStepAction(0));
     removeRows();
            dispatch(AnomalyScoreAction(0));
            dispatch(AnomalyScoreAction(0));
            dispatch(nthStepAction(0));
            dispatch(inValueAction(0));
            dispatch(emptyData());
            dispatch(addCommerror(0))
            // dispatch(loadingAction(true));
            // console.log("reload",reload.name)
            removeData(Chart1);
            removeData(Chart2);
            removeData(Chart3);
            removeData(Chart4);
            
            
              await axios
                      .post("http://localhost:5000/HTMReload", {
                        CategoryID: category.name,
                      })
                      .then((res) => {
                        // console.log(res.data);
                        res.data.forEach((d) => {
                          let timeStamp = moment(d.timeStmp).format("ddd, hA");
                          AddRow(d.timeStamp, d.InValue, d.OneStep, d.nthStep,d.err)
                          addData1(Chart1, timeStamp, d.InValue,d.OneStep)
                          addData(Chart2,timeStamp,d.nthStep)
                          addData(Chart3, timeStamp, d.InValue)
                          addData(Chart4, timeStamp, d.AnomalyScore)

                          dispatch(AnomalyScoreAction(d.AnomalyScore));
                          dispatch(nthStepAction(d.nthStep));
                          dispatch(oneStepAction(d.OneStep));
                          dispatch(inValueAction(d.InValue));
                          // let timeStamp = moment(d.timeStmp).format("ddd, hA");
                          dispatch(setData(d, timeStamp));
                          // dispatch(loadingAction(false));
                        });
                        if (category) {
                          var duration = localStorage.getItem(category.name)
                            ? JSON.parse(localStorage.getItem(category.name))
                            : 5000;
                        }

                        // console.log(duration);
                        // const token = setInterval(() => {
                        //   dispatch(addToken(token));
                        //   get_last(c.value);
                        // }, parseInt(duration));
                      })
                      .catch((err) => console.log(err));
                    
      }},[reload])
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const max = graphData.reduce(
    (acc, data) => (acc = acc > parseInt(data.InValue) ? acc : data.InValue),
    0
  );
  const min = graphData.reduce(
    (acc, data) => (acc = acc < parseInt(data.InValue) ? acc : data.InValue),
    graphData.InValue
  );

  let min2 = parseInt(min) - 500;
  let max2 = parseInt(max) + 500;
  // console.log(max2, "max val");
  // console.log(min2, "min val");

  // const nthStepmax = graphData.reduce(
  //   (acc, data) => (acc = acc > parseInt(data.nthStep) ? acc : data.nthStep),
  //   0
  // );
  // const nthStepmin = graphData.reduce(
  //   (acc, data) => (acc = acc < parseInt(data.nthStep) ? acc : data.nthStep),
  //   graphData.nthStep
  // );

  // let nthmin2 = parseInt(nthStepmin) - 500;
  // let nthmax2 = parseInt(nthStepmax) + 500;
  // console.log(nthmax2);
  // console.log(max2, "max val");
  // console.log(min2, "min val");

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <CircularProgress />
        </div>
      ) : (
        <div className="content">
        <Col>
        
          <Row
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              textAlign: "center",
            }}
            className="text-center"
          >
            <Col>
              <Label
                style={{
                  textAlign: "center",
                  color: "#FFFFFF",
                  fontWeight: "bolder",
                  fontSize: "15px",
                }}
              >
                Swarming Status :
              </Label>
              <div style={{ color: "whitesmoke" }}>{isLoad}</div>
            </Col>
            {/* <Col md={4}>
              <div style={{ color: "whitesmoke" }}>{isLoad}</div>
              
            </Col> */}
            <Col> <h5 style={{
                  textAlign: "center",
                  color: "#FFFFFF",
                  fontWeight: "bolder",
                  fontSize: "15px",
                }}>Commulative Error %: </h5><h1 style={{ color: "#781D42" }}>{commerror}</h1></Col>
            <Col>
              <Button
                style={{ float: "right" }}
                variant="secondary"
                onClick={handleShow}
              >
                <FontAwesomeIcon icon={faBell} />
              </Button>

              <Modal2 show={show} onHide={handleClose} scrollable={true}>
                <Modal2.Header closeButton>
                  <Modal2.Title>Spike Logs</Modal2.Title>
                </Modal2.Header>
                <Modal2.Body>
                  {spikes &&
                    spikes.map((s) => (
                      <>
                        <div className="spikes Notification">{`${s.name} is in spike at ${s.time}`}</div>
                        <hr />
                      </>
                    ))}
                </Modal2.Body>
                <Modal2.Footer></Modal2.Footer>
              </Modal2>
            </Col>
          </Row>
          <Row>
          <Col> <h5 style={{ color: "whitesmoke" }}>Current Value</h5><h1 style={{ color: "#781D42" }}>{inValue}</h1> </Col>
          <Col> <h5 style={{ color: "whitesmoke" }}>Next Prediction</h5><h1 style={{ color: "#781D42" }}>{oneStep}</h1> </Col>
          <Col> <h5 style={{ color: "whitesmoke" }}>NthNext Prediction</h5><h1 style={{ color: "#781D42" }}>{nthStep}</h1> </Col>
        </Row>
          <Row>
            <Modal
              open={isOpen}
              onClose={() => dispatch(setModalStatus(!isOpen))}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div style={modalStyle} className={classes2.paper}>
                <Row>
                  <Col>
                    <FontAwesomeIcon
                      className="float-right"
                      icon={faTimes}
                      onClick={() => dispatch(setModalStatus(!isOpen))}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Label
                      style={{
                        color: "#FFFFFF",
                        marginLeft: "1rem",
                        marginRight: "1rem",
                      }}
                    >
                      {" "}
                      Steps
                      <InputGroupAddon addonType="prepend"></InputGroupAddon>
                      <Input
                        style={{ borderStyle: "solid" }}
                        placeholder="Input1"
                        value={Input1.value}
                        onChange={handleChange1}
                      />
                    </Label>
                  </Col>

                  <Col
                    md={6}
                    style={{
                      textAlign: "center",
                      display: "flex",
                      alignContent: "center",
                      marginTop: "15px",
                    }}
                  >
                    <Dropdown>
                      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        Spike {spike}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onSelect={() => setSpike("MV")}>
                          MV
                        </Dropdown.Item>
                        <Dropdown.Item onSelect={() => setSpike(`FT`)}>
                          FT
                        </Dropdown.Item>
                        <Dropdown.Item onSelect={() => setSpike("")}>
                          none
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  {spike === "FT" && (
                    <Input
                      onChange={(e) => setFtVal(e.target.value)}
                      type="text"
                      placeholder="FT: Num"
                    />
                  )}
                </Row>
                <Row className="d-flex">
                  <Col md={12}>
                    <Label
                      style={{
                        color: "#FFFFFF",
                        marginLeft: "1rem",
                        marginRight: "1rem",
                      }}
                    >
                      Duration
                      <Row>
                        <Col>
                        <Label>Days:</Label>
                          <Input
                            type="number"
                            placeholder="Days"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                          />
                        </Col>
                        <Col>
                        <Label>Hours:</Label>
                          <Input
                            type="number"
                            placeholder="Hours"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                          />
                        </Col>
                        <Col>
                        <Label>Minutes:</Label>
                          <Input
                            type="number"
                            placeholder="Minutes"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                          />
                        </Col>
                        <Col>
                        <Label>Seconds:</Label>
                          <Input
                            type="number"
                            placeholder="Seconds"
                            value={seconds}
                            onChange={(e) => setSeconds(e.target.value)}
                          />
                        </Col>
                      </Row>
                    </Label>
                  </Col>
                </Row>
                <Row
                  style={{
                    marginBottom: "20px",
                    marginTop: "20px",
                    textAlign: "center",
                  }}
                >
                  <Col md={4}>
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
                      ></Input>{" "}
                      Swarming
                    </Label>{" "}
                    &nbsp;&nbsp;&nbsp;
                  </Col>
                  <Col>
                  <label htmlFor="formId">Upload file:
                          <input id="fileSelect" type="file" accept=".csv"  id="formId" onChange={(event) => {
                            setSearch(path.basename(event.target.files[0].name,'.csv'));
                            // dispatch(
                            //   addCategory(
                            //     category.CategoryName,
                            //     category.CategoryID
                            //   )
                            // );
                            // alert(222)
                            dispatch(
                              addCategoryValue(
                                path.basename(event.target.files[0].name,'.csv'),
                                path.basename(event.target.files[0].name,'.csv')
                              )
                            );
                            setInput3(path.basename(event.target.files[0].name,'.csv'));
                          }}/>
                                       </label></Col>
                  
                </Row>
                
                <Row>
                  <Col className="text-center">
                    {" "}
                    <Button
                      style={{
                        float: "right",
                        marginTop: "20px",
                        padding: "15px 40px",
                      }}
                      variant="secondary"
                      type="submit"
                      value="Add Todo"
                      onClick={RepeatedCalls}
                    >
                      Start Prediction
                    </Button>
                  </Col>
                </Row>
              </div>
            </Modal>
            
            
              <Col xs="12">
                <Card className="card-chart">
                  <CardHeader>
                    <Row>
                      <Col className="text-left" sm="6">
                        {/* <h5 className="card-category">Active Listing</h5> */}
                        <CardTitle
                          tag="h2"
                          style={{ color: "whitesmoke" }}
                          
                          // value={oneStep}
                          // onChange={handleChange9}
                        >
                          {oneStep}
                          
                        </CardTitle>
                      </Col>
                      <Col>Actual Vs Predicted</Col>
                    </Row>
                  </CardHeader>

                  <CardBody>
                    <div style={{ height: 200 }}>
                    <canvas ref={chartRef1} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row></Row>
            <Row>
              <Col lg="12" md="12">
               <Card>
                    <CardHeader>
                    <CardTitle tag="h4">Data Table</CardTitle>
                    </CardHeader>
                    <CardBody>
                    <Paper className={classes.root} style={{ backgroundColor: "#27293D", color: "#FFFFFF" }} >
                    <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table" >
                    <TableHead>
                    <TableRow >
                    {columns.map((column) => (
                    <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, backgroundColor: "#27293D", color: "#FFFFFF" }}
                    >
                    {column.label}
                    </TableCell>
                    ))}
                    </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableBody}>
                     {talbeRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                    const value = row[column.id];
                    return (
                    <TableCell key={column.id} align={column.align} style={{ color: '#b3b3b3' }}>
                    {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                    );
                    })}
                    </TableRow>
                    );
                    })} 
                    </TableBody>
                    </Table>
                    </TableContainer>
                    <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={talbeRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    </Paper>
                    </CardBody>
                    </Card> 
                
              </Col>
            </Row>
            <Row>
            <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">PredictedTrend</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-bell-55 text-info" /> {oneStep}
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                <canvas ref={chartRef2} />
                  {/* <canvas id="mychart2"></canvas> */}
                  {/* <Line
                    // data={chartExample2.data.datasets}
                    data={chartExample2.data}
                    options={chartExample2.options}
                  /> */}
                </div>
              </CardBody>
            </Card>
              </Col>
              <Col lg="4">
                <Card className="card-chart">
                  <CardHeader>
                    <h5 className="card-category">ActualTrend</h5>
                    <CardTitle tag="h3">
                  <i className="tim-icons icon-bell-55 text-info" /> {inValue}
                </CardTitle>
                    
                  </CardHeader>
                  <CardBody>
                    <div className="chart-area">
                    <canvas ref={chartRef3} />
                    
                    </div>
                  </CardBody>
                </Card>
              </Col> 
              <Col lg="4">
                <Card className="card-chart">
                  <CardHeader>
                    <h5 className="card-category">Anomaly</h5>
                    <CardTitle tag="h3">
                      <i className="tim-icons icon-send text-success" />{anomalyScore}
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-area">
                    <canvas ref={chartRef4} />
                      {/* <canvas id="mychart4"></canvas> */}
                      {/* <Line
                        data={chartExample4.data}
                        options={chartExample4.options}
                      /> */}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
          {/* </Row> */}
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default Dashboard;
