import { Grid } from "@material-ui/core";
import { AppContext } from "../../../..";

const GridItem: React.FC<{ context: AppContext }> = ({ context, children }) => {
  return <Grid item>{children}</Grid>;
};

export default GridItem;
