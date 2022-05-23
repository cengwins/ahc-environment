import { observer } from 'mobx-react';
import { useState, useEffect } from 'react';
import {
  Button, Card, CardContent, Stack, Typography,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { RepositoryInfo } from '../../../stores/RepositoriesStore';
import TopologyConfig from './TopologyConfig';
import { useStores } from '../../../stores/MainStore';

const RepositoryConfig = observer(({ repository }: {repository: RepositoryInfo}) => {
  const { repositoriesStore } = useStores();
  const { currentAhcYAML } = repositoriesStore;
  const [ahcYAMLContent, setAhcYAMLContent] = useState<String | undefined>(currentAhcYAML === undefined ? 'Loading...' : currentAhcYAML);
  const [ahcYAMLContentEditing, setAhcYAMLContentEditing] = useState<String | undefined>('Loading...');

  useEffect(() => {
    setAhcYAMLContent(currentAhcYAML);
    setAhcYAMLContentEditing(currentAhcYAML);
  }, [currentAhcYAML]);

  useEffect(() => {
    setAhcYAMLContentEditing(ahcYAMLContent);
  }, [ahcYAMLContent]);

  useEffect(() => {
    repositoriesStore.getAhcYAML();
  }, [repository]);

  return (
    <div>
      <Typography component="h3" variant="h4" sx={{ my: 2, color: `${blue[700]}` }}>ahc.yml</Typography>
      <Card variant="outlined" sx={{ my: 2, backgroundColor: '#FDFCFD' }}>
        <CardContent sx={{ maxHeight: '70vh', overflow: 'scroll' }}>
          <CodeEditor
            value={ahcYAMLContentEditing === undefined ? 'Failed to fetch ahc.YAML' : ahcYAMLContentEditing as string}
            language="yaml"
            placeholder="Please enter yaml code."
            onChange={(e) => setAhcYAMLContentEditing(e.target.value)}
            padding={15}
            style={{
              fontSize: 18,
              backgroundColor: '#FDFCFD',
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
          />
        </CardContent>
      </Card>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={() => setAhcYAMLContent(ahcYAMLContentEditing)}
        >
          Display
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={() => (console.log('not implemented'))}
        >
          Save
        </Button>
      </Stack>
      <TopologyConfig
        ahcYAML={ahcYAMLContent}
        ahcYAMLEditing={ahcYAMLContentEditing}
        setAhcYAML={setAhcYAMLContent}
      />
    </div>
  );
});

export default RepositoryConfig;
