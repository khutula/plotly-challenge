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

    console.log(index);

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

        Plotly.newPlot("bar", traceBar)

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

        Plotly.newPlot("bubble", traceBubble)
    });
};


