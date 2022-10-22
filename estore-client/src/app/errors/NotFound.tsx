import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound(){
    return(
        <Container component={Paper} sx={{height: 20}}>
            <Typography gutterBottom variant='h3'>Couldn't find the page.</Typography>
            <Divider/>
            <Button fullWidth component={Link} to='/catalog'> Back to catalog</Button>
        </Container>
    )
}