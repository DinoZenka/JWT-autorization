import { observer } from 'mobx-react-lite';
import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import { IUSer } from './models/User';
import UserSeevice from './services/UserService';

function App() {
  const {store} = useContext(Context);
  const [users, setUsers] = useState<IUSer[]>([]);
  const [isClear, setClear] = useState<boolean>(false);

  useEffect(()=>{
    if(localStorage.getItem('token')){
      store.checkAuth()
    }
  }, []);

  const getAllUsers = async ()=>{
    try {
        const responce = await UserSeevice.getAllUsers();
        setUsers(responce.data);
        setClear(true);
    } catch (error) {
      console.log(error);
    }
  }
  const clearList = () => {
    setUsers([]);
    setClear(false);
  }
  if(store.isLoading){
    return <h1>Loading ...</h1>
  }

  if(!store.isAuth){
    return (
      <LoginForm />
    )
  }

  return (
    <>
      <h1>{store.isAuth?`User autorized: ${store.user.email}`:'Need to be Autorized'}</h1> 
      <button onClick={()=>{store.logout()}}>Log out</button>
      <button onClick={getAllUsers}>get Users</button>
      {isClear && <button onClick={clearList}>Clear list</button>}
      {
        users.map(elem=>{
          return <div key={elem.email}>{elem.email}</div>
        })
      }
    </>
  );
}

export default observer(App);
