import { observer } from 'mobx-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, Card, CardContent, Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { RepositoryInfo } from '../../../stores/RepositoriesStore';
import TopologyConfig from './TopologyConfig';

const RepositoryConfig = observer(({ repository }: {repository: RepositoryInfo}) => {
  const [ahcYAMLContent, setAhcYAMLContent] = useState('Loading...');
  const [ahcYAMLContentEditing, setAhcYAMLContentEditing] = useState('Loading...');

  useEffect(() => {
    setAhcYAMLContentEditing(ahcYAMLContent);
  }, [ahcYAMLContent]);

  useEffect(() => {
    if (repository.upstream) {
      axios.get(`${repository.upstream.replace('github.com', 'raw.githubusercontent.com')}/main/ahc.yml`)
        .then((response) => setAhcYAMLContent(response.data))
        .catch(() => {
          axios.get(`${repository.upstream.replace('github.com', 'raw.githubusercontent.com')}/main/ahc.yaml`)
            .then((response) => setAhcYAMLContent(response.data))
            .catch(() => {
              axios.get(`${repository.upstream.replace('github.com', 'raw.githubusercontent.com')}/main/.ahc.yml`)
                .then((response) => setAhcYAMLContent(response.data))
                .catch(() => {
                  axios.get(`${repository.upstream.replace('github.com', 'raw.githubusercontent.com')}/main/.ahc.yaml`)
                    .then((response) => setAhcYAMLContent(response.data))
                    .catch(() => setAhcYAMLContent('Failed to fetch ahc.yml or .ahc.yml.'));
                });
            });
        });
    }
  }, [repository]);

  return (
    <div>
      <Typography component="h3" variant="h4" sx={{ my: 2, color: `${blue[700]}` }}>ahc.yml</Typography>
      <Card variant="outlined" sx={{ my: 2, backgroundColor: '#FDFCFD' }}>
        <CardContent sx={{ padding: '12px 20px' }}>
          <CodeEditor
            value={ahcYAMLContentEditing}
            language="yaml"
            placeholder="Please enter yaml code."
            onChange={(e) => setAhcYAMLContentEditing(e.target.value)}
            padding={15}
            style={{
              fontSize: 12,
              backgroundColor: '#f5f5f5',
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
          />
        </CardContent>
      </Card>
      <Button
        variant="contained"
        onClick={() => setAhcYAMLContent(ahcYAMLContentEditing)}
      >
        Display
      </Button>
      <TopologyConfig
        ahcYAML={ahcYAMLContent}
        ahcYAMLEditing={ahcYAMLContentEditing}
        setAhcYAML={setAhcYAMLContent}
      />
    </div>
  );
});

export default RepositoryConfig;
