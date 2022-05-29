import {
  Typography,
  Grid,
  CardMedia,
  Card,
  CardContent,
} from '@mui/material';
import { blue } from '@mui/material/colors';

import {
  ClassroomManagementIcon, DetailedMetricsIcon, GitHubIntegrationIcon, TopologyManagementIcon,
} from '../../svgs/index';

const Features = () => {
  const features = [
    { svg: TopologyManagementIcon, title: 'Topology Management', description: 'Create and manage topologies. Make experiments on different topologies you build.' },
    { svg: DetailedMetricsIcon, title: 'Detailed Metrics', description: 'Get detailed metrics about your experiments. See your results clearly.' },
    { svg: ClassroomManagementIcon, title: 'Classroom Management', description: 'Create and manage classrooms. See how your participants are doing.' },
    { svg: GitHubIntegrationIcon, title: 'GitHub Integration', description: 'Get your projects from GitHub. See your metrics and chanages on your repositories.' },
  ];

  return (
    <div>
      <Typography component="h3" variant="h4" sx={{ mb: 2, color: `${blue[700]}` }}>Features</Typography>
      <Grid container spacing={2}>
        {features.map((feature) => (
          <Grid item xs={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                image={feature.svg}
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Features;
