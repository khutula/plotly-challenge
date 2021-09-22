// Save filepath of json file
const url = "data/samples.json";

// Create data promise
const dataPromise = d3.json(url);

// access data in json file
d3.json(url).then(function(data) {

    // Save the test subject IDs as a variable
    var subjectIDs = data.names;

    // Loop through all subject IDs
    for (let i=0; i<subjectIDs.length; i++) {

        // Convert subject ID string to integer
        let subject = parseInt(subjectIDs[i]);

        // Add options for the drop down where text is the subject ID and value is the index
        d3.select("select").append("option").text(subject).attr("value", i);
    };
});

// Call function to create the initial plot with first test subject in list (index 0)
makePlot(0);

// Create change event for the drop down
d3.select("select").on("change", function() {

    // find index value of selected option
    let index = d3.select(this).property("value");

    // Call function to create new plots for newly selected test subject
    makePlot(index);
});

// Create function to create all plots and demographic info
function makePlot(index) {
    d3.json(url).then(function(data) {

        // DATA PREP
        // extract the sample values for selected subject
        let values = data.samples[index].sample_values;

        // create top 10 slice of values and reverse order for proper chart display
        let valueSlice = values.slice(0,10).reverse();

        // extract otu ids for selected subject
        let otuIDs = data.samples[index].otu_ids;
        
        // create top 10 slice of ids, make the id into a string, and reverse order for proper chart display
        let otuIDStrings = otuIDs.slice(0,10).map(function(item) {
            return `OTU ${item}`
        }).reverse();

        // extract otu labels for selected subject
        let labels = data.samples[index].otu_labels;

        // create top 10 slice of labels and reverse order for proper chart display
        let labelSlice = labels.slice(0,10).reverse();

        // extract demographic data for selected subject
        let demographic = data.metadata[index];

        // BAR CHART CREATION
        // Create trace for the horizontal bar chart
        let traceBar = [{
            x: valueSlice,
            y: otuIDStrings,
            text: labelSlice,
            type: "bar",
            orientation: "h"
        }];

        // Create layout for horizontal bar chart
        var layoutBar = {
            title: {
                text: "Top 10 OTUs",
                font: {size: 30}   
            },
            yaxis: {title: "OTU ID"},
            xaxis: {title: "Sample Values"}
        };

        // Insert horizontal bar chart at html element with bar as the id
        Plotly.newPlot("bar", traceBar, layoutBar);
        
        // DEMO INFO BLOCK CREATION
        // Select html element where metadata will go
        let demoInfo = d3.select("#sample-metadata");

        // Remove all spans and brs if they exist from previously selected subject
        demoInfo.selectAll("span").remove();
        demoInfo.selectAll("br").remove();

        // Loop through all demographic items in dictionary
        for (let i=0; i<Object.entries(demographic).length; i++) {

            // For each key value pair, create a span element and insert Key: Value and add a line break to the end
            demoInfo.append("span").text(`${Object.keys(demographic)[i]}: ${Object.values(demographic)[i]}`).append("br");
        };

        // BUBBLE CHART CREATION
        // Create trace for bubble chart
        let traceBubble = [{
            x: otuIDs,
            y: values,
            text: labels,
            mode: "markers",
            marker: {
                colorscale: 'Picnic',
                color: otuIDs,
                size: values
            }
        }];

        // Create layout for bubble chart
        var layoutBubble = {
            title: {
                text: "All OTUs Collected",
                font: {size: 30}
            },
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"}
        };

        // Insert bubble chart at html element with bubble as the id
        Plotly.newPlot("bubble", traceBubble, layoutBubble);

        // GAUGE CHART CREATION
        // Create trace for gauge chart
        let traceGauge = [{
            type: "indicator",
            mode: "gauge+number",
            title: { 
                text: "Scrubs per Week", font: { size: 15 } 
            },
            value: demographic.wfreq,
            gauge: {
                axis: { 
                    range: [0, 9], 
                    tickwidth: 2, 
                    tickcolor: "grey",
                    tickmode: "linear",
                },
                
                bar: { 
                    color: "orange", 
                    thickness: .75 
                },
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    {range: [0, 1], color: "#F8F3EC", line: {color:"gray", width: 2}},
                    {range: [1, 2], color: "#F4F1E5", line: {color:"gray", width: 2}},
                    {range: [2, 3], color: "#E9E6CA", line: {color:"gray", width: 2}},
                    {range: [3, 4], color: "#E2E4B1", line: {color:"gray", width: 2}},
                    {range: [4, 5], color: "#D5E49D", line: {color:"gray", width: 2}},
                    {range: [5, 6], color: "#B7CC92", line: {color:"gray", width: 2}},
                    {range: [6, 7], color: "#8CBF88", line: {color:"gray", width: 2}},
                    {range: [7, 8], color: "#8ABB8F", line: {color:"gray", width: 2}},
                    {range: [8, 9], color: "#85B48A", line: {color:"gray", width: 2}},
                ],
              }
            }
        ];          

        // Create layout for gauge chart
        var layoutGauge = {
            title: {
                text: "Belly Button Washing Frequency",
                font: {size: 30}   
            }
        };
        
        // Insert guage chart at html element with gauge as the id
        Plotly.newPlot('gauge', traceGauge, layoutGauge);
    });
};