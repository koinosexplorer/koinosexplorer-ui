import Link from 'next/link';
import { Navbar, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// icons
import { faGithub } from '@fortawesome/free-brands-svg-icons'

function NavbarComponent() {
  return (
    <Navbar id="main-nav" expand="md">
      <nav className="container">
        <Navbar.Brand className="underline" >
          <Link href="/"> Koinos Explorer ( Testnet ) </Link>
        </Navbar.Brand>

        {/* <Nav className="mr-auto">
          <a href="https://github.com/koinosexplorer" rel="noreferrer" target="_blank">
            <FontAwesomeIcon icon={faGithub} size="2x" color="white" />
          </a>
        </Nav> */}
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link"> Blocks </Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse> */}
      </nav>
    </Navbar>
  )
}

export default NavbarComponent;

