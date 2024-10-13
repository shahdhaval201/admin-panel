import * as React from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { visuallyHidden } from '@mui/utils';
import { useDispatch, useSelector } from 'react-redux'; // For accessing and dispatching state
import { deleteProject,updateProject } from '../../store/projectSlice'; // Import delete action
import AddProjectForm from '../../components/projects/AddProjectForm'; // Import the form component
import ProjectPage from 'components/projects/ProjectPage';
import { fetchProjects } from '../../store/projectSlice';


function createData(id, customerName, referenceNumber, projectName, projectNumber, dueDate, status) {
  return {
    id,
    customerName,
    referenceNumber,
    projectName,
    projectNumber,
    dueDate,
    status,
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  { id: 'customerName', numeric: false, disablePadding: true, label: 'Customer Name' },
  { id: 'referenceNumber', numeric: true, disablePadding: false, label: 'Reference Number' },
  { id: 'projectName', numeric: false, disablePadding: false, label: 'Project Name' },
  { id: 'projectNumber', numeric: true, disablePadding: false, label: 'Project Number' },
  { id: 'dueDate', numeric: true, disablePadding: false, label: 'Due Date' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all projects',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Project List
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add Project">
          <IconButton>
            <ProjectPage />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function ProjectTable() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects || []); // Ensure projects is an array
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('projectName');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openAddForm, setOpenAddForm] = React.useState(false); // State to toggle form visibility
  const [selectedProject, setSelectedProject] = React.useState(null); // To manage the project to be updated

  console.log("selectedProject------->",selectedProject)
  const [openEditModal, setOpenEditModal] = React.useState(false); // Manage modal visibility


  const rows = projects.map((project) =>
    createData(
      project.id,
      project.customerName,
      project.referenceNumber,
      project.projectName,
      project.projectNumber,
      project.dueDate,
      project.status
    )
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = projects.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project); // Set the project to be updated
    setOpenEditModal(true); // Open the modal
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedProject(null); // Reset the selected project
  };

  const handleUpdateProject = (updatedProject) => {
    console.log("updatedProject in handleUpdateProject----->", updatedProject);  // Check the structure
    
    const projectId = updatedProject?.id;  // Ensure the project has an `id` property
    if (!projectId) {
        console.error("No project ID found. Unable to update project.");
        return;
    }

    const projectData = { 
        customerName: updatedProject?.customerName, 
        referenceNumber: updatedProject?.referenceNumber, 
        projectName: updatedProject?.projectName, 
        projectNumber: updatedProject?.projectNumber, 
        areaLocation: updatedProject?.areaLocation, 
        address: updatedProject?.address, 
        dueDate: updatedProject?.dueDate, 
        contact: updatedProject?.contact, 
        manager: updatedProject?.manager, 
        staff: updatedProject?.staff, 
        status: updatedProject?.status 
    };

    console.log("projectData to be sent----->", projectData);  // Ensure it contains all fields except id
    
    // Dispatch the action with the correct payload
    dispatch(updateProject({ id: projectId, projectData }));
    
    handleCloseEditModal();
};


  const handleDelete = () => {
    selected.forEach((id) => {
      dispatch(deleteProject(id));
    });
    setSelected([]);
  };

  useEffect(() => {
    fetch('db.json')  // Ensure the correct path to the JSON file
      .then((response) => response.json())
      .then((data) => {
        dispatch(fetchProjects(data.projects));
      })
      .catch((error) => {
        console.error("Error loading projects:", error);
      });
  }, [dispatch]);

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, order, orderBy, page, rowsPerPage]
  );

  return (
    <>
      <EnhancedTableToolbar numSelected={selected.length} />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row) => {
                  const isItemSelected = selected.indexOf(row.id) !== -1;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': `enhanced-table-checkbox-${row.id}`,
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">{row.customerName}</TableCell>
                      <TableCell align="right">{row.referenceNumber}</TableCell>
                      <TableCell align="left">{row.projectName}</TableCell>
                      <TableCell align="right">{row.projectNumber}</TableCell>
                      <TableCell align="right">{row.dueDate}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">
                      <Tooltip title="Edit Project">
                          <IconButton onClick={() => handleEditProject(row)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Project">
                          <IconButton onClick={() => dispatch(deleteProject(row.id))}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {/* Edit Project Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="md" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <AddProjectForm
            project={selectedProject} // Pass the project to be edited
            onSave={handleUpdateProject} // Update the project when saved
            onClose={handleCloseEditModal}
          />
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleCloseEditModal}>Cancel</IconButton>
        </DialogActions>
      </Dialog>

    </>
  );
}

