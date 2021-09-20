const url = "data/samples.json";

const dataPromise = d3.json(url);

d3.json(url).then(function(data) {
    var subjectIDs = data.names;

    for (let i=0; i<subjectIDs.length; i++) {
        let subject = parseInt(subjectIDs[i]);

        d3.select("select").append("option").text(subject).attr("value", i);
    };
});

//d3.select("select").onchange = optionChanged(this);

makePlot(0);

d3.select("select").on("change", function() {
    let index = d3.select(this).property("value");

    makePlot(index);
});

function makePlot(index) {
    d3.json(url).then(function(data) {
        let values = data.samples[index].sample_values;

        let valueSlice = values.slice(0,10).reverse();

        let otuIDs = data.samples[index].otu_ids;

        let otuIDStrings = otuIDs.slice(0,10).map(function(item) {
            return `OTU ${item}`
        }).reverse();

        let labels = data.samples[index].otu_labels;

        let labelSlice = labels.slice(0,10).reverse();

        let traceBar = [{
            x: valueSlice,
            y: otuIDStrings,
            text: labelSlice,
            type: "bar",
            orientation: "h"
        }];

        var layoutBar = {
            title: {
                text: "Top 10 OTUs",
                font: {size: 30}   
            },
            yaxis: {title: "OTU ID"},
            xaxis: {title: "Sample Values"}
        };

        Plotly.newPlot("bar", traceBar, layoutBar);

        let demographic = data.metadata[index];
        
        let demoInfo = d3.select("#sample-metadata");

        demoInfo.selectAll("span").remove();
        demoInfo.selectAll("br").remove();

        for (let i=0; i<Object.entries(demographic).length; i++) {
            demoInfo.append("span").text(`${Object.keys(demographic)[i]}: ${Object.values(demographic)[i]}`).append("br");
        };

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

        var layoutBubble = {
            title: {
                text: "All OTUs Collected",
                font: {size: 30}
            },
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"}
        };

        Plotly.newPlot("bubble", traceBubble, layoutBubble);


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

        var layoutGauge = {
            title: {
                text: "Belly Button Washing Frequency",
                font: {size: 30}   
            }
        };
          
        Plotly.newPlot('gauge', traceGauge, layoutGauge);
    });
};


