// Example data
const data = {
    name: 'Root',
    children: [
        {
            name: 'Department 1',
            children: [
                { name: 'Team 1A', size: 10 },
                { name: 'Team 1B', size: 15 },
            ],
        },
        {
            name: 'Department 2',
            children: [
                { name: 'Team 2A', size: 20 },
                { name: 'Team 2B', size: 25 },
            ],
        },
    ],
};

// Set up dimensions for the chart
const width = window.innerWidth;
const height = window.innerHeight;

// Create the sunburst chart
const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

const color = d3.scaleOrdinal(d3.schemeCategory10);

const partition = d3.partition().size([2 * Math.PI, height / 2]);

const root = d3.hierarchy(data)
    .sum(d => d.size || 1);

partition(root);

const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1);

svg.selectAll('path')
    .data(root.descendants())
    .enter()
    .append('path')
    .attr('d', arc)
    .style('fill', d => color(d.data.name))
    .on('click', clicked);

function clicked(event, p) {
    svg.transition()
        .duration(750)
        .tween('scale', () => {
            const xd = d3.interpolate(x.domain(), [p.x0, p.x1]);
            const yd = d3.interpolate(y.domain(), [p.y0, 1]);
            const yr = d3.interpolate(y.range(), [p.y0 ? 20 : 0, radius]);
            return t => { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
        })
        .selectAll('path')
        .attrTween('d', d => () => arc(d));
}

// Add zoom capabilities
const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', zoomed);

svg.call(zoom);

function zoomed(event) {
    svg.attr('transform', event.transform);
}
