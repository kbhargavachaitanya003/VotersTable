import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useVoterStore } from '../Store/Store';
import { Voter } from '../Components/types';
import { Paper, Typography, FormControl, InputLabel, Select, TextField, Button, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import '../Styles/ChangeVoter.css';

interface ChangeVoterProps {
    currentVoter: Voter | null;
    isEditMode: boolean;
    setIsEditMode: (mode: boolean) => void;
}

const ChangeVoter: React.FC<ChangeVoterProps> = ({ currentVoter, isEditMode, setIsEditMode }) => {
    const { register, handleSubmit, formState, setValue, reset } = useForm<Voter>();
    const { errors } = formState;
    const setVoters = useVoterStore((state) => state.setVoters);
    const voters = useVoterStore((state) => state.voters);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (currentVoter) {
            setValue('status', currentVoter.status);
            setValue('voterRegistration', currentVoter.voterRegistration);
            setValue('registrationDate', currentVoter.registrationDate);
            setValue('dlStateId', currentVoter.dlStateId);
            setValue('ssn', currentVoter.ssn);
            setValue('firstName', currentVoter.firstName);
            setValue('lastName', currentVoter.lastName);
            setValue('dateOfBirth', currentVoter.dateOfBirth);
            setValue('county', currentVoter.county);
            setValue('party', currentVoter.party);
            setValue('address', currentVoter.address);
        } else {
            reset();
        }
    }, [currentVoter, setValue, reset]);

    const onSubmit: SubmitHandler<Voter> = async (data) => {
        setIsSubmitting(true);
        try {
            let updatedVoters: Voter[] = [];
            if (isEditMode && currentVoter) {
                const updatedVoter = { ...currentVoter, ...data };
                await axios.put(
                    `http://localhost:3001/voters/${currentVoter.id}`,
                    updatedVoter
                );
                updatedVoters = voters.map(voter => voter.voterRegistration === currentVoter.voterRegistration ? updatedVoter : voter);
            } else {
                updatedVoters = [...voters, data];
            }
    
            setVoters(updatedVoters);
            setIsEditMode(false);
        } catch (error) {
            console.error('Error updating voter data:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const statusOptions = ['ACTIVE', 'PENDING'];

    return (
        <Paper className="edit-voter-form">
            {isSubmitting && (
                <div className="loader-overlay">
                    <CircularProgress/>
                </div>
            )}
            <Typography variant="h6" component="div">
                Change Voter
            </Typography>
            <form className="edit-voter-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="status-select">Status*</InputLabel>
                    <Select
                        label="Status*"
                        native
                        {...register('status', { required: true })}
                        error={!!errors.status}
                        inputProps={{ id: 'status-select' }}
                    >
                        {statusOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label={errors.dlStateId?.message || "DL/State ID*"}
                    variant="outlined"
                    {...register('dlStateId', {
                        required: {
                            value: true,
                            message: 'DL/State ID is required'
                        },
                        pattern: {
                            value: /^[0-9]{6}$/,
                            message: 'Incorrect DL/State ID'
                        }
                    })}
                    error={!!errors.dlStateId}
                />
                <TextField
                    label={errors.ssn?.message || "SSN*"}
                    variant="outlined"
                    {...register('ssn', { required:{
                        value: true,
                        message: 'SSN is required'
                        },
                        pattern: {
                            value: /^xxx-xxx-[0-9]{4}$/,
                            message: 'Incorrect DL/State ID'
                        } 
                    })}
                    error={!!errors.ssn}
                />
                <TextField
                    label={errors.lastName?.message || "Last Name*"}
                    variant="outlined"
                    {...register('lastName', { required:{
                        value: true,
                        message: 'Last Name is required'
                    }})}
                    error={!!errors.lastName}
                />
                <TextField
                    label={errors.firstName?.message || "First Name*"}
                    variant="outlined"
                    {...register('firstName', { required:{
                        value: true,
                        message: 'First Name is required'
                    } })}
                    error={!!errors.firstName}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        label="Date Of Birth" 
                        defaultValue={currentVoter?.dateOfBirth ? dayjs(currentVoter.dateOfBirth) : null}
                        
                        {...register('dateOfBirth')}
                        onChange={(value) => {
                            setValue('dateOfBirth', value ? dayjs(value).format('MM/DD/YYYY') : '');
                        }}
                    />
                </LocalizationProvider>
                <TextField
                    label="County"
                    variant="outlined"
                    {...register('county')}
                />
                <TextField
                    label="Party"
                    variant="outlined"
                    {...register('party')}
                />
                <TextField
                    label="Address"
                    variant="outlined"
                    {...register('address')}
                    fullWidth
                    className='address'
                />
                <div className="buttons">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsEditMode(false)}
                        className="cancel-button"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="save-button"
                        disabled={isSubmitting}
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Paper>
    );
};

export default ChangeVoter;
