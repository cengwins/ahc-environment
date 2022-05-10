/* eslint-disable react/jsx-filename-extension */
import {
  Card, CardContent, Grid, List, ListItem, ListItemIcon, ListItemText, Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import { useState } from 'react';
import Graph from 'react-graph-vis';
import { v4 } from 'uuid';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const TopologyConfig = () => {
  const [graph, setGraph] = useState({
    nodes: [
      {
        id: '1', label: 'Node 1', x: 100, y: 100,
      },
      {
        id: '2', label: 'Node 2', x: 100, y: 200,
      },
      {
        id: '3', label: 'Node 3', x: 200, y: 100,
      },
      {
        id: '4', label: 'Node 4', x: 200, y: 200,
      },
      {
        id: '5', label: 'Node 5', x: 300, y: 100,
      },
    ],
    edges: [
      { id: '1', from: 1, to: 2 },
      { id: '2', from: 1, to: 3 },
      { id: '3', from: 2, to: 4 },
      { id: '4', from: 2, to: 5 },
    ],
  });

  const getNodeLabel = (id) => {
    const node = graph.nodes.find((n) => n.id === id);
    return node ? node.label : id;
  };

  const options = {
    height: '600px',
    physics: {
      enabled: false,
    },
    manipulation: {
      enabled: true,
      initiallyActive: true,
      addNode: (data, callback) => {
        const nodes = [...graph.nodes, data];
        setGraph({
          nodes,
          edges: graph.edges,
        });
        callback(data);
      },
      addEdge: (data, callback) => {
        const edges = [...graph.edges, data];
        setGraph({
          nodes: graph.nodes,
          edges,
        });
        callback(data);
      },
      deleteNode: (data, callback) => {
        callback(data);
        setGraph({
          nodes: graph.nodes.filter((node) => !data.nodes.find((id) => id === node.id)),
          edges: graph.edges.filter((edge) => !data.nodes.find((id) => id === edge.id)),
        });
      },
      deleteEdge: (data, callback) => {
        callback(data);
        setGraph({
          nodes: graph.nodes,
          edges: graph.edges.filter((edge) => !data.edges.find((id) => id === edge.id)),
        });
      },
    },
    interaction: {
      dragView: false,
      zoomView: false,
    },
  };

  const events = {
    dragEnd: (event) => {
      if (!('nodes' in event)) {
        return;
      }
      const { nodes } = event;
      const newNode = {
        ...graph.nodes.find((node) => node.id === nodes[0]),
        x: event.pointer.canvas.x,
        y: event.pointer.canvas.y,
      };
      const newNodes = graph.nodes.map((node) => (node.id === newNode.id ? newNode : node));
      setGraph({
        nodes: newNodes,
        edges: graph.edges,
      });
    },
  };

  return (
    <div>
      <Typography component="h3" variant="h4" sx={{ my: 2, color: `${blue[700]}` }}>
        Topology
      </Typography>
      <Card variant="outlined" sx={{ my: 2, backgroundColor: '#FDFCFD' }}>
        <Graph
          key={v4()}
          graph={graph}
          options={options}
          events={events}
        />
      </Card>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography component="h5" variant="h5" sx={{ my: 2, color: `${blue[700]}` }}>
            Nodes
          </Typography>
          <Card variant="outlined" sx={{ my: 2, backgroundColor: '#FDFCFD' }}>
            <CardContent>
              <List dense>
                {graph.nodes.map((node) => (
                  <ListItem key={node.id}>
                    <ListItemIcon>
                      <ArrowForwardIosIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>
                      {node.label ?? node.id}
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Typography component="h5" variant="h5" sx={{ my: 2, color: `${blue[700]}` }}>
            Edges
          </Typography>
          <Card variant="outlined" sx={{ my: 2, backgroundColor: '#FDFCFD' }}>
            <CardContent>
              <List dense>
                {graph.edges.map((edge) => (
                  <ListItem key={edge.id}>
                    <ListItemIcon>
                      <ArrowForwardIosIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>
                      {`${getNodeLabel(edge.from)} -> ${getNodeLabel(edge.to)}`}
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default TopologyConfig;
