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
        let values = data.samples[index].sample_values.slice(0,10).reverse();

        let otuIDs = data.samples[index].otu_ids.slice(0,10).map(function(item) {
            return `OTU ${item}`
        }).reverse();

        let labels = data.samples[index].otu_labels.slice(0,10).reverse();

        let traceData = [{
            x: values,
            y: otuIDs,
            text: labels,
            type: "bar",
            orientation: "h"
        }];

        Plotly.newPlot("bar", traceData)
    });
};
