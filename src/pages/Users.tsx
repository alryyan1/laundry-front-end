import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  Box,
  Card,
  List,
  ListItem,
  ListItemText,
  FormGroup,
  FormControlLabel,
  ListItemButton,
} from '@mui/material';
import { Search } from 'lucide-react';
import { User } from '@/Types/types';
import { useUsersStore } from './usersStore';
import Grid from '@mui/material/Grid';
import { useForm } from 'react-hook-form';
import GeneralCheckboxUser from '@/components/GeneralCheckboxUser';
import axiosClient from '@/helpers/axios-client';

function Users() {
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const { users,addUser,fetchUsers,currentUser} = useUsersStore((state)=>state);
  const [updater, setUpdater] = useState(0);
  const [roles, setRoles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [open,setOpen] = useState(false)

   const {handleSubmit,formState:{errors},register }= useForm()
   const SubmitHandler = (data)=>{
    console.log(data)
    addUser(data)
   }

  const filteredUsers = users.filter(
    (user) =>
      user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) 
  );
  useEffect(()=>{
    fetchUsers()
  },[])
  useEffect(() => {
    axiosClient("routes").then(({ data }) => {
      setRoutes(data);
      console.log(data, "rouotes");
      //   setUpdater((prev)=>prev+1)
    });
  }, []);
  return (
    <Grid spacing={1} container sx={{ py: 4 }}>
      <Grid  xs={12} lg={3} item >
                <Typography textAlign={'center'} variant='h4'>Add User</Typography>

        <Card sx={{p:1}}>
            <form onSubmit={handleSubmit(SubmitHandler)}>
                <Stack gap={1} direction={'column'}>
                    <TextField label='name' {...register('name')}/>
                    <TextField label='username' {...register('username')}/>
                    <TextField label='password' {...register('password')}/>
                    <TextField label='confirm password' {...register('password_confirmation')}/>
                    <Button type='submit'>Add User</Button>
                </Stack>
            </form>
        </Card>

      
      </Grid>
      <Grid component={Card} sx={{p:1}} xs={12} lg={3} item>
      <Typography className='bg-slate-400 rounded-md' textAlign={'center'} variant='h4'> Users</Typography>

        <List >
          {filteredUsers.map((user) => (
            <ListItem className='hover:bg-amber-100' key={user.id}>
              <ListItemText primary={user.username} />
              <Button
                onClick={() => setSelectedUser(user)}
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
            </ListItem>
          ))}
        </List>
      </Grid>
     
      <Grid key={selectedUser?.id} item xs={2}>
        {selectedUser && (
          <Box sx={{ p: 1 }}>
            <Typography textAlign={"center"} variant="h5">
              User Routes {selectedUser.name}{" "}
            </Typography>
            <List>
              {routes.map((route) => {
                const checked = selectedUser.routes
                  .map((r) => r.route_id)
                  .includes(route.id);
                return (
                  <ListItem
                    onClick={() => {
                      setSelectedRoute(route);
                    }}
                    sx={{
                      backgroundColor: (theme) =>
                        selectedRoute?.id == route.id
                          ? theme.palette.warning.light
                          : "",
                    }}
                    secondaryAction={
                      <GeneralCheckboxUser
                        setSelectedUser={setSelectedUser}
                        selectedUser={selectedUser}
                        setUpdater={setUpdater}
                        route_id={route.id}
                        isChecked={checked}
                      />
                    }
                    key={route.route_id}
                  >
                    <ListItemButton
                      key={route.route_id}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <ListItemText>{route.name}</ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}
      </Grid>
      <Grid item xs={2}>
        {selectedUser && (
          <Box key={selectedUser.id} sx={{ p: 1 }}>
            <Typography textAlign={"center"} variant="h5">
              User sub Routes
            </Typography>
            <FormGroup>
              {selectedRoute?.sub_routes.map((route) => {
                console.log(route, "route check box");
                const checked = selectedUser.sub_routes
                  .map((r) => r.sub_route_id)
                  .includes(route.id);
                return (
                  <FormControlLabel
                    key={route.id}
                    control={
                      <GeneralCheckboxUser
                        setSelectedUser={setSelectedUser}
                        sub_route_id={route.id}
                        selectedUser={selectedUser}
                        setUpdater={setUpdater}
                        route_id={route.route_id}
                        isChecked={checked}
                        path="subRoutes"
                      />
                    }
                    label={route.name}
                  />
                );
              })}
            </FormGroup>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

export default Users;