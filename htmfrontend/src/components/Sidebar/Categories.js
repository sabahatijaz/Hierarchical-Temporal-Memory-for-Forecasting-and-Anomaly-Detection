import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "reactstrap";
import { addCategoryValue } from "store/action/categoriesAction";
import { addToken } from "store/action/tokenAction";
import { setData } from "store/action/data";
import { emptyData } from "store/action/data";
import { swarmingStatusAction } from "store/action/swarmingStatusAction";
import { spikeAction } from "store/action/spikeAction";
import "./categories.css";
import moment from "moment";
import { AnomalyScoreAction } from "store/action/oneStepAction";
import { nthStepAction } from "store/action/oneStepAction";
import { oneStepAction } from "store/action/oneStepAction";
import { inValueAction } from "store/action/oneStepAction";
import { loadingAction } from "store/action/loadingAction";
import { addReload } from "store/action/reloadaction";

const Categories = () => {
  const { category } = useSelector((state) => state.category);
  const get_last = async (c) => {
    if (category) {
      const CategoryID = "" + c;
      await axios
        .post("http://localhost:5000/HTMGetLast", {
          CategoryID: CategoryID,
        })
        .then((response) => {
          console.log("responses Reload", response.data);
          dispatch(AnomalyScoreAction(response.data.AnomalyScore));
          dispatch(nthStepAction(response.data.nthStep));
          dispatch(oneStepAction(response.data.OneStep));
          dispatch(inValueAction(response.data.InValue));
          let timeStamp = moment(response.data.timeStmp).format("ddd, hA");
          dispatch(setData(response.data, timeStamp));
          dispatch(swarmingStatusAction(response.data.SwarmingStatus));
          dispatch(spikeAction(response.data.Spike));
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  };
  const { token } = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.categories);

  return (
    <div>
      <Label
        style={{
          color: "#FFFFFF",
          fontSize: "1rem",
          marginBottom: "20px",
          marginLeft: "10px",
        }}
        for="exampleSelect"
      >
        {" "}
        Running Models
      </Label>

      {categories.map((c, index) => (
        <div 
          
          key={index}
          className="category"
          
          onClick={async () => {
            dispatch(addCategoryValue(c.name, c.value));
            dispatch(addReload(c.name))

            if (token) {
              token.forEach((element) => {
                clearInterval(element);
              });
            }

           
            
          }}
          
        >
          <label class="btn btn-secondary active" style={{width:250}}>
          {c.name}
        </label>      
         
        </div>
      ))}
    </div>
  );
};

export default Categories;
