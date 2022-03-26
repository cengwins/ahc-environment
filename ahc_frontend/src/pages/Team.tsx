import {
  Card, CardContent, Grid, Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';

const MemberCard = (props : {member: {name: string, details: string, role: 'member' | 'supervisor'}}) => {
  const { member } = props;
  const { role, name, details } = member;
  const title = role === 'member' ? '' : 'Supervisor, ';
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant={role === 'supervisor' ? 'h4' : 'h6'} component="h2" sx={{ mb: 2, color: `${blue[800]}` }}>
          {`${title}${name}`}
        </Typography>
        <Typography component="span" sx={{ flexGrow: 1, alignSelf: 'center' }}>
          {details}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Team = () => {
  const supervisor = {
    name: 'Ertan Onur',
    details: 'Ertan Onur is a professor of computer engineering at Middle East Technical University, Ankara Turkey, and the founding director of the Wireless Systems, Networks and Cybersecurity Laboratory (WINS Lab). He received the B.Sc. degree in computer engineering from Ege University, Izmir, Turkey in 1997, and the M.Sc. and Ph.D. degrees in computer engineering from Bogazici University, Istanbul, Turkey in 2001 and 2007, respectively. During the M.Sc. and Ph.D. studies, he worked as a project leader at Global Bilgi, Istanbul, and as an R&D project manager at Argela Technologies, Istanbul. After obtaining his Ph.D. degree, he worked as an assistant professor at Delft University of Technology, Netherlands. From 2014 on, he is with Middle East Technical University, Turkey. Dr. Onur’s research interests are in the area of computer networks, wireless networks, and network security. He was a visiting professor at Stony Brook University in 2020 on a Fulbright award. He is a member of IEEE. ',
  };

  const members = [{
    name: 'Osman Ufuk Yagmur',
    details: 'Ufuk Yağmur is a senior computer engineering student at Middle East Technical University, Ankara Turkey. He has taken graduate courses such as Ad Hoc Computing, Wireless Networks and Distributed Computing. In addition, he is currently working on a 5G Network Slicing optimization research project. In this project, a conference paper was published and currently working on the extension of that paper. He had an internship in full-stack Web-App development and Cyber-Security.',
  },

  {
    name: 'Yiğitcan Uçan',
    details: 'Yiğitcan Uçan is a senior computer engineering student at Middle East Technical University, Ankara Turkey. He had several internships/experiences on web-based systems with various frontend and backend technologies. He’s also interested in networking technologies, and is currently taking the Distributed Computing Systems course in which the AHC library is being used.',
  },

  {
    name: 'Ozan Akın',
    details: 'Ozan Akın is a senior computer engineering student at Middle East Technical University, Ankara Turkey. He is interested in the topics networking, distributed-systems, cloud-computing, and language processors. He has been taking graduate courses to improve his knowledge in these subjects, such as Ad-Hoc Computing, Distributed Systems, and Language Processors at METU. He has been working as a backend developer and devops consultant for several companies for about three years. Also, he is currently in a 5G network slicing resource optimization research group.',
  },
  {
    name: 'Deniz Koluaçık',
    details: 'Deniz Koluaçık is a senior computer engineering student at Middle East Technical University, Ankara Turkey. They have internship experience in backend technologies and web application security.',
  },
  {
    name: 'Cenk Arda Yılmaz',
    details: 'Cenk Arda Yılmaz is a senior computer engineering student at Middle East Technical University, Ankara Turkey. He has internship experiences and projects on web applications, especially on server-side development using Python web frameworks such as Django and Flask.',
  },
  ];

  return (
    <div>
      <Typography component="h3" variant="h4" sx={{ mb: 2, color: `${blue[700]}` }}>Team</Typography>
      <MemberCard member={{ ...supervisor, role: 'supervisor' }} />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {members.map((member) => (
          <Grid item sm={6} md={4} key={member.name}>
            <MemberCard member={{ ...member, role: 'member' }} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Team;
