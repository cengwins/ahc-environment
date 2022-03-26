import {
  ListItem, Typography,
} from '@mui/material';

const ProfileField = ({ title, value }: {title: string, value: string}) => (
  <ListItem>
    <Typography sx={{ mr: 1, fontWeight: 700 }}>{`${title}:`}</Typography>
    <Typography>{value}</Typography>
  </ListItem>
);

export default ProfileField;
