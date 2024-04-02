require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend"
], (Map, SceneView, FeatureLayer, Legend) => {
    // step 1 - add the renderer
    const lowPolyRenderer = {
        type: "unique-value",
        field: "Cmn_Name",
        defaultSymbol: {
            type: "web-style",
            styleName: "EsriLowPolyVegetationStyle",
            name: "Sassafras"
        },
        uniqueValueInfos: [{
            value: "Flowering dogwood",
            symbol: {
                type: "web-style",
                styleName: "EsriLowPolyVegetationStyle",
                name: "Cornus"
            }
        },
        {
            value: "Eastern hemlock",
            symbol: {
                type: "web-style",
                styleName: "EsriLowPolyVegetationStyle",
                name: "Abies"
            }
        },
        {
            value: "Norway spruce",
            symbol: {
                type: "web-style",
                styleName: "EsriLowPolyVegetationStyle",
                name: "Picea"
            }
        },
        {
            value: "White oak",
            symbol: {
                type: "web-style",
                styleName: "EsriLowPolyVegetationStyle",
                name: "Quercus"
            }
        }
        ],
        label: "tree",
        // add visual variables to show height and carbon storage in color
        visualVariables: [
            {
                type: "size",
                axis: "height", // specify which axis to apply the data values to
                field: "Height",
                valueUnit: "feet",
            },
            {
                type: "color",
                field: "C_Storage", // Carbon storage
                stops: [
                    {
                        value: 0,
                        color: "#f7fcb9"
                    }, // features with zero carbon
                    {
                        value: 10000,
                        color: "#31a354"
                    } // features with 100000 carbon
                ],
                legendOptions: {
                    title: "Carbon Storage"
                }
            }
        ]
    };

    // step 2 - add labels
    const treeLabelClass = {
        labelPlacement: "above-center",
        labelExpressionInfo: {
            expression: "$feature.Cmn_Name"
        },
        where: "C_Storage > 10000",
        symbol: {
            type: "label-3d", // autocasts as new LabelSymbol3D()
            symbolLayers: [
                {
                    type: "text", // autocasts as new TextSymbol3DLayer()
                    material: { color: "black" },
                    halo: {
                        color: [255, 255, 255, 0.7],
                        size: 1.2
                    },
                    font: {
                        family: "Belleza" // This font will be loaded from https://static.arcgis.com/fonts
                    },
                    size: 14 // Larger font sizes will be prioritized when deconflicting labels
                }
            ],
            // Labels need a small vertical offset that will be used by the callout
            verticalOffset: {
                screenLength: 10,
                minWorldLength: 10
            },
            // The callout has to have a defined type (currently only line is possible)
            // The size, the color and the border color can be customized
            callout: {
                type: "line", // autocasts as new LineCallout3D()
                size: 0.5,
                color: [0, 0, 0],
                border: {
                    color: [255, 255, 255, 0.7]
                }
            }
        }
    }

    // step 3 - add popup
    const treePopupTemplate = {
        title: "{Cmn_Name}",
        content: [
            {
                type: "text",
                text: "<i>{Sci_Name}</i><br>" +
                    "This tree is in <b>{Condition}</b> condition and is {Height} feet in height.",
            },
            {
                type: "media",
                mediaInfos: [
                    {
                        type: "image",
                        value: {
                            sourceURL:
                                "pics/{Cmn_Name}.jpeg"
                        }
                    }
                ]
            }
        ]
    }


    const treesLayer = new FeatureLayer({
        portalItem: {
            id: "0235b1d4d4974941b7a4615735643e33"
        },
        outFields: ["*"],
        title: "Landscape Trees",
        // step 1 - Add 3D renderer
        renderer: lowPolyRenderer,
        // step 2 - Add labels
        labelingInfo: [treeLabelClass],
        // step 3 - Add popup
        popupTemplate: treePopupTemplate,

    });

    const map = new Map({
        basemap: "topo-3d",
        ground: "world-elevation",
        layers: [treesLayer]
    });

    // Step 0 - scene view
    const view = new SceneView({
        container: "viewDiv",
        map: map,
        popup: {
            dockEnabled: true,
            dockOptions: {
                buttonEnabled: false,
                position: "top-right",
                breakpoint: false
            },
            visibleElements: {
                closeButton: false,
                collapseButton: false,
                actionBar: false
            }
        },
        camera: {
            position: {
                x: -9177356,
                y: 4246783,
                z: 723,
                spatialReference: {
                    wkid: 3857
                }
            },
            heading: 0,
            tilt: 83
        },
        environment: {
            weather: {
                type: "cloudy",
                cloudCover: 0.3
            }
        }
    });

    const legend = new Legend({
        view: view,
    });
    view.ui.add(legend, "bottom-left");
});