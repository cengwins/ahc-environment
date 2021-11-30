const FooterItem = ({ link, text } : {link: string, text: string}) => (
  <li className="list-inline-item mx-2"><a className="text-decoration-none" href={link}>{text}</a></li>
);

const Footer = () => (
  <div className="text-center pb-2 mt-auto">
    {/* <div className="social">
          <a href="#"><i className="icon ion-social-instagram" /></a>
          <a href="#"><i className="icon ion-social-snapchat" /></a>
          <a href="#"><i className="icon ion-social-twitter" /></a>
          <a href="#"><i className="icon ion-social-facebook" /></a>
        </div> */}
    <ul className="list-inline">
      <FooterItem link="/" text="Home" />
      <FooterItem link="/team" text="Team" />
    </ul>
    <p className="copyright">bitiriyoruz © 2021</p>
  </div>
);

export default Footer;
