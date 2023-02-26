import React from "react";
import SuperTokens from "../superTokens";
import NormalisedURLPath from "supertokens-web-js/utils/normalisedURLPath";

export function RoutingComponent(props: { supertokensInstance: SuperTokens; path: string }): JSX.Element | null {
  // READCODE BURI ER3: see how args to this function is taken as props and it is passed all along. 
  const stInstance = props.supertokensInstance;
  const path = props.path;
  const componentToRender = React.useMemo(() => {
    // During development, this runs twice so as to warn devs of if there
    // are any side effects that happen here. So in tests, it will result in
    // the console log twice
    // READCODE BURI ER3: see we use path to get exact components and then render it finally.
    return stInstance.getMatchingComponentForRouteAndRecipeId(
      new NormalisedURLPath(path)
    );
  }, [stInstance, path]);

  const history = props.supertokensInstance
    .getReactRouterDomWithCustomHistory()
    ?.useHistoryCustom();

  if (componentToRender === undefined) {
    return null;
  }

  return <componentToRender.component history={history} />;
}
