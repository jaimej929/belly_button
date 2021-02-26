// create the function that gets the data and creates the plots for the id 
function startPlot(id) {
    

    d3.json("data/samples.json").then((data)=> {
        console.log(data)

        let wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)

        // filter by id 
        let samples = data.samples.filter(s => s.id.toString() === id)[0];

        console.log(samples);

        // get only top 10 sample and place them in reverse
        let sampleValues = samples.sample_values.slice(0, 10).reverse();

        let idValues = (samples.otu_ids.slice(0, 10)).reverse();
        
        // get the otu id's to the desired form for the plot
        let idOtu = idValues.map(d => "OTU " + d)

        console.log(`OTU IDS: ${idOtu}`)

    
        let labels = samples.otu_labels.slice(0, 10);

        console.log(`Sample Values: ${sampleValues}`)
        console.log(`Id Values: ${idValues}`)

        
        // create trace variable for the plot
        let trace = {
            x: sampleValues,
            y: idOtu,
            text: labels,
            type:"bar",
            orientation: "h",
        };

        // create data variable
        let data1 = [trace];

        // create layout variable to set plots layout
        let layout1 = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 30,
                b: 20
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", data1, layout1);

        
        // create the trace for the bubble chart
        let trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };

        // set the layout for the bubble plot
        let layout2 = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1300
        };

        // create the data variable 
        let data2 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data2, layout2); 

        // create pie chart
        let tracePie = {
            labels: idOtu,
            values:sampleValues,
            type:"pie",
        }

        let datapie = [tracePie]
        
        
        Plotly.newPlot("gauge", datapie)

    });    
}
    
// create the function to get the necessary data
function getInf(id) {
    // read the json file to get data
    d3.json("data/samples.json").then((data)=> {
        
        // get the metadata info for the demographic panel
        let metadata = data.metadata;

        console.log(metadata)

        // filter info by id
        let result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select panel to put data
        let demographicInfo = d3.select("#sample-metadata");
        
        // empty info panel each time before getting new info
        demographicInfo.html("");

        // grab the necessary data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    startPlot(id);
    getInf(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    let dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("data/samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        startPlot(data.names[0]);
        getInf(data.names[0]);
    });
}

init();