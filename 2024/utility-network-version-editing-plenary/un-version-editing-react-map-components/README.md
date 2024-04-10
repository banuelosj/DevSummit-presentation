# Utility Network Versioned Editing Plenary App built with Map components React using Vite template

📁 **[Click here to download this directory as a ZIP file](https://download-directory.github.io?url=https://github.com/Esri/arcgis-maps-sdk-javascript-samples-beta/tree/main/packages/map-components/templates/react)** 📁

This repository showcases how to use map components with [React](https://react.dev/).

## Get started

The project was created using [`yarn create vite`](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) with the [React template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react).

### Commands

Instructions for setup after you save this directory to your machine.

### Install dependencies

#### npm

```
npm install
```

### Dev

Start local server

#### npm

```
npm run dev
```

## Bring in your own data

This application REQUIRES that you plug in your own data for the application to run successfully. The following steps are necessary to bring in your own data. 

1. Set your portal url for `esriConfig.portalUrl = "https://myHostName.esri.com/portal";` in `ArcGISMap.jsx`.
2. Update the `webmapId` value in `ArcGISMap.jsx` to point to a webmap with your own data.
3. Set your own geodatabase version name for `setCurrentGDBVersion("owner.version_name")` to point to the version you wish to interact with in `ArcGISMap.jsx`. 
    - <i>Note: This is only necessary because the [`UtilityNetworkTrace](https://developers.arcgis.com/javascript/latest/components/storybook/?path=/docs/map-components_component-reference-utility-network-trace--docs) component still does not automatically react to a version change for the `UtilityNetwork.gdbVersion`.</i>
    - This will not be necessary ideally after version `4.30`.

### Additional Information about this application
- Utility network datasets are NOT necessary to use this application.
- [Branch-versioned](https://pro.arcgis.com/en/pro-app/latest/help/data/geodatabases/overview/branch-version-scenarios.htm) data is necessary to use this application. Branch-versioned data allows you to utilize the [Version Management component](https://developers.arcgis.com/javascript/latest/components/storybook/?path=/docs/map-components_component-reference-version-management--docs) and the [Editor component](https://developers.arcgis.com/javascript/latest/components/storybook/?path=/docs/map-components_component-reference-editor--docs) together.
- Loading a utility network dataset allows you to utilize the utility network rule based snapping feature, the [UtilityNetworkValidateTopology component](https://developers.arcgis.com/javascript/latest/components/storybook/?path=/docs/map-components_component-reference-utility-network-validate-topology--docs), and the [UtilityNetworkTrace component](https://developers.arcgis.com/javascript/latest/components/storybook/?path=/docs/map-components_component-reference-utility-network-trace--docs) in addition to the `VersionManagement` and `Editor` components.
- The `ValidateTopology` component requires that the webmap containing the utility network dataset also contains the [Dirty Areas](https://pro.arcgis.com/en/pro-app/latest/help/data/utility-network/dirty-areas-in-a-utility-network.htm) layer to perform validation.
- The `UtilityNetworkTrace` component requires that the utility network is published with [Named trace configurations](https://pro.arcgis.com/en/pro-app/latest/help/data/utility-network/about-trace-configurations.htm) to perform tracing.

## Learn More

You can learn more in the [Vite guides](https://vitejs.dev/guide/).

To learn React, check out the [React documentation](https://react.dev/).
