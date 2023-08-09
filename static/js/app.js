const url ="https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
const dataPromise = d3.json(url)
console.log(dataPromise);


function graphs(ids){
    
    //// uses variable ids based on what was chosen from the drop down
    //// retrieve the value from the specified samples dictionary
    ////returns a horizontal bar chart that displays top 10 sample_value and a bubble chart  
    
    d3.json(url).then(x =>{

        let samples = x.samples.filter((y) => y.id == ids)[0];
        console.log(samples);
      
        let otuIds = samples.otu_ids;
        console.log(otuIds);

        let values = samples.sample_values;
        console.log(values);

        let labels = samples.otu_labels;
        console.log(labels);

    // Plotting horizontal bar chart 

        let trace1 ={
            x: values.slice(0,10).reverse(),
            y: otuIds.slice(0,10).reverse().map((x) => `OTU ${x}`),
            text: labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };
        let layout ={
            height: 500,
            width: 600

        }
        let data = [trace1];
        Plotly.newPlot("bar", data, layout);

    // ploting bubble chart
        let trace2 ={
            x: otuIds,
            y: values,
            text: labels,
            mode: 'markers', 
            marker: {
                size: values,
                color: otuIds,
                colorscale: 'Earth' 
            }
             
        }
    
        let data2 = [trace2];

        let layout2 ={
            xaxis:{title:"OTU ID"},
            height: 500,
            width: window.width

        }

        Plotly.newPlot("bubble", data2, layout2);
    
    })
}


function demoGraphics(ids){
    
    //// uses variable ids based on what was chosen from the drop down
    //// grabs all the key value pairs from the specified metadata dictionay
    //// returns all information from the dictionary and displays it 

    d3.json(url).then(x =>{
        let metadata = x.metadata.filter((y) => y.id == ids)[0];
    
        console.log(metadata);
    
        
      
        Object.entries(metadata).forEach(([key, value]) =>{
            d3.select("#sample-metadata").append("div").text(`${key}: ${value}`);
        });
  

    })
    // refreshes the Demographic box 
    d3.select("#sample-metadata").html("");
}


function gauge (ids){

    //// uses variable ids based on what was chosen from the drop down menu
    //// grabs wfreq information from metadata dictionary 
    //// return a gauge chart 

    d3.json(url).then(x =>{
        let metadata = x.metadata.filter((y) => y.id == ids)[0];
        
        let frequency = metadata.wfreq
        console.log(frequency)
     
        var trace3 = {
            type: 'pie',
            showlegend: false,
            hole: 0.4,
            rotation: 90,
            values: [ 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
            text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
            direction: 'clockwise',
            textinfo: 'text',
            textposition: 'inside',
            hoverinfo: 'text',
            textfont:{color:"black"},
            marker: {
                colors: ["rgb(252, 252, 231)","rgb(229, 234, 209)","rgb(206, 216, 188)","rgb(181, 199, 169)","rgb(156, 182, 150)","rgb(131, 165, 134)","rgb(105, 148, 119)","rgb(77, 132, 105)","rgb(47, 116, 93)",'white'],
            }
        }

        // This shifts the arrow based on the wfreq
        if (frequency ==0){
            theta = 180
            console.log(theta)
        }  
        else{
            var theta = 190 - (frequency * 20)
            console.log(theta);
        }
        var r = 0.7
        
        // formula for the rotation for the arrow 
        var x_head = r * Math.cos(Math.PI/180*theta)
        var y_head = r * Math.sin(Math.PI/180*theta)

        var layout = {
            width: 700,
            height: 600, 
            xaxis: {range: [0, 1]},
            yaxis: {range: [0, 1]},
            howlegend: false,
            // creates the arrow
            annotations: [{
                ax: 0,
                ay: 0,
                axref: 'x',
                ayref: 'y',
                x: x_head,
                y: y_head,
                xref: 'x',
                yref: 'y',
                showarrow: true,
                arrowhead: 10,
                arrowsize: 1,
                arrowwidth: 3,
                arrowcolor: 'red'
                            
            }],
            title: "<b>Belly Button Washing Frequncy</b><br>Scrubs per Week",
            xaxis: {visible: false, range: [-1, 1]},
            yaxis: {visible: false, range: [-1, 1]}
        }
        var data = [trace3]
    
        Plotly.newPlot('gauge', data, layout);   
            
    

        
    })
}

function init(){

    //// setup all the default settings for all the charts and information displayed upon landing on the page and refresing 

    d3.json(url).then(x =>{
        let names = x.names;

        // setup dropdown menu
        d3.select("#selDataset").on("change", optionChanged);
        let dropDown = d3.selectAll("#selDataset");
        names.forEach((id) => {
             dropDown.append("option").text(id).property("value", id)})
        
        // default variable for all the charts and display information 
        let sample1 = (names[0]);
        graphs(sample1);
        demoGraphics(sample1);
        gauge(sample1)
    }); 
};
    


function optionChanged(sample2){
//// uses variable sample2 to pass to other functions in order to update everything based on the chosen value
    d3.json(url).then(x =>{
        let names = x.names;

        let dropDown = d3.select("#selDataset"); 
        let selectedOption = dropDown.property("value");
        let choice= names.forEach((id) => {
             dropDown.append("option").text(id).property("value", id)})

        let sample2 = selectedOption.filter ((y) => y == choice)
     
    }); 
        graphs(sample2);
        demoGraphics(sample2);
        gauge(sample2);     
}

// init function is called so that all default settings are displayed 
init();


