import { Feature } from "geojson";

import routes from "./muni_simple_routes.json";

export const routesHashmap = routes.features.reduce(
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

const routesList = Object.entries(routesHashmap).map(([route, features]) => {
  const name = features[0].properties?.route_title;
  return { route, name, features };
});

export default routesList;
