/* eslint-disable react/jsx-filename-extension */
import {
  Card, CardContent, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography,
} from '@mui/material';
import { blue, red } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import Graph from 'react-graph-vis';
import { v4 } from 'uuid';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { load, dump } from 'js-yaml';
import AlertDialog from '../../../components/AlertDialog';

// eslint-disable-next-line react/prop-types
const TopologyConfigError = ({ text }) => (
  <div>
    <Typography component="h3" variant="h4" sx={{ my: 2, color: `${blue[700]}` }}>
      Topology
    </Typography>
    <Stack>
      <Typography alignSelf="center" component="h4" variant="h5" sx={{ my: 2, color: `${red[700]}` }}>
        {text}
      </Typography>
    </Stack>
  </div>
);

// eslint-disable-next-line react/prop-types
const TopologyConfig = ({ ahcYAML, ahcYAMLEditing, setAhcYAML }) => {
  let ahcJSON = null;

  const constructTopology = () => {
    try {
      ahcJSON = load(ahcYAML);
    } catch (e) {
      return null;
    }

    return {
      nodes: [],
      edges: [],
      ...ahcJSON.topology,
    };
  };

  const [topology, setTopology] = useState(constructTopology());
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    setTopology(constructTopology());
  }, [ahcYAML]);

  useEffect(() => {
    if (JSON.stringify(topology) === JSON.stringify(constructTopology())) return;
    if (ahcYAMLEditing !== ahcYAML) {
      setAlertOpen(true);
    } else {
      const currentAhcYAML = dump({ ...load(ahcYAML), topology });
      setAhcYAML(currentAhcYAML);
    }
  }, [topology]);

  const checkTopology = () => {
    const duplicateNodes = topology.nodes.map(
      ({ id }) => (topology.nodes.filter((k) => k.id === id)),
    ).flat();
    const duplicateEdges = topology.edges.map(
      ({ id }) => (topology.edges.filter((k) => k.id === id)),
    ).flat();

    return !(
      duplicateNodes.length > topology.nodes.length
      || duplicateEdges.length > topology.edges.length
    );
  };

  if (topology === null) {
    return <TopologyConfigError text="Error on parsing ahc.yaml file." />;
  } if (!checkTopology()) {
    return (
      <TopologyConfigError
        text="Error on topology configuration. Please check your topology configuration. There should be no nodes or edges with the same id."
      />
    );
  }

  const getNodeLabel = (id) => {
    const node = topology.nodes.find((n) => n.id === id);
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
        const nodes = [...topology.nodes, data];
        setTopology({
          nodes,
          edges: topology.edges,
        });
        callback(data);
      },
      addEdge: (data, callback) => {
        const edges = [...topology.edges, data];
        setTopology({
          nodes: topology.nodes,
          edges,
        });
        callback(data);
      },
      deleteNode: (data, callback) => {
        callback(data);
        setTopology({
          nodes: topology.nodes.filter((node) => !data.nodes.find((id) => id === node.id)),
          edges: topology.edges.filter((edge) => !data.nodes.find((id) => id === edge.id)),
        });
      },
      deleteEdge: (data, callback) => {
        callback(data);
        setTopology({
          nodes: topology.nodes,
          edges: topology.edges.filter((edge) => !data.edges.find((id) => id === edge.id)),
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
        ...topology.nodes.find((node) => node.id === nodes[0]),
        x: event.pointer.canvas.x,
        y: event.pointer.canvas.y,
      };
      const newNodes = topology.nodes.map((node) => (node.id === newNode.id ? newNode : node));
      setTopology({
        nodes: newNodes,
        edges: topology.edges,
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
          graph={topology}
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
                {topology.nodes.map((node) => (
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
                {topology.edges.map((edge) => (
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
      <AlertDialog
        open={alertOpen}
        title="Topology has been modified"
        text="Do you want to save your changes on the graph?"
        onYes={() => {
          setAlertOpen(false);
          const currentAhcYAML = dump({ ...load(ahcYAML), topology });
          setAhcYAML(currentAhcYAML);
        }}
        onNo={() => {
          setAlertOpen(false);
          setTopology(constructTopology());
        }}
      />
    </div>
  );
};

export default TopologyConfig;
