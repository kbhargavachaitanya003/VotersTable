import React, { useEffect, useState } from 'react';
import { useVoters } from './useVoters';
import { Voter } from './types';
import { useVoterStore } from '../Store/Store';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Menu, MenuItem, TablePagination, TextField, Toolbar, Typography} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChangeVoter from './ChangeVoter';
import '../Styles/VoterTable.css';

const VoterTable = () => {
    const { data, isLoading, error } = useVoters();
    const setVoters = useVoterStore((state) => state.setVoters);
    const voters = useVoterStore((state) => state.voters);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentVoter, setCurrentVoter] = useState<null | Voter>(null);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (data) {
            setVoters(data);
        }
    }, [data, setVoters]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, voter: Voter) => {
        setAnchorEl(event.currentTarget);
        setCurrentVoter(voter);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeVoter = () => {
        setIsEditMode(true);
        handleClose();
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const filteredVoters = voters.filter((voter: Voter) =>
        voter.status.toLowerCase().includes(filter.toLowerCase()) ||
        voter.dlStateId.toString().includes(filter) ||
        voter.ssn.includes(filter) ||
        voter.registrationDate.includes(filter) ||
        voter.dateOfBirth.includes(filter) ||
        voter.address.toLowerCase().includes(filter.toLowerCase()) ||
        voter.firstName.toLowerCase().includes(filter.toLowerCase()) ||
        voter.lastName.toLowerCase().includes(filter.toLowerCase()) ||
        voter.voterRegistration.toString().includes(filter) ||
        voter.county.toLowerCase().includes(filter.toLowerCase()) ||
        voter.party.toLowerCase().includes(filter.toLowerCase())
    );

    const displayedVoters = filteredVoters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if(isLoading) return <div className='loading'>Loading...</div>

    if(error) return <div className='error'>Error while fetching voters</div>

    return (
        <div className="voter-table-container">
                {isEditMode && currentVoter && (
                    <ChangeVoter currentVoter={currentVoter} isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
                )}
            <Paper>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Voters
                    </Typography>
                    <TextField
                        label="Filter"
                        variant="outlined"
                        size="small"
                        value={filter}
                        onChange={handleFilterChange}
                    />
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={filteredVoters.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Toolbar>
                <TableContainer className="table-container">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Status</TableCell>
                                <TableCell>Voter Registration</TableCell>
                                <TableCell>Registration Date</TableCell>
                                <TableCell>DL/State ID</TableCell>
                                <TableCell>SSN</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Date Of Birth</TableCell>
                                <TableCell>County</TableCell>
                                <TableCell>Party</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedVoters.map((voter: Voter) => (
                                <TableRow key={voter.voterRegistration}>
                                    <TableCell>
                                        <div className={voter.status.toLowerCase() === 'active' ? 'status-active' : 'status-pending'}>
                                            {voter.status}
                                        </div>
                                    </TableCell>
                                    <TableCell>{voter.voterRegistration}</TableCell>
                                    <TableCell>{voter.registrationDate}</TableCell>
                                    <TableCell>{voter.dlStateId}</TableCell>
                                    <TableCell>{voter.ssn}</TableCell>
                                    <TableCell>{voter.lastName}</TableCell>
                                    <TableCell>{voter.firstName}</TableCell>
                                    <TableCell>{voter.dateOfBirth}</TableCell>
                                    <TableCell>{voter.county}</TableCell>
                                    <TableCell>{voter.party}</TableCell>
                                    <TableCell>{voter.address}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={(event) => handleClick(event, voter)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                            classes={{ paper: 'menu-paper' }}
                                        >
                                            <MenuItem onClick={handleClose}>View Voter</MenuItem>
                                            <MenuItem onClick={handleChangeVoter}>Change Voter</MenuItem>
                                            <MenuItem onClick={handleClose}>Transfer Voter</MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
};

export default VoterTable;
