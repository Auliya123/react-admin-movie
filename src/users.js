import React from 'react';
import { TextInput, SimpleForm, Create, PasswordInput, SelectInput, List, Datagrid,TextField, Edit, EditButton } from 'react-admin';


export const userCreate = props => (
  <Create {...props}>
    <SimpleForm>
    <TextInput label="name" source="name"/>
    <TextInput label="email" source="email" type="email"/>
    <PasswordInput label="password" source="password"/>
    <SelectInput label="role" source="role" choices={[
      { id: 'admin', name: 'Admin' },
      { id: 'user', name: 'user'},
    ]}/>
    </SimpleForm>
  </Create>
)

export const userEdit = props => (
  <Edit {...props}>
    <SimpleForm>
    <TextInput label="name" source="name"/>
    <TextInput label="email" source="email" type="email"/>
    <PasswordInput label="password" source="password"/>
    <SelectInput label="role" source="role" choices={[
      { id: 'admin', name: 'Admin' },
      { id: 'user', name: 'user'},
    ]}/>
    </SimpleForm>
  </Edit>
)

export const userList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id"/>
      <TextField source="name"/>
      <TextField source="email"/>
      <TextField source="password"/>
      <TextField source="role"/>
      <EditButton/>
    </Datagrid>
  </List>
)
