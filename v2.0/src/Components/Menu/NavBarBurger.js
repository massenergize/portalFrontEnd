import React from 'react'
import logo from '../../logo.svg';
import Dropdown from 'react-bootstrap/Dropdown'
import {Link} from 'react-router-dom'


class NavBarBurger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuBurgered: window.innerWidth < 992,
            menuOpen: false,
        }
        this.handleLinkClick = this.handleLinkClick.bind(this);
    }
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    handleResize = () => {
        this.setState({
            menuBurgered: window.innerWidth < 992
        })
        this.forceUpdate();
    };
    handleMenuClick() {
        this.setState({ menuOpen: !this.state.menuOpen });
    }
    handleLinkClick() {
        console.log("menuOpen: " + this.state.menuOpen);
        this.setState({ menuOpen: !this.state.menuOpen });
    }
    render() {
        const styles =
        {
            container: {
                position: 'relative',
                width: '100%',
                height: '80px',
                zIndex: '99',
                display: 'flex',
                background: 'white',
                color: '#333',
                fontFamily: 'Verdana',
            },
            body: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                filter: this.state.menuOpen ? 'blur(2px)' : null,
                transition: 'filter 0.5s ease',
            },
        }

        const menuItems = this.props.navLinks.map((val, index) => {
            if(val.children) {
                return (
                    <SubMenuItem navlink={val} index={index} clickHandler={this.handleLinkClick}></SubMenuItem>
                )
            }
            return (
                <MenuItem
                    key={index}
                    delay={`${index * 0.1}s`}
                    onClick={() => {this.handleLinkClick()}}
                    href={val.link}
                >
                    {val.name}
                </MenuItem>
            )
        });
        return (
            <nav className={`theme_menu navbar p-0 bg-white ${(this.props.sticky) ? "fixed-top border-bottom" : ""}`} style={{"height": "100px"}}>
                <div className="container">
                    <div className="row no-gutter width-100">
                        <div className="col-lg-2 col-md-3 col-sm-4 col d-flex align-items-center" >
                            <div className="main-logo col" >
                                <Link to="/"><img src={logo} alt="" /></Link>
                            </div>
                        </div>
                        {this.state.menuBurgered ?
                            <div className="col-lg-10 col-md-9 col-sm-8 col menu-column" >
                                <div style={styles.container}>
                                    <MenuButton open={this.state.menuOpen} onClick={() => this.handleMenuClick()} color='#333' />
                                    {this.renderLogin()}
                                </div>
                                <Menu open={this.state.menuOpen}>
                                    {/* {this.renderLayeredMenu(this.props.navLinks)} */}
                                    {menuItems}
                                    {/* <div style={{marginLeft: "1em"}}>
                                        <Menu open={true} submenu={true}>
                                            {menuItems}
                                        </Menu>
                                    </div> */}
                                </Menu>
                            </div>
                            :
                            <div className="col-xl-9 col-lg-10 col-md-8 col-sm-6 col-6 menu-column">
                                <div style={styles.container}>
                                    <nav className="menuzord d-flex ml-auto" style={{ display: 'inline-block' }} id="main_menu" >
                                        <ul className="menuzord-menu height-100 d-flex flex-row">
                                            {this.renderNavLinks(this.props.navLinks)}
                                        </ul>
                                    </nav>

                                    {this.renderLogin()}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </nav >
        )
    }
    renderNavLinks(navLinks) {
        if (!navLinks) {
            return <li>No PageLinks to Display</li>
        }
        return Object.keys(navLinks).map(key => {
            var navLink = navLinks[key];
            if(navLink.children) {
                return (
                    <li className="d-flex flex-column justify-content-center" key={navLink.name}>
                        <Dropdown onSelect={() => null}>
                            <Dropdown.Toggle as={CustomNavLink} navLink={navLink} id="dropdown-custom-components"></Dropdown.Toggle>
                            <Dropdown.Menu>
                                {this.renderDropdownItems(navLink.children)}
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                );
            }
            return <li className="d-flex flex-column justify-content-center" key={navLink.name}><Link to={navLink.link}>{navLink.name}</Link></li>
        });
    }
    renderDropdownItems(children) {
        return children.map((child) => {
            return (
                <Link to={child.link} className="dropdown-item p-2 pl-3 small" onClick={() => document.dispatchEvent(new MouseEvent('click'))}>{child.name}</Link>
            );
        });
    }
    renderLogin() {
        const {
            loggedIn,
            name
        } = this.props.userData
        if (loggedIn) {
            return (
                <Link style={{ color: "#8ec449", margin: 'auto 0 auto 10px', fontSize: '12px', display: 'inline-block' }}>
                    <i className="fa fa-user" />
                    Welcome: <br />
                    {name}
                </Link>
            );
        } else {
            return (
                <Link className="thm-btn float-right" to="/login" style={{ padding: '10px', margin: 'auto 0 auto 10px', fontSize: '12px' }}>
                    <i className="fa fa-user" style={{ padding: "0px 5px" }} />
                    Login
                </Link>
            );
        }
    }
} export default NavBarBurger;

