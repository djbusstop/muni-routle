import { Feature } from "geojson";

import routes from "./muni_simple_routes.json";

const routesHashmap = routes.features.reduce(
  (acc: Record<string, Feature[]>, feature) => {
    const routeName = feature.properties.route_name;
    if (routeName in acc) {
      return {
        ...acc,
        [routeName]: [...acc[routeName], feature as Feature],
      };
    } else {
      return {
        ...acc,
        [routeName]: [feature as Feature],
      };
    }
  },
  {}
);

export default routesHashmap;
