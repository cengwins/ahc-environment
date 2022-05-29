import {
  List,
  ListItem,
  Typography,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Objectives = () => {
  const objectives = [
    'Creating web-based education tools for teaching and learning distributed systems, networks, and communication.',
    'Abstraction of the intricate details of the digital communication discipline from networking or distributed computing domains.',
    'Creating easy-to-understand and accessible educational materials about wireless networks.',
    'Providing hands-on opportunities for learning these technologies, inside of the classroom and out.',
    'Facilitating a framework to invent new technologies.',
    'Improving existing open-source digital communications technologies.',
    'Creating a remote simulation environment by using web-based tools for getting more realistic, real-world experiment results.',
    'Creating simulation configurations dynamically so that users will be able to run simulations by meeting specific requirements of projects.',
  ];

  return (
    <div>
      <Typography component="h3" variant="h4" sx={{ mb: 2, color: `${blue[700]}` }}>Objectives</Typography>
      <List>
        {objectives.map((objective) => (
          <ListItem key={objective}>
            <ListItemIcon>
              <ArrowForwardIosIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography component="p" variant="body1">{objective}</Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Objectives;
