import { Box } from '@mui/material';
import {
  UserDialog,
  UserFilter,
  UserHeader,
  UserTabla,
  type UserActionState,
} from '../../components/users';
import { useEffect, useState } from 'react';
import type { UserFilterStatusType, UserType } from '../../components/users/type';
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useAlert, useAxios } from '../../hooks';
import { errorHelper, hanleZodError } from '../../helpers';
import { schemaUser, type UserFormValues } from '../../models';
import UserEditInfoDialog from '../../components/users/UserEditInfoDialog';


export const UsersPage = () => {
  const { showAlert } = useAlert();
  const axios = useAxios();

  const [filterStatus, setFilterStatus] = useState<UserFilterStatusType>('all');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [total, setTotal] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  useEffect(() => {
    listUserApi();
  }, [search, filterStatus, paginationModel, sortModel]);

  const listUserApi = async () => {
    try {
      const orderBy = sortModel[0]?.field;
      const orderDir = sortModel[0]?.sort;
      const response = await axios.get('/users', {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          orderBy,
          orderDir,
          search,
          status: filterStatus === 'all' ? undefined : filterStatus,
        },
      });
      setUsers(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      showAlert(errorHelper(error), 'error');
    }
  };

  const handleOpenCreateDialog = () => {
    setOpenDialog(true);
    setUser(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUser(null);
  };

  const handleOpenPasswordDialog = (user: UserType) => {
    setUser(user);
    setOpenPasswordDialog(true);
  };

  const handleClosePasswordDialog = () => {
    setUser(null);
    setOpenPasswordDialog(false);
  };

  const handleCreateEdit = async (
    _: UserActionState | undefined,
    formdata: FormData
  ) => {
    const username = formdata.get('username') as string;
    const password = formdata.get('password') as string;
    const confirmPassword = formdata.get('confirmPassword') as string;

    const rawData: any = { username };

    if (!user || password.trim()) {
      rawData.password = password;
      rawData.confirmPassword = confirmPassword;
    }

    try {
      schemaUser.parse(rawData);
      await axios.post('/users', rawData);
      showAlert('Usuario creado', 'success');
      listUserApi();
      handleCloseDialog();
      return;
    } catch (error) {
      const err = hanleZodError<UserFormValues>(error, rawData);
      showAlert(err.message, 'error');
      return err;
    }
  };

  const handleUpdatePassword = async (
    id: number,
    data: { username?: string; password?: string }
  ) => {
    try {
      await axios.put(`/users/${id}`, data); 
      showAlert('Usuario actualizado', 'success');
      listUserApi();
      handleClosePasswordDialog();
    } catch (error) {
      showAlert(errorHelper(error), 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const confirmed = window.confirm('¿Está seguro de eliminar al usuario?');
      if (!confirmed) return;

      await axios.delete(`/users/${id}`);
      showAlert('Usuario eliminado', 'success');
      listUserApi();
    } catch (error) {
      showAlert(errorHelper(error), 'error');
    }
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      const confirmed = window.confirm(
        '¿Está seguro de que quieres cambiar el estado del usuario?'
      );
      if (!confirmed) return;

      const response = status === 'inactive' ? 'active' : 'inactive';

      await axios.patch(`/users/${id}`, { status: response });
      showAlert('Estado del usuario modificado', 'success');
      listUserApi();
    } catch (error) {
      showAlert(errorHelper(error), 'error');
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <UserHeader handleOpenCreateDialog={handleOpenCreateDialog} />

      <UserFilter
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setSearch={setSearch}
      />

      <UserTabla
        users={users}
        rowCount={total}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        sortModel={sortModel}
        setSortModel={setSortModel}
        handleDelete={handleDelete}
        handleStatus={handleStatus}
        handleOpenPasswordDialog={handleOpenPasswordDialog}
      />

      <UserDialog
        open={openDialog}
        onClose={handleCloseDialog}
        handleCreate={handleCreateEdit}
      />

      <UserEditInfoDialog
        open={openPasswordDialog}
        user={user}
        onClose={handleClosePasswordDialog}
        onSave={handleUpdatePassword}
      />
    </Box>
  );
};
