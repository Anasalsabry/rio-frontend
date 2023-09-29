import {
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  List,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
} from "react-admin";

export const CategoryList = () => (
  <List>
    <Datagrid bulkActionButtons={null}>
      <TextField source="id" />
      <TextField source="title" />
      <EditButton />
      <DeleteWithConfirmButton confirmContent="You will not be able to recover this record. Are you sure?" />
    </Datagrid>
  </List>
);

export const CategoryEdit = () => (
  <Edit transform={({ id, ...data }) => data}>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="title" />
    </SimpleForm>
  </Edit>
);

export const CategoryCreate = () => (
  <Create redirect="list">
    <SimpleForm>
      <TextInput source="title" />
    </SimpleForm>
  </Create>
);
