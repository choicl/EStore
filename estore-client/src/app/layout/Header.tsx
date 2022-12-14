import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useStoreContext } from '../../context/StoreContext';

interface Props{
    darkMode:boolean;
    handleThemeChange: () => void;
}

const midLinks =[
    {title: 'catalog', path: '/catalog'},
    {title: 'about', path: '/about'},
    {title: 'contact', path: '/contact'}
]

const rightLinks=[
    {title: 'login', path: '/login'},
    {title: 'register', path: '/register'}
]
const navStyles = {
    color: 'inherit', 
    textDecoration: 'none',
    typography: 'h6',
    '&:hover' : {
        color: 'success.dark'
    },
    '&.active':{
        color: 'success.main'
    }
}

export default function Header({darkMode, handleThemeChange}: Props){
    const{basket} = useStoreContext();
    const itemCount = basket?.items.reduce((sum,item) => sum + item.quantity, 0);

    return(
        <AppBar position='static' sx ={{mb: 4}}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            
            <Box display='flex' alignItems='center'>
                <Typography variant='h6' 
                component={NavLink} 
                to='/' 
                sx={navStyles}>
                    ESTORE
                </Typography>
                <Switch checked={darkMode} onChange={handleThemeChange}/>
            </Box>
            
                <List sx={{display: 'flex'}}>
                    {midLinks.map(({title, path}) => (
                        <ListItem 
                        component={NavLink} 
                        to={path} 
                        key={path} 
                        sx={navStyles}>
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>
                
            <Box display='flex' alignItems='center'>
                <IconButton component={Link} to='/basket' size='large' sx={{color: 'inherit'}}>
                    <Badge badgeContent = {itemCount} color='secondary'>
                        <ShoppingCartRoundedIcon/>
                    </Badge>
                </IconButton>

                <List sx={{display: 'flex'}}>
                    {rightLinks.map(({title, path}) => (
                        <ListItem 
                        component={NavLink} 
                        to={path} 
                        key={path} 
                        sx={navStyles}>
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>
            </Box>

            </Toolbar>
        </AppBar>
    )
}