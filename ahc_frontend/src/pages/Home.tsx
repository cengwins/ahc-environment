import {
  Container, List, ListItem, Stack,
} from '@mui/material';

const Home = () => {
  const text = 'The overall goal of the AHC project is to develop an open-source education and research software framework that facilitates the development of distributed algorithms on wireless networks considering the impairments of wireless channels. The framework will be used as a learning and prompt-prototyping tool. The expected result will be published as open-source software for broad reach. The users of the AHC framework will be students, teachers, researchers and engineers working in the fields of digital communication, networking or distributed computing. The developed framework will be available to all these user groups as open-source software.';

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
    <Container className="mt-5 text-start">
      <Stack direction="column" spacing={4} className="my-5">
        <div className="mb-4">
          <h1>AHC</h1>
          <h5 style={{ maxWidth: '480px' }}>
            Wireless Ad Hoc Cloud Computing, Learning and Experimentation Environment
          </h5>
        </div>
        <div>
          <h2 className="mb-3">About</h2>
          <p className="text-start">{text}</p>
        </div>
        <div>
          <h2 className="mb-3">Objectives</h2>
          <List className="text-start">
            {objectives.map((objective) => (
              <ListItem key={objective}>
                <span className="ms-4">{objective}</span>
              </ListItem>
            ))}
          </List>
        </div>
      </Stack>
    </Container>
  );
};

export default Home;
