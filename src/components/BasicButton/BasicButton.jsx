import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function BasicButtons() {
    return (
      <Stack direction="row" spacing={2}>
        {/* <Button variant="contained">Contained</Button>
        <Button variant="contained" disabled>
          Disabled
        </Button> */}
        <Button variant="contained" href="#contained-buttons">
          Link
        </Button>
      </Stack>
    );
  }