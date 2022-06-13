import * as React from 'react';
import { XTerm } from 'xterm-for-react';

const ExperimentTerminal = () => {
  const xtermRef = React.useRef(null);

  React.useEffect(() => {
    if (xtermRef.current) {
      (xtermRef.current as any).terminal.writeln('Hello, World!');
    }
  }, []);

  return (
    <XTerm ref={xtermRef} />
  );
};

export default ExperimentTerminal;
