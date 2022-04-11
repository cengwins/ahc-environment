import { useState } from 'react';
import {
  Typography, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RunInfo } from '../../../stores/ExperimentStore';
import PropertyList from '../../../components/PropertyList';

const RunDetails = ({ run }: {run:RunInfo}) => {
  const properties: {title: string, value: any}[] = [
    {
      title: 'Started at',
      value: `${new Date(run.started_at).toLocaleDateString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}`,
    },
    {
      title: 'Finished at',
      value: `${new Date(run.finished_at).toLocaleDateString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}`,
    },
  ];

  return (
    <div>
      <PropertyList properties={properties} />
    </div>
  );
};

const RunsAccordion = ({ runs }: {runs: RunInfo[]}) => {
  const [open, setOpen] = useState<number | false>(false);

  return (
    <div>
      {runs.map((run, i) => (
        <Accordion
          key={run.id}
          expanded={open === i}
          onChange={() => {
            if (open === i) setOpen(false);
            else setOpen(i);
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{`Run #${run.sequence_id}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RunDetails run={run} />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default RunsAccordion;
