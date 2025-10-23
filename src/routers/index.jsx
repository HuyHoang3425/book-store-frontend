import Slider from "../modules/client/components/Slider2";
import adminRoute from "./adminRouter";
import clientRoute from "./clientRouter";


export const routes = [
 clientRoute,
 ...adminRoute,
 {
  path:"*",
  element:<Slider/>
 }
];
