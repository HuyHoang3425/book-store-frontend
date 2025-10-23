import LayoutDefault from "../modules/client/layouts/LayoutDefault";
import Slider from "../modules/client/components/Slider";
import Slider2 from "../modules/client/components/Slider2";

const clientRoute = {
  path: "/",
  element: <LayoutDefault />,
  children: [
    {
      path: "comics",
      element: <Slider />,
    },
    {
      path: "novels",
      element:<Slider2 />
    },
  ],
};

export default clientRoute;
