import { ListDetailType } from "../../../Utils/Types";
import SettingsLinkHandler from "./link-handlers";

const SettingsDetail: React.FC<ListDetailType> = ({ context, item }) => {
  return item.key === "link-handlers" ? (
    <SettingsLinkHandler context={context} item={item} />
  ) : (
    <>Unknown page</>
  );
};

export default SettingsDetail;
