import {
  BooleanField,
  Datagrid,
  DateField,
  ImageField,
  List,
  NumberField,
  TextField,
  EditButton,
  BooleanInput,
  Edit,
  NumberInput,
  SimpleForm,
  TextInput,
  ImageInput,
  FunctionField,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  required,
  ArrayInput,
  SimpleFormIterator,
  TabbedForm,
  useDataProvider,
  Toolbar,
  SaveButton,
  useRedirect,
  useNotify,
  DeleteWithConfirmButton,
  SimpleList,
  Create,
  Button,
  useRefresh,
  // WithRecord,
  useRecordContext,
  Confirm,
} from "react-admin";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import {
  useMediaQuery,
  Modal,
  Typography,
  Box,
  Switch,
  InputLabel,
  TableContainer,
  Paper,
  Input,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TextField as MuiTextField,
} from "@mui/material";
import {
  PlaylistAdd as BatchAddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
} from "@mui/icons-material/";
import { useState, useEffect } from "react";

export const ProductList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          tertiaryText={(record) => `$${record.price}`}
          secondaryText={(record) => record?.category?.title}
        ></SimpleList>
      ) : (
        <Datagrid bulkActionButtons={null}>
          <TextField source="id" />
          <TextField source="name" />
          <ReferenceField
            label="Category"
            source="category.id"
            reference="categories"
          >
            <FunctionField render={(record) => record && `${record.title}`} />
          </ReferenceField>
          <NumberField
            source="price"
            options={{ style: "currency", currency: "USD" }}
          />
          <ImageField
            source="image_url"
            title="Product Image"
            sx={{
              maxWidth: "50px",
              "& img": { maxWidth: 50, maxHeight: 50, objectFit: "contain" },
            }}
          />
          <DateField source="created_on" />
          <NumberField source="count" label="In Stock" />
          <NumberField source="sold_count" label="Sold" />
          <BooleanField source="hidden" />
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

const ProductEditToolbar = ({ isDirty, getValues, ...props }) => {
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const notify = useNotify();
  const { getValues: getIDVal } = useFormContext();

  const isTabIndex = (idx) =>
    document.location.hash.split("/").length > 3 &&
    document.location.hash.split("/").at(-1) === `${idx}`;
  const createInstances = (e) => {
    e.preventDefault();
    const { instances } = getValues();
    const { id } = getIDVal();
    dataProvider
      .createProductInstances(
        id,
        instances.map((instance) => ({ ...instance, id: instance?.iid }))
      )
      .then(({ data }) => {
        if (data.success) {
          notify("ra.notification.updated", {
            type: "success",
            messageArgs: { smart_count: 1 },
          });
          redirect("list", "products");
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
    <Toolbar {...props}>
      {isTabIndex(1) ? (
        <Button
          sx={{ px: 1.5, py: 1.7 }}
          label="Save Instances"
          type="button"
          variant="contained"
          disabled={!isDirty}
          onClick={createInstances}
        >
          <SaveIcon fontSize="large" />
        </Button>
      ) : (
        <SaveButton />
      )}
    </Toolbar>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "500px",
  bgcolor: "background.default",
  boxShadow: 10,
  borderRadius: 1,
  p: 4,
  pb: 2,
  color: "text.primary",
};
const BatchInstancesModal = ({ isOpen, toggel, prepend, setIsDirty }) => {
  const [multilineCodes, setMultilineCodes] = useState("");

  const handleParse = (e) => {
    prepend(
      multilineCodes
        .split("\n")
        .filter((val) => Boolean(val))
        .map(
          (code) => code && { code, sold: false, created_on: "", state: "C" }
        )
    );
    setMultilineCodes("");
    setIsDirty(true);
    toggel();
  };
  return (
    <Modal
      open={isOpen}
      onClose={toggel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Code Batch Entry
        </Typography>
        <Typography
          id="modal-modal-description"
          variant="caption"
          sx={{ mt: 2 }}
        >
          Paste your codes here, make sure each code is in its own line and then
          press parse button and all codes are going to be parsed automatically
          and ready to be saved.
        </Typography>
        <br />
        <MuiTextField
          // id="outlined-multiline-static"
          sx={{ width: "100%", mt: 3 }}
          name="multilinecodes"
          label="Codes"
          multiline
          onChange={({ target: { value } }) => setMultilineCodes(value)}
          value={multilineCodes}
          rows={10}
        />
        <Button
          label="Parse"
          type="button"
          variant="contained"
          onClick={handleParse}
          sx={{ mt: 3, px: 2, py: 1 }}
        >
          <BatchAddIcon fontSize="large" />
        </Button>
      </Box>
    </Modal>
  );
};
const ProductInstancesTable = ({
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  showSold,
  setShowSold,
  control,
  register,
  getValues,
  setIsDirty,
  isDirty,
}) => {
  const [openBatchInput, setOpenBatchInput] = useState(false);
  const [editedField, setEditedField] = useState(-1);
  const [refresh, setRefresh] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const { fields, prepend, remove, update, replace, insert } = useFieldArray({
    control,
    name: "instances",
  });
  const record = useRecordContext();
  useEffect(() => {
    if (record)
      replace(
        record?.instances.map((instance) => ({
          ...instance,
          iid: instance?.id,
          state: "O",
        }))
      );
    setIsDirty(false);
  }, [record, replace, refresh, , setIsDirty]);
  console.log(fields);
  return (
    <>
      <Confirm
        isOpen={confirmDialogOpen}
        title="Discard changes"
        content="Changing page will discard all your current changes, are you sure you want to discard all changes?"
        confirm="Discard Changes"
        onConfirm={(e) => {
          confirmDialogOpen[0](confirmDialogOpen[1]);
          setConfirmDialogOpen(false);
        }}
        onClose={(e) => {
          setConfirmDialogOpen(false);
        }}
      />
      <BatchInstancesModal
        isOpen={openBatchInput}
        prepend={prepend}
        setIsDirty={setIsDirty}
        toggel={(e) => setOpenBatchInput((prevState) => !prevState)}
      />
      <div>
        <Button
          label="Add Batch"
          type="button"
          variant="contained"
          onClick={(e) => setOpenBatchInput(true)}
          sx={{ mb: 3, ml: 3 }}
        >
          <BatchAddIcon fontSize="large" />
        </Button>
        <Button
          label="Reset"
          type="button"
          variant="contained"
          onClick={(e) => setRefresh((prevState) => !prevState)}
          sx={{ mb: 3, ml: 3 }}
        >
          <RefreshIcon fontSize="large" />
        </Button>
      </div>
      <InputLabel>
        Show Sold
        <Switch
          checked={showSold}
          onChange={(e) => setShowSold(e.target.checked)}
        />
      </InputLabel>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 400 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#STATE</TableCell>
              <TableCell align="left">Code</TableCell>
              <TableCell align="left">Sold</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map(
              ({ id, code, sold, state }, index) =>
                state !== "D" && (
                  <TableRow key={`${id}${state}`}>
                    <TableCell>{`#${state}`}</TableCell>
                    <TableCell>
                      {editedField === index ? (
                        <Input
                          defaultValue={code}
                          onChange={({ target }) => {
                            update(index, {
                              ...fields[index],
                              code: target.value,
                            });
                            target.focus();
                          }}
                          {...register(`instances.${index}.code`)}
                        />
                      ) : (
                        <InputLabel>{code}</InputLabel>
                      )}
                    </TableCell>
                    <TableCell>
                      {sold ? <CheckIcon /> : <CloseIcon />}
                    </TableCell>
                    <TableCell align="center">
                      {editedField === index ? (
                        <>
                          <Button
                            label="Validate"
                            type="button"
                            variant="outlined"
                            onClick={() => {
                              setEditedField(-1);
                              if (fields[index]?.state !== "C")
                                update(index, {
                                  ...fields[index],
                                  state: "M",
                                  code: getValues(`instances.${index}.code`),
                                });
                              else
                                update(index, {
                                  ...fields[index],
                                  code: getValues(`instances.${index}.code`),
                                });
                              setIsDirty(true);
                            }}
                          >
                            <CheckIcon />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            label="Edit"
                            type="button"
                            variant="outlined"
                            onClick={() => setEditedField(index)}
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            sx={{ mx: 1 }}
                            label="Delete"
                            type="button"
                            variant="outlined"
                            onClick={() => {
                              if (fields[index]?.state !== "C")
                                update(index, { ...fields[index], state: "D" });
                              else remove(index);
                              setIsDirty(true);
                            }}
                          >
                            <CloseIcon />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{ mb: 6 }}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={
          record ? (showSold ? record?.instances_count : record?.count) : 0
        }
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) =>
          !isDirty ? setPage(newPage) : setConfirmDialogOpen([setPage, newPage])
        }
        onRowsPerPageChange={(e) => {
          if (!isDirty) {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          } else {
            setConfirmDialogOpen([
              (newRowsPerPage) => {
                setRowsPerPage(newRowsPerPage);
                setPage(0);
              },
              parseInt(e.target.value, 10),
            ]);
          }
        }}
      />
    </>
  );
};
export const ProductEdit = () => {
  const forceRefresh = useRefresh();
  const [showSold, setShowSold] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isInstancesDirty, setIsInstancesDirty] = useState(false);
  const { control, register, getValues } = useForm();
  useEffect(() => {
    forceRefresh();
  }, [showSold, page, rowsPerPage, forceRefresh]);
  return (
    <Edit
      queryOptions={{ meta: { sold: showSold, page, perPage: rowsPerPage } }}
      transform={({
        id,
        count,
        instances,
        instances_count,
        created_on,
        category,
        orders,
        ...data
      }) => ({
        ...data,
        category_id: category.id,
      })}
    >
      <TabbedForm
        toolbar={
          <ProductEditToolbar
            isDirty={isInstancesDirty}
            getValues={getValues}
          />
        }
      >
        <TabbedForm.Tab label="Summary">
          <TextInput source="name" validate={required()} />
          <ReferenceInput
            label="Category"
            source="category.id"
            reference="categories"
          >
            <SelectInput validate={required()} />
          </ReferenceInput>
          <NumberInput source="price" validate={required()} />
          <NumberInput source="count" disabled />
          <BooleanInput source="hidden" />
          <ImageField
            source="image_url"
            title="Product Image"
            sx={{
              maxWidth: "50px",
              "& img": { maxWidth: 50, maxHeight: 50, objectFit: "contain" },
            }}
          />
          <ImageInput source="image_url">
            <ImageField
              source="src"
              title="Product Image"
              sx={{
                maxWidth: "50px",
                "& img": { maxWidth: 50, maxHeight: 50, objectFit: "contain" },
              }}
            />
          </ImageInput>
        </TabbedForm.Tab>
        <TabbedForm.Tab label="Instances">
          {/* <ArrayInput
            sx={{ overflowY: "scroll", maxHeight: "500px", py: 2 }}
            key={refresh}
            source="instances"
            helperText="Be aware, instances that are sold can't be deleted"
          >
            <SimpleFormIterator
              inline
              disableReordering
              getItemLabel={(index) => `#${page * rowsPerPage + index + 1}`}
            >
              <TextInput source="code" resettable />
              <BooleanInput source="sold" defaultValue={false} disabled />
            </SimpleFormIterator>
          </ArrayInput> */}
          <ProductInstancesTable
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            showSold={showSold}
            setShowSold={setShowSold}
            control={control}
            register={register}
            getValues={getValues}
            setIsDirty={setIsInstancesDirty}
            isDirty={isInstancesDirty}
          />
        </TabbedForm.Tab>
      </TabbedForm>
    </Edit>
  );
};

export const ProductCreate = () => {
  return (
    <Create
      transform={({
        id,
        image_url,
        count,
        instances,
        created_on,
        orders,
        category,
        ...data
      }) => ({
        ...data,
        category_id: category.id,
      })}
    >
      <SimpleForm>
        <TextInput source="name" validate={required()} />
        <ReferenceInput
          label="Category"
          source="category.id"
          reference="categories"
        >
          <SelectInput validate={required()} />
        </ReferenceInput>
        <NumberInput source="price" validate={required()} />
        <BooleanInput source="hidden" />
      </SimpleForm>
    </Create>
  );
};
