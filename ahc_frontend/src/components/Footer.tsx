import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FooterItem = ({ onClick, text } : {onClick: Function, text: string}) => (
  <li className="list-inline-item mx-2">
    <Button className="text-decoration-none" onClick={() => onClick()}>{text}</Button>
  </li>
);

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center pb-2 mt-auto">
      <ul className="list-inline">
        <FooterItem onClick={() => navigate('/')} text="Home" />
        <FooterItem onClick={() => navigate('/team')} text="Team" />
      </ul>
      <p className="copyright">bitiriyoruz © 2021</p>
    </div>
  );
};

export default Footer;
