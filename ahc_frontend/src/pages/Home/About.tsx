import {
  Box,
  Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import YoutubeEmbed from '../../components/YoutubeEmbed';

const About = () => {
  const about = ["AHC Experimentation Environments is a web based experimentation environment for teaching and learning distributed systems, networks and communication. It's an open source reasearch software framework that faciliates the developement of distributed algorithms on wireless networks considering the impairments of wireless channels.",
    'The overall goal of the AHC project is to develop an open-source education and research software framework that facilitates the development of distributed algorithms on wireless networks considering the impairments of wireless channels. The framework will be used as a learning and prompt-prototyping tool. The expected result will be published as open-source software for broad reach. The users of the AHC framework will be students, teachers, researchers and engineers working in the fields of digital communication, networking or distributed computing. The developed framework will be available to all these user groups as open-source software.'];

  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <YoutubeEmbed embedId="T5g3chxHJz8" />
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography component="h1" variant="h3" sx={{ color: `${blue[700]}` }}>
          AHC Experimentation Environment
        </Typography>
        <Typography component="h2" variant="h5" sx={{ maxWidth: '480px', color: `${blue[600]}` }}>
          Wireless Ad Hoc Cloud Computing, Learning and Experimentation Environment
        </Typography>
      </Box>
      <div>
        <Typography component="h3" variant="h4" sx={{ color: `${blue[700]}` }}>About</Typography>
        {about.map((text) => (
          <Typography key={text} component="p" variant="body1" sx={{ mt: 2 }}>
            {text}
          </Typography>
        ))}
      </div>
    </div>
  );
};

export default About;
