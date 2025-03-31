import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { initialNodes, initialLinks } from './config';


const InteractiveNetworkDiagram = () => {
  const svgRef = useRef(null);
  const linksRef = useRef([]);
  
  // Initialize nodes and links from config
  const [dimensions, setDimensions] = useState({ width: 900, height: 650 });
  const [nodes, setNodes] = useState(initialNodes);
  const [links, setLinks] = useState(initialLinks);

  // Label editing state
  const [editMode, setEditMode] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);
  const [labelText, setLabelText] = useState("");

  // Inside the component, add a state for the editor
  const [showEditor, setShowEditor] = useState(false);
  const [configText, setConfigText] = useState(
    JSON.stringify({ nodes: initialNodes, links: initialLinks }, null, 2)
  );
  
  // Add a function to handle configuration updates
  const updateConfigFromEditor = () => {
    try {
      const config = JSON.parse(configText);
      setNodes(config.nodes || []);
      setLinks(config.links || []);
      setShowEditor(false);
    } catch (error) {
      alert("Invalid JSON configuration: " + error.message);
    }
  };

  // ===== ADVANCED CUSTOMIZATION FUNCTIONS =====
  // Add these functions here for save/load functionality
  const saveLayout = () => {
    const positions = nodes.map(node => ({
      id: node.id,
      x: node.x,
      y: node.y
    }));
    const dataStr = JSON.stringify(positions);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'network-layout.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const loadLayout = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const positions = JSON.parse(e.target.result);
      setNodes(prevNodes => {
        return prevNodes.map(node => {
          const position = positions.find(pos => pos.id === node.id);
          if (position) {
            return {...node, x: position.x, y: position.y};
          }
          return node;
        });
      });
    };
    
    reader.readAsText(file);
  };
  
  const exportAsPNG = () => {
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    const img = new Image();
    img.onload = () => {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "network-diagram.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };
  // ===== END ADVANCED CUSTOMIZATION FUNCTIONS =====
  
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    
    // Clear SVG for rebuild
    svg.selectAll("*").remove();
    
    // Add background
    svg.append("rect")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("fill", "#f8f9fa")
      .attr("rx", 5)
      .attr("ry", 5);
      
    // Add title
    svg.append("text")
      .attr("x", dimensions.width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "22px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .text("Interactive Network Diagram - Drag Nodes to Reposition");
      
    // Add environment boxes
    svg.append("rect")
      .attr("x", 40)
      .attr("y", 70)
      .attr("width", 440)
      .attr("height", 490)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", "#E8F6FF")
      .attr("stroke", "#0099CC")
      .attr("stroke-width", 2);
      
    svg.append("text")
      .attr("x", 260)
      .attr("y", 95)
      .attr("text-anchor", "middle")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("fill", "#0070A0")
      .text("On-Premises Cyber Range");
      
    svg.append("rect")
      .attr("x", 550)
      .attr("y", 70)
      .attr("width", 300)
      .attr("height", 490)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", "#FFF9E8")
      .attr("stroke", "#FF9900")
      .attr("stroke-width", 2);
      
    svg.append("text")
      .attr("x", 700)
      .attr("y", 95)
      .attr("text-anchor", "middle")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("fill", "#D86B00")
      .text("AWS Cloud");
      
    // Draw subnet rectangles
    svg.append("rect")
      .attr("x", 60)
      .attr("y", 120)
      .attr("width", 220)
      .attr("height", 220)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", "#D1EDF8")
      .attr("stroke", "#0099CC")
      .attr("stroke-width", 1);
      
    svg.append("text")
      .attr("x", 170)
      .attr("y", 140)
      .attr("text-anchor", "middle")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#0070A0")
      .text("Servers");
      
    svg.append("text")
      .attr("x", 170)
      .attr("y", 158)
      .attr("text-anchor", "middle")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "12px")
      .attr("fill", "#0070A0")
      .text("172.16.2.0/24");
      
    svg.append("rect")
      .attr("x", 580)
      .attr("y", 200)
      .attr("width", 240)
      .attr("height", 320)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", "#FFE7C1")
      .attr("stroke", "#FF9900")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,2");
      
    svg.append("text")
      .attr("x", 700)
      .attr("y", 220)
      .attr("text-anchor", "middle")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "13px")
      .attr("font-weight", "bold")
      .attr("fill", "#D86B00")
      .text("Public Subnet (10.210.1.0/24)");
      
    // Add security group for HAProxy
    svg.append("rect")
      .attr("x", 595)
      .attr("y", 235)
      .attr("width", 210)
      .attr("height", 75)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", "#EE5A6A")
      .attr("opacity", 0.7);
      
    svg.append("text")
      .attr("x", 700)
      .attr("y", 255)
      .attr("text-anchor", "middle")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .text("Security Group - HAProxy");
      
    svg.append("text")
      .attr("x", 700)
      .attr("y", 273)
      .attr("text-anchor", "middle")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "white")
      .text("Inbound: Allow from 70.39.165.194/32");
    
    // Draw links
    const linkElements = svg.selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("stroke", d => d.type === 'internet' ? "#666" : d.type === 'guac' ? "#009966" : "#0099CC")
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
      .attr("stroke-dasharray", d => d.type === 'guac' ? "4,2" : "none");
      
    linksRef.current = linkElements;
    
    // Add the nodes with ability to drag
    const nodeGroups = svg.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded));
    
    // Draw different node types based on type property
    nodeGroups.each(function(d) {
      const node = d3.select(this);
      
      if (d.type === 'router') {
        // Router
        node.append("circle")
          .attr("r", 25)
          .attr("fill", "white")
          .attr("stroke", "#333")
          .attr("stroke-width", 1.5);
          
        node.append("path")
          .attr("d", "M 0 -15 L 0 15 M -15 0 L 15 0")
          .attr("stroke", "black")
          .attr("stroke-width", 2);
          
        node.append("circle")
          .attr("r", 20)
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 1.5);
          
      } else if (d.type === 'server') {
        // Server
        node.append("rect")
          .attr("x", -25)
          .attr("y", -20)
          .attr("width", 50)
          .attr("height", 45)
          .attr("fill", "black")
          .attr("stroke", "black")
          .attr("stroke-width", 2);
          
        node.append("rect")
          .attr("x", -25)
          .attr("y", -20)
          .attr("width", 50)
          .attr("height", 30)
          .attr("fill", "black");
          
        node.append("rect")
          .attr("x", -15)
          .attr("y", -15)
          .attr("width", 30)
          .attr("height", 20)
          .attr("fill", "#444");
          
        node.append("rect")
          .attr("x", -25)
          .attr("y", 10)
          .attr("width", 50)
          .attr("height", 10)
          .attr("fill", "black");
          
      } else if (d.type === 'firewall') {
        // Firewall
        node.append("rect")
          .attr("x", -30)
          .attr("y", -25)
          .attr("width", 60)
          .attr("height", 50)
          .attr("fill", "#333")
          .attr("stroke", "black")
          .attr("stroke-width", 1);
          
        // Create the firewall pattern
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 4; j++) {
            node.append("rect")
              .attr("x", -25 + i * 12)
              .attr("y", -20 + j * 10)
              .attr("width", 10)
              .attr("height", 5)
              .attr("fill", "white");
          }
        }
        
      } else if (d.type === 'gateway') {
        // Internet Gateway
        node.append("rect")
          .attr("x", -40)
          .attr("y", -20)
          .attr("width", 80)
          .attr("height", 40)
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("fill", "#FF9900");
          
      } else if (d.type === 'haproxy') {
        // HAProxy VM
        node.append("rect")
          .attr("x", -40)
          .attr("y", -25)
          .attr("width", 80)
          .attr("height", 50)
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("fill", "#996633");
          
        node.append("rect")
          .attr("x", -35)
          .attr("y", -20)
          .attr("width", 70)
          .attr("height", 40)
          .attr("rx", 3)
          .attr("ry", 3)
          .attr("fill", "#664422");
          
      } else if (d.type === 'vm') {
        // VM
        node.append("rect")
          .attr("x", -30)
          .attr("y", -20)
          .attr("width", 60)
          .attr("height", 40)
          .attr("rx", 3)
          .attr("ry", 3)
          .attr("fill", "#7EB26D");
          
        node.append("rect")
          .attr("x", -25)
          .attr("y", -15)
          .attr("width", 50)
          .attr("height", 30)
          .attr("rx", 2)
          .attr("ry", 2)
          .attr("fill", "#518D41");
      }
      
      // Add the active indicator
      node.append("circle")
        .attr("cx", 25)
        .attr("cy", 0)
        .attr("r", 6)
        .attr("fill", "#33CC66");


      // Add text labels with draggable capability
      const nameLabel = node.append("text")
        .attr("class", "node-label")
        .attr("y", d => d.labelOffsetY || 40)
        .attr("x", d => d.labelOffsetX || 0)
        .attr("text-anchor", "middle")
        .attr("font-family", "Arial, sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "#333")
        .text(d.name)
        .style("cursor", editMode ? "move" : "default")
        .on("dblclick", (event, d) => {
          if (editMode) {
            event.stopPropagation();
            setEditingLabel({id: d.id, property: "name"});
            setLabelText(d.name);
          }
        });
  
      const ipLabel = node.append("text")
        .attr("class", "ip-label")
        .attr("y", d => (d.labelOffsetY || 40) + 15)
        .attr("x", d => d.labelOffsetX || 0)
        .attr("text-anchor", "middle")
        .attr("font-family", "Arial, sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "#333")
        .text(d.ip)
        .style("cursor", editMode ? "move" : "default")
        .on("dblclick", (event, d) => {
          if (editMode) {
            event.stopPropagation();
            setEditingLabel({id: d.id, property: "ip"});
            setLabelText(d.ip);
        }
      });
  
      if (editMode) {
        // Make labels draggable only in edit mode
        nameLabel.call(d3.drag()
          .on("start", labelDragStarted)
          .on("drag", labelDragged)
          .on("end", labelDragEnded));
    
        ipLabel.call(d3.drag()
          .on("start", labelDragStarted)
          .on("drag", labelDragged)
          .on("end", labelDragEnded));
        }
      });
    
    
    // Add instructions text
    svg.append("text")
      .attr("x", dimensions.width / 2)
      .attr("y", dimensions.height - 20)
      .attr("text-anchor", "middle")
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "14px")
      .attr("font-style", "italic")
      .attr("fill", "#333")
      .text("Click and drag any node to reposition it");
    
    // Add legend
    const legend = svg.append("g")
      .attr("transform", "translate(40, 580)");
      
    const legendData = [
      { label: "Router", color: "#4CB8C4", type: "router" },
      { label: "Server", color: "#666666", type: "server" },
      { label: "Firewall", color: "#333333", type: "firewall" },
      { label: "AWS Gateway", color: "#FF9900", type: "gateway" },
      { label: "HAProxy", color: "#996633", type: "haproxy" },
      { label: "Virtual Machine", color: "#7EB26D", type: "vm" }
    ];
    
    const legendItems = legend.selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(${i * 140}, 0)`);
      
    legendItems.append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", d => d.color);
      
    legendItems.append("text")
      .attr("x", 25)
      .attr("y", 15)
      .attr("font-family", "Arial, sans-serif")
      .attr("font-size", "12px")
      .attr("fill", "#333")
      .text(d => d.label);
      
    // Function to update link positions when nodes are dragged
    function updateLinks() {
      linksRef.current
        .attr("d", d => {
          const source = nodes.find(node => node.id === d.source);
          const target = nodes.find(node => node.id === d.target);
          return `M${source.x},${source.y} L${target.x},${target.y}`;
        });
    }
    
    // Initial update of the links
    updateLinks();
    
    // Drag functions
    function dragStarted(event, d) {
      d3.select(this).raise().attr("stroke", "black");
    }
    
    // Add these label drag functions
    function labelDragStarted(event, d) {
      d3.select(this).raise().attr("stroke", "black");
    }

    function labelDragged(event, d) {
      // Calculate relative offset from the node
      const offsetX = event.x - d.x;
      const offsetY = event.y - d.y;
  
      // Update the node data
      setNodes(prevNodes => {
        const newNodes = [...prevNodes];
        const index = newNodes.findIndex(n => n.id === d.id);
        newNodes[index] = {
          ...newNodes[index],
          labelOffsetX: offsetX,
          labelOffsetY: offsetY
        };
        return newNodes;
      });
  
      // Move this specific label
      d3.select(this)
        .attr("x", offsetX)
        .attr("y", offsetY);
    }

    function labelDragEnded(event, d) {
      d3.select(this).attr("stroke", null);
    }

    function dragged(event, d) {
      // Update the node position
      d.x = Math.max(60, Math.min(dimensions.width - 60, event.x));
      d.y = Math.max(120, Math.min(dimensions.height - 100, event.y));
      
      // Update the visual position
      d3.select(this).attr("transform", `translate(${d.x}, ${d.y})`);
      
      // Update the links
      updateLinks();
      
      // Update node state
      setNodes(prevNodes => {
        const newNodes = [...prevNodes];
        const index = newNodes.findIndex(n => n.id === d.id);
        newNodes[index] = d;
        return newNodes;
      });
    }
    
    function dragEnded(event, d) {
      d3.select(this).attr("stroke", null);
    }
    
  }, [nodes, links, dimensions, editMode]);
  
  return (
    <div className="network-diagram-container w-full h-full flex flex-col items-center">
      {/* Add UI controls for advanced features */}
      <div className="mb-4 flex gap-4">
        <button 
          onClick={saveLayout}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Layout
        </button>
       
        {/* Add an "Edit Configuration" button */}
        <button 
          onClick={() => setShowEditor(!showEditor)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          {showEditor ? "Close Editor" : "Edit Configuration"}
        </button>
  
        {/* Add Edit Labels toggle button */}
        <button 
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-2 ${editMode ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded`}
        >
          {editMode ? 'Exit Label Edit Mode' : 'Edit Labels'}
        </button>
  
        <label className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
          Load Layout
          <input 
            type="file" 
            accept=".json" 
            onChange={loadLayout} 
            className="hidden" 
          />
        </label>
        
        <button 
          onClick={exportAsPNG}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Export as PNG
        </button>
      </div>
    
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="border rounded shadow-md"
      />
      
      {/* Modal for editing labels */}
      {editingLabel && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-10">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Label</h2>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setEditingLabel(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setNodes(prevNodes => {
                    const newNodes = [...prevNodes];
                    const index = newNodes.findIndex(n => n.id === editingLabel.id);
                    newNodes[index] = {
                      ...newNodes[index],
                      [editingLabel.property]: labelText
                    };
                    return newNodes;
                  });
                  setEditingLabel(null);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Show edit mode instructions when active */}
      {editMode && (
        <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded">
          <p><strong>Edit Mode Active:</strong> Double-click on a label to edit text. Drag labels to reposition.</p>
        </div>
      )}
  
      {/* Show configuration editor when active */}
      {showEditor && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-10">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Network Configuration</h2>
            <textarea
              className="w-full h-96 font-mono text-sm p-2 border rounded"
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={updateConfigFromEditor}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
  
      <div className="mt-4 text-sm text-gray-600">
        <p>Drag the nodes to reposition them and create the layout you prefer.</p>
      </div>
    </div>
  );
};

export default InteractiveNetworkDiagram;
