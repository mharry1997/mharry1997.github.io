/**
 * Welcome to the Looker Custom Visualization Builder! Please refer to the following resources 
 * to help you write your visualization:
 *  - API Documentation - https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md
 *  - Example Visualizations - https://github.com/looker/custom_visualizations_v2/tree/master/src/examples
 *  - How to use the CVB - https://developers.looker.com/marketplace/tutorials/about-custom-viz-builder
 **/

 const visObject = {
    /**
     * Configuration options for your visualization. In Looker, these show up in the vis editor
     * panel but here, you can just manually set your default values in the code.
     **/
   options: {
        widthForValue1: {
            type: "number",
            label: "Width (%)",
            default: 10,
            min: 0,
            max: 100,
            section: "First Value",
            order:1
          },
        textAlignForValue1: {
            type: "string",
            label: "Text alignment",
            display: "select",
            values: [
            {"Left": "left"},
            {"Center": "center"},
            {"Right": "right"}
            ],
            default: 'Left',
            section: "First Value",
            order:2
          },
        colorForValue1: {
            type: "string",
            label: "Colour",
            display: "color",
            default: "#0374da",
            section: "First Value",
            order: 3
        },
        varianceThreshold: {
            type: "number",
            label: "Variance Threshold",
            default: 5,
            min: 0,
            max: 100,
            section: "Second Value",
            order: 3
        },
        widthForValue2: {
            type: "number",
            label: "Width (%)",
            default: 33,
            min: 0,
            max: 100,
            section: "Second Value",
            order:1
          },
          textAlignForValue2: {
            type: "string",
            label: "Text alignment",
            display: "select",
            values: [
            {"Left": "left"},
            {"Center": "center"},
            {"Right": "right"}
            ],
            default: 'Left',
            section: "Second Value",
            order:2
          },
          widthForValue3: {
              type: "number",
              label: "Width (%)",
              default: 33,
              min: 0,
              max: 100,
              section: "Third Value",
              order:1
          },
          textAlignForValue3: {
              type: "string",
              label: "Text alignment",
              display: "select",
              values: [
              {"Left": "left"},
              {"Center": "center"},
              {"Right": "right"}
              ],
              default: 'Left',
              section: "Third Value",
              order:2
          }
        },
    
    /**
     * The create function gets called when the visualization is mounted but before any
     * data is passed to it.
     **/
       create: function(element, config){
           element.innerHTML = "<h1>Ready to render!</h1>";
       },
   
    /**
     * UpdateAsync is the function that gets called (potentially) multiple times. It receives
     * the data and should update the visualization with the new data.
     **/
     updateAsync: function(data, element, config, queryResponse, details, doneRendering){
        // Clear existing content
        element.innerHTML = "";
    
        var container = document.createElement("div");
        container.style.fontFamily = "'Roboto', sans-serif";
        container.style.display = "flex";
        container.style.justifyContent = "space-around";
        container.style.alignItems = "center";
        container.style.height = "100%";
    
        var rowData = data[0];
        var fields = Object.keys(rowData);
    
        // Extract the second and third values
        var value2 = parseFloat(rowData[fields[1]].value);
        var value3 = parseFloat(rowData[fields[2]].value);
        var varianceThreshold = parseFloat(config.varianceThreshold);
    
        fields.forEach(function(field, index) {
            var countDiv = document.createElement("div");
            var width = config[`widthForValue${index + 1}`] || 33;
            var textAlign = config[`textAlignForValue${index + 1}`] || "left";
            
            countDiv.style.textAlign = textAlign;
            countDiv.style.marginTop = "1.6%";
            countDiv.style.width = width + "%";
            countDiv.style.display = "flex";
            countDiv.style.flexDirection = "column";
            countDiv.style.justifyContent = "center";
            countDiv.style.position = "relative"; // Add this line

            var containerHeight = element.offsetHeight;
            var containerWidth = element.offsetWidth;
            var fontSize = Math.min(element.offsetWidth/40,element.offsetHeight/2);
    
            // // Adding the border, except for the last element
            // if (index < fields.length - 1) {
            //     countDiv.style.borderRight = "1px solid #D3D3D3";
            // }
    
            var fieldValue = document.createElement("h2");
            fieldValue.innerText = rowData[field].value;
            fieldValue.style.margin = "0";
            fieldValue.style.fontSize = fontSize + "px";
            fieldValue.style.padding = fontSize + "px";
    
            // Apply color logic
            if (index === 0) {
                fieldValue.style.color = config.colorForValue1;
            } else if (index === 1) {
                var variance = Math.abs(value3 - value2);
                if (value2 === value3) {
                    fieldValue.style.color = "green";
                } else if (variance <= varianceThreshold) {
                    fieldValue.style.color = "#FFBF00";
                } else {
                    fieldValue.style.color = "red";
                }
            } else {
                fieldValue.style.color = "black";
            }
    
            countDiv.appendChild(fieldValue);
            container.appendChild(countDiv);
        });
    
        element.appendChild(container);
        doneRendering();
    }
    
};

   
   looker.plugins.visualizations.add(visObject);