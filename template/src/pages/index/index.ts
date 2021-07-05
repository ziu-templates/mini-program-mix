import "./style";
{{#if_eq type "weapp"}}
import { PageBase } from "mipp";
import { IData } from "../../typings/Data/Index.d";

export default class IndexController
  extends PageBase<IData>
  implements IMippWePage.ILifetime {

  data: IData = {
    welcomeStr: "Index Page",
  };

  onLoad(): void {
    console.log("onLoad: ", this);
  }
}
{{/if_eq}}
{{#if_eq type "aliapp"}}
import { PageBase } from "mipp-ali";
import { IData } from "../../typings/Data/Index.d";

class IndexController
  extends PageBase<IData>
  implements IMippAliPage.ILifetime
{

  data: IData = {
    welcomeStr: "Index Page",
  };

  onLoad(): void {
    console.log("onLoad: ", this);
  }
}
{{/if_eq}}

Page(new IndexController());
