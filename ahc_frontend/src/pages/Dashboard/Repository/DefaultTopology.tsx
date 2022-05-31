export default {
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
};
