import { useMediaQuery, Button } from "@mui/material";
import {
  BooleanField,
  Datagrid,
  DateField,
  EditButton,
  List,
  NumberField,
  SimpleList,
  TextField,
  BooleanInput,
  Edit,
  NumberInput,
  SimpleForm,
  TextInput,
  PasswordInput,
  useDataProvider,
  Toolbar,
  SaveButton,
  useRedirect,
  useNotify,
  Create,
  DeleteWithConfirmButton,
  useRecordContext,
} from "react-admin";
import { useFormContext } from "react-hook-form";

// const UserListFilter = [
//   <TextInput key={"search"} source="username" label="Search" alwaysOn />,
// ];
export const UserList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <List sx={{ yOverflow: "scroll" }}>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.username}
          tertiaryText={(record) => record.credit}
          secondaryText={(record) => record?.is_admin && "Admin"}
        ></SimpleList>
      ) : (
        <Datagrid bulkActionButtons={null}>
          <TextField source="id" />
          <TextField source="username" />
          {/* <DateField source="created_on" /> */}
          <NumberField source="credit" />
          <BooleanField source="is_admin" />
          <EditButton />
          <DeleteWithConfirmButton
            confirmContent="You will not be able to recover this record. Are you sure?"
            // translateOptions={{ name: record?.username }}
          />
        </Datagrid>
      )}
    </List>
  );
};
const UserEditToolbar = () => {
  const { setValue, getValues, watch } = useFormContext();
  const redirect = useRedirect();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const changePwAction = (e) => {
    const { id, new_password } = getValues();
    e.preventDefault();
    dataProvider
      .changepw(id, new_password)
      .then(({ data }) => {
        console.log(data);
        if (data.success) {
          notify("ra.notification.updated", {
            type: "success",
            messageArgs: { smart_count: 1 },
          });
          setValue("new_password", "");
          redirect(false);
        }
      })
      .catch((err) => {
        console.error(err);
        notify("ra.notification.item_doesnt_exist", {
          type: "error",
        });
        redirect(false);
      });
  };
  return (
    <Toolbar>
      <SaveButton />
      <SaveButton
        label="Change Password"
        type="button"
        variant="text"
        disabled={!Boolean(watch("new_password", false))}
        onClick={changePwAction}
      />
    </Toolbar>
  );
};

export const UserEdit = () => {
  return (
    <Edit transform={({ id, new_password, orders, ...data }) => data}>
      <SimpleForm toolbar={<UserEditToolbar />}>
        <TextInput source="id" disabled />
        {/* <DateInput source="created_on" disabled /> */}
        <TextInput source="username" />
        <NumberInput source="credit" />
        <BooleanInput source="is_admin" />
        <PasswordInput
          source="new_password"
          helperText="Leave empty if you don't want to change password"
        />
      </SimpleForm>
    </Edit>
  );
};

export const UserCreate = () => {
  return (
    <Create redirect="list">
      <SimpleForm>
        <TextInput source="username" />
        <PasswordInput source="password" />
        <NumberInput source="credit" />
        <BooleanInput source="is_admin" />
      </SimpleForm>
    </Create>
  );
};
