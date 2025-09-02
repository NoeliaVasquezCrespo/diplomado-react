import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import type { UserType } from './type';
import { Box, Chip, IconButton, Stack, Tooltip } from '@mui/material';
import {
  Undo as UndoIcon,
  Done as DoneIcon,
  Delete as DeleteIcon,
  Key as KeyIcon,
} from '@mui/icons-material';
import type { GridSortModel } from '@mui/x-data-grid';

interface Props {
  users: UserType[];
  rowCount: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  setSortModel: (model: GridSortModel) => void;
  handleDelete: (id: number) => void;
  handleStatus: (id: number, status: string) => void;
  handleOpenPasswordDialog: (user: UserType) => void;
}

export const UserTabla = ({
  users,
  rowCount,
  paginationModel,
  setPaginationModel,
  setSortModel,
  sortModel,
  handleDelete,
  handleStatus: handlestatus,
  handleOpenPasswordDialog, 
}: Props) => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'username', headerName: 'Username', flex: 1 },
    {
      field: 'status',
      headerName: 'Estado',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value === 'inactive' ? 'Inactivo' : 'Activo'}
          color={params.value === 'inactive' ? 'error' : 'success'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      filterable: false,
      width: 260,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction={'row'} spacing={1}>
          <Tooltip title="Editar usuario">
            <IconButton
              size="small"
              color="info"
              onClick={() => handleOpenPasswordDialog(params.row)}
            >
              <KeyIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={
              params.row.status === 'inactive' ? 'Marcar activo' : 'Marcar inactivo'
            }
          >
            <IconButton
              size="small"
              color={params.row.status === 'inactive' ? 'success' : 'warning'}
              onClick={() => handlestatus(params.row.id, params.row.status)}
            >
              {params.row.status === 'inactive' ? (
                <DoneIcon fontSize="small" />
              ) : (
                <UndoIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box height={545}>
      <DataGrid
        rows={users}
        columns={columns}
        rowCount={rowCount}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingMode={'server'}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        pageSizeOptions={[5, 10, 20]}
        disableColumnFilter
      />
    </Box>
  );
};
