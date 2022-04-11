import {
  Grid, List, ListItem, Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';

const ListField = ({ title, value }: {title: string, value: any}) => (
  <ListItem sx={{ display: 'flex', width: '%100' }}>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography sx={{ color: grey[700] }}>{title}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>{value}</Typography>
      </Grid>
    </Grid>
  </ListItem>
);

const PropertyList = ({ properties } : {properties: {title: string, value: any}[]}) => (
  <List sx={{ width: '%100' }}>
    {properties.map(({ title, value }) => (<ListField key={title} title={title} value={value} />))}
  </List>
);

export default PropertyList;
