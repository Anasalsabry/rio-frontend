import React from "react";
import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import { UserList, UserEdit, UserCreate } from "./ra/Users";
import { CategoryList, CategoryEdit, CategoryCreate } from "./ra/Category";
import { ProductCreate, ProductEdit, ProductList } from "./ra/Products";
import { adminTheme } from "@/components/theme";
import {
  People as UsersIcon,
  Inventory as ProductsIcon,
  Class as CategoryIcon,
} from "@mui/icons-material/";
import JsonJwtProvider from "@/components/ra/dataProvider";
import Layout from "./ra/Layout";
import { ADMIN_SITE_TITLE } from "@/constants";

const AdminDashboard = () => {
  return (
    <Admin
      title={ADMIN_SITE_TITLE}
      dataProvider={JsonJwtProvider}
      theme={adminTheme}
      layout={Layout}
    >
      <Resource
        name="users"
        icon={UsersIcon}
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
        // delete={}
        // edit={EditGuesser}
        recordRepresentation="username"
      />
      <Resource
        recordRepresentation="title"
        name="categories"
        icon={CategoryIcon}
        list={CategoryList}
        edit={CategoryEdit}
        create={CategoryCreate}
      />
      <Resource
        name="products"
        icon={ProductsIcon}
        list={ProductList}
        edit={ProductEdit}
        create={ProductCreate}
      />
    </Admin>
  );
};

export default AdminDashboard;