/**
 * Renders one navlink and its menu underneath.
 * @props navlink: The navlink object and its children to render
 */
class SubMenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({open: !this.state.open});
    }

    renderSubmenuItems(items) {
        return items.map((item) => {
            return (
                <MenuItem
                    href={item.link}
                    onClick={this.props.clickHandler}
                >
                    {item.name}
                </MenuItem>
            )
        });
    }

    render() {
        return (
            <>
                <MenuItem
                    key={this.props.index}
                    delay={`${this.props.index * 0.1}s`}
                    onClick={this.handleClick}
                    href="#"
                >
                    {this.props.navlink.name}
                </MenuItem>
                <div style={{marginLeft: "1em"}}>
                    <Menu open={this.state.open} submenu={true}>
                        {this.renderSubmenuItems(this.props.navlink.children)}
                    </Menu>
                </div>
            </>
            )
    }
};

/* For Navbar Dropdown Link */
class CustomNavLink extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick(e) {
      e.preventDefault();
  
      this.props.onClick(e);
    }
  
    render() {
      return (
        // <li className="d-flex flex-column justify-content-center dropdown" key={this.props.navLink.name} onClick={this.handleClick}>
            <Link to="" onClick={this.handleClick}>{this.props.navLink.name} <span className="font-normal fa fa-angle-down"></span></Link>
        // </li>
      );
    }
  }

/* MenuItem.jsx*/
class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
        }
    }
    handleHover() {
        this.setState({ hover: !this.state.hover });
    }
    render() {
        const styles = {
            container: {
                animation: '1s appear backwards',
                animationDelay: this.props.delay,
            },
            menuItem: {
                color: this.state.hover ? '#8ec449' : '#303030',
                fontWeight: '700',
                fontFamily: "Verdana",
                fontSize: '1rem',
                padding: '.5rem 0',
                margin: '0 5%',
                cursor: 'pointer',
                transition: 'color 0.2s ease-in-out',
                animation: '0.5s slideIn forwards',
                animationDelay: this.props.delay,

            },
            line: {
                width: '90%',
                height: '1px',
                background: 'gray',
                margin: '0 auto',
                animation: '0.5s shrink forwards',
                animationDelay: this.props.delay,

            }
        }
        return (
            <div style={styles.container}>
                <Link
                    className="width-100"
                    style={styles.menuItem}
                    onMouseEnter={() => { this.handleHover(); }}
                    onMouseLeave={() => { this.handleHover(); }}
                    onClick={this.props.onClick}
                    to={this.props.href}
                >
                    {this.props.children}
                </Link>
                <div style={styles.line} />
            </div>
        )
    }
}

/* Menu.jsx */
class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open ? this.props.open : false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.open !== this.state.open) {
            this.setState({ open: nextProps.open });
        }
    }

    render() {
        const styles = {
            container: {
                position: 'absolute',
                width:'100%',
                height: this.state.open ? ((!this.props.submenu) ? '100vh' : "100%") : 0,
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
                color: 'black',
                transition: 'height 0.3s ease',
                zIndex: 2,
            },
            menuList: {
                paddingTop: (!this.props.submenu) ? '3rem' : "0",
            }
        }
        return (
            <div style={styles.container}>
                {
                    this.state.open ?
                        <div style={styles.menuList}>
                            {this.props.children}
                        </div> : null
                }
            </div>
        )
    }
}
/* MenuButton.jsx */
class MenuButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open ? this.props.open : false,
            color: this.props.color ? this.props.color : 'black',
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.open !== this.state.open) {
            this.setState({ open: nextProps.open });
        }
    }
    handleClick() {
        this.setState({ open: !this.state.open });
    }
    render() {
        const styles = {
            container: {
                justifyContent: 'flex-end',
                marginTop: 'auto',
                marginBottom: 'auto',
                marginLeft: 'auto',
                height: '32px',
                width: '32px',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: '4px',
            },
            line: {
                height: '2px',
                width: '29px',
                background: this.state.color,
                transition: 'all 0.2s ease',
            },
            lineTop: {
                transform: this.state.open ? 'rotate(45deg)' : 'none',
                transformOrigin: 'top left',
                marginBottom: '8px',
            },
            lineMiddle: {
                opacity: this.state.open ? 0 : 1,
                transform: this.state.open ? 'translateX(-16px)' : 'none',
            },
            lineBottom: {
                transform: this.state.open ? 'translateX(-1px) rotate(-45deg)' : 'none',
                transformOrigin: 'top left',
                marginTop: '8px',
            },
        }
        return (
            <div style={styles.container}
                onClick={this.props.onClick ? this.props.onClick :
                    () => { this.handleClick(); }}>
                <div style={{ ...styles.line, ...styles.lineTop }} />
                <div style={{ ...styles.line, ...styles.lineMiddle }} />
                <div style={{ ...styles.line, ...styles.lineBottom }} />
            </div>
        )
    }
}